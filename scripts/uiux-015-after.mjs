import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import { MongoClient } from "mongodb";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) process.loadEnvFile(".env.local");

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const runId = Date.now().toString(36);
const email = `source-uiux-015-${runId}@example.test`;
const password = `SourceUi-${runId}-ReviewPass!`;
const screenshotDir = "docs/uiux-015/source-screenshots";
mkdirSync(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function shot(name, width = 1440) {
  await page.setViewportSize({ width, height: 900 });
  await page.screenshot({ path: `${screenshotDir}/${name}-${width}.png`, fullPage: true });
}

try {
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const mobileLayout = {};
  for (const width of [1440, 1280, 768, 390, 320]) {
    await shot("landing", width);
    mobileLayout[width] = await page.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1 }));
  }
  if (mobileLayout[390].horizontalOverflow || mobileLayout[320].horizontalOverflow) throw new Error(`mobile horizontal overflow at 390px or 320px: ${JSON.stringify(mobileLayout)}`);
  await shot("landing-auth", 1440);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("textbox", { name: "Display name" }).fill("Source UI Review");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Create my account", exact: true }).click();
  await page.getByRole("heading", { name: "Let your existing work do the introducing." }).waitFor({ state: "visible", timeout: 15_000 });
  await shot("onboarding", 1440);

  const urlBox = page.getByRole("textbox", { name: "Public website URL" });
  await urlBox.fill("http://127.0.0.1:1/");
  await page.getByRole("button", { name: "Analyze website", exact: true }).click();
  await page.getByRole("alert").filter({ hasText: "We couldn't analyze that page." }).waitFor({ state: "visible", timeout: 15_000 });
  const errorInputPreserved = (await urlBox.inputValue()) === "http://127.0.0.1:1/";
  await page.screenshot({ path: `${screenshotDir}/url-error-1440.png`, fullPage: true });

  await urlBox.fill("https://www.frog.co/");
  const analysisResponsePromise = page.waitForResponse((response) => response.url().includes("/api/profile/analyze"), { timeout: 90_000 });
  await page.getByRole("button", { name: "Analyze website", exact: true }).click();
  await page.screenshot({ path: `${screenshotDir}/analysis-loading-1440.png`, fullPage: true });
  const analysisResponse = await analysisResponsePromise;
  if (!analysisResponse.ok()) throw new Error(`profile analysis returned HTTP ${analysisResponse.status()}`);
  await page.getByRole("heading", { name: "Keep what the page can support." }).waitFor({ state: "visible", timeout: 90_000 });
  await shot("profile-review", 1440);

  const evidenceVisible = await page.locator(".evidence-tray").isVisible();
  const editorVisible = await page.locator(".editor-card").isVisible();
  if (!evidenceVisible || !editorVisible) throw new Error("profile evidence or editor was not visible");
  const keywordBox = page.getByRole("textbox", { name: "Search keywords" });
  await keywordBox.fill(`${await keywordBox.inputValue()}, evidence review`);
  await page.locator(".editor-card button.button-primary").click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });
  await shot("customer-selection", 1440);

  const checkboxes = page.getByRole("checkbox");
  for (let index = 0; index < await checkboxes.count(); index += 1) await checkboxes.nth(index).check();
  await page.screenshot({ path: `${screenshotDir}/customer-selection-all-1440.png`, fullPage: true });

  const searchResponsePromise = page.waitForResponse((response) => response.url().includes("/api/opportunities/search"), { timeout: 90_000 });
  await page.getByRole("button", { name: "Find customer signals", exact: true }).click();
  const searchResponse = await searchResponsePromise;
  if (!searchResponse.ok()) throw new Error(`opportunity search returned HTTP ${searchResponse.status()}`);
  await page.getByRole("heading", { name: "Inspect the evidence before you act." }).waitFor({ state: "visible", timeout: 90_000 });
  await shot("results", 1440);

  const opportunityCards = page.locator(".opportunity-card");
  let savedAndDrafted = false;
  if (await opportunityCards.count()) {
    await opportunityCards.first().getByRole("button", { name: /Save and draft proposal|Draft proposal|Save and draft outreach|Draft outreach/ }).click();
    await page.getByRole("heading", { name: /Editable application draft|Saved proposal draft|Cautious outreach draft/ }).waitFor({ state: "visible", timeout: 90_000 });
    savedAndDrafted = true;
    await page.screenshot({ path: `${screenshotDir}/proposal-1440.png`, fullPage: true });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: /My pipeline/ }).click();
    await page.getByRole("heading", { name: "Keep the next step visible." }).waitFor({ state: "visible", timeout: 30_000 });
    await page.screenshot({ path: `${screenshotDir}/saved-return-1440.png`, fullPage: true });
    const savedLink = page.locator(".saved-link").first();
    if (await savedLink.count()) {
      await savedLink.click();
      await page.getByRole("heading", { name: /Editable application draft|Saved proposal draft|Cautious outreach draft/ }).waitFor({ state: "visible", timeout: 30_000 });
      await page.screenshot({ path: `${screenshotDir}/recovered-opportunity-1440.png`, fullPage: true });
    }
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await page.getByRole("textbox", { name: "Email" }).waitFor({ state: "visible", timeout: 15_000 });
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.locator(".auth-switch button").click();
    await page.getByRole("heading", { name: "Pick up where your work left off." }).waitFor({ state: "visible", timeout: 15_000 });
    await page.locator(".auth-card form button.button-primary").click();
    await page.getByRole("button", { name: /My pipeline/ }).click();
    await page.getByRole("heading", { name: "Keep the next step visible." }).waitFor({ state: "visible", timeout: 30_000 });
    await page.screenshot({ path: `${screenshotDir}/logout-login-recovery-1440.png`, fullPage: true });
  }

  console.log(JSON.stringify({ status: "pass", stages: ["landing", "account", "onboarding", "url-error", "analysis-loading", "live-analysis", "profile-edit", "customer-selection", "discovery"].concat(savedAndDrafted ? ["proposal", "refresh-recovery", "logout-login-recovery"] : []), profileAnalysisHttpStatus: analysisResponse.status(), discoveryHttpStatus: searchResponse.status(), evidenceVisible, editorVisible, errorInputPreserved, savedAndDrafted, mobileLayout, sourceUrl: "https://www.frog.co/" }));
} catch (error) {
  await page.screenshot({ path: `${screenshotDir}/flow-error-1440.png`, fullPage: true }).catch(() => undefined);
  console.log(JSON.stringify({ status: "fail", reason: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
} finally {
  await browser.close();
  if (process.env.MONGODB_URI && process.env.MONGODB_DB) {
    const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8_000 });
    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const users = await db.collection("users").find({ email }).project({ _id: 1 }).toArray();
      const ids = users.map((user) => user._id);
      if (ids.length) {
        await db.collection("profiles").deleteMany({ userId: { $in: ids } });
        await db.collection("opportunities").deleteMany({ userId: { $in: ids } });
      }
      await db.collection("users").deleteMany({ email });
      console.log(JSON.stringify({ cleanup: "pass", deletedTestAccounts: ids.length }));
    } catch (error) {
      console.log(JSON.stringify({ cleanup: "fail", message: error instanceof Error ? error.message : String(error) }));
      process.exitCode = 1;
    } finally {
      await client.close().catch(() => undefined);
    }
  }
}
