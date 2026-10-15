import { createRequire } from "node:module";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const referenceUrl = "https://laudable-fly-396.convex.site/";
const screenshotDir = "docs/uiux-015/reference-screenshots";
mkdirSync(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text().slice(0, 300)); });

const inspection = {
  referenceUrl,
  capturedAt: new Date().toISOString(),
  viewports: {},
  page: {},
  typography: {},
  palette: {},
  interactions: {},
  limitations: []
};

async function capture(name, width, fullPage = true) {
  await page.setViewportSize({ width, height: 900 });
  await page.screenshot({ path: `${screenshotDir}/${name}-${width}.png`, fullPage });
  const metrics = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyHeight: document.body.scrollHeight,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    scrollY: window.scrollY,
  }));
  inspection.viewports[width] = metrics;
}

try {
  await page.goto(referenceUrl, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(2_000);

  inspection.page = await page.evaluate(() => ({
    title: document.title,
    headings: [...document.querySelectorAll("h1,h2,h3")].map((node) => node.textContent?.trim()).filter(Boolean).slice(0, 40),
    links: [...document.querySelectorAll("a")].map((node) => ({ text: node.textContent?.trim().slice(0, 120), href: node.href })).slice(0, 60),
    buttons: [...document.querySelectorAll("button")].map((node) => ({ text: node.textContent?.trim().slice(0, 120), aria: node.getAttribute("aria-label") })).slice(0, 40),
    inputs: [...document.querySelectorAll("input,textarea,select")].map((node) => ({ tag: node.tagName, type: node.getAttribute("type"), placeholder: node.getAttribute("placeholder"), aria: node.getAttribute("aria-label") })).slice(0, 30),
    images: [...document.images].map((image) => ({ alt: image.alt, width: image.naturalWidth, height: image.naturalHeight, sourceHost: (() => { try { return new URL(image.currentSrc || image.src).host; } catch { return null; } })() })).slice(0, 20),
    sectionCount: document.querySelectorAll("section,main,footer,nav").length,
  }));

  inspection.typography = await page.evaluate(() => {
    const pick = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const style = getComputedStyle(node);
      return { selector, text: node.textContent?.trim().slice(0, 140), family: style.fontFamily, size: style.fontSize, weight: style.fontWeight, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, color: style.color };
    };
    return ["body", "h1", "h2", "nav", "button", "p"].map((selector) => pick(selector));
  });

  inspection.palette = await page.evaluate(() => {
    const pick = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const style = getComputedStyle(node);
      return { selector, background: style.backgroundColor, color: style.color, border: style.borderColor, shadow: style.boxShadow };
    };
    return ["body", "header", "main", "button", "a", "section", "footer"].map((selector) => pick(selector));
  });

  await capture("reference-full", 1440, true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.screenshot({ path: `${screenshotDir}/reference-hero-1440.png`, fullPage: false });

  for (const width of [1280, 768, 390, 320]) await capture("reference-full", width, true);

  await page.setViewportSize({ width: 1440, height: 900 });
  const firstButton = page.locator("button").first();
  if (await firstButton.count()) {
    await firstButton.hover().catch(() => undefined);
    await page.screenshot({ path: `${screenshotDir}/reference-hover-1440.png`, fullPage: false });
    await firstButton.focus().catch(() => undefined);
    await page.screenshot({ path: `${screenshotDir}/reference-focus-1440.png`, fullPage: false });
  } else {
    inspection.limitations.push("No button was available for hover/focus capture.");
  }

  const signUpButton = page.getByRole("button", { name: "Sign up", exact: true });
  if (await signUpButton.count()) {
    await signUpButton.click().catch(() => undefined);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${screenshotDir}/reference-sign-up-1440.png`, fullPage: true });
    inspection.interactions.signUpAfterClick = await page.evaluate(() => ({ url: location.href, headings: [...document.querySelectorAll("h1,h2,h3")].map((node) => node.textContent?.trim()).filter(Boolean).slice(0, 20), dialogs: document.querySelectorAll("[role=dialog],dialog").length }));
    await page.goto(referenceUrl, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(500);
  }

  await page.setViewportSize({ width: 390, height: 900 });
  const mobileControls = await page.locator("button").allTextContents();
  inspection.interactions = {
    signUpAfterClick: inspection.interactions.signUpAfterClick || null,
    buttonTexts: mobileControls.map((text) => text.trim()).filter(Boolean).slice(0, 20),
    buttonCount: await page.locator("button").count(),
    linkCount: await page.locator("a").count(),
    activeElementAfterFocus: await page.evaluate(() => document.activeElement?.tagName || null),
    reducedMotion: await page.emulateMedia({ reducedMotion: "reduce" }).then(async () => page.evaluate(() => getComputedStyle(document.body).animationDuration)).catch(() => null),
  };
  await page.emulateMedia({ reducedMotion: "no-preference" });

  if (consoleErrors.length) inspection.limitations.push(`Reference console errors observed: ${consoleErrors.length} (details omitted from summary).`);
  writeFileSync("docs/uiux-015/reference-inspection.json", JSON.stringify(inspection, null, 2));
  console.log(JSON.stringify({ status: "pass", referenceUrl, viewportWidths: [320, 390, 768, 1280, 1440], screenshotDir, headingCount: inspection.page.headings.length, buttonCount: inspection.page.buttons.length, horizontalOverflow: Object.fromEntries(Object.entries(inspection.viewports).map(([width, metrics]) => [width, metrics.horizontalOverflow])) }));
} catch (error) {
  inspection.limitations.push(error instanceof Error ? error.message : String(error));
  writeFileSync("docs/uiux-015/reference-inspection.json", JSON.stringify(inspection, null, 2));
  console.log(JSON.stringify({ status: "fail", referenceUrl, reason: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
} finally {
  await browser.close();
}
