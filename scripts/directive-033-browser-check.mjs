import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { MongoClient } from "mongodb";

const require = createRequire(import.meta.url);
const { chromium } = require("C:\\Users\\HomePC\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright");

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) process.loadEnvFile(".env.local");

const baseUrl = (process.env.SOURCE_LOCAL_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const runId = Date.now().toString(36);
const email = `source-directive-033-${runId}@example.test`;
const password = `Source-${runId}-BrowserCheck!`;
const reachUrl = "https://reach-seven-lemon.vercel.app/";
const mindshareUrl = "https://www.mindshareworld.com/services";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function responseJson(responsePromise) {
  const response = await responsePromise;
  const data = await response.json().catch(() => ({}));
  assert(response.ok(), `HTTP ${response.status()} from ${response.url()}`);
  return data;
}

async function chooseAllCustomerTypes() {
  const checkboxes = page.getByRole("checkbox");
  for (let index = 0; index < await checkboxes.count(); index += 1) {
    if (!(await checkboxes.nth(index).isChecked())) await checkboxes.nth(index).check();
  }
}

async function search(modeName) {
  const modeRadio = page.getByRole("radio", { name: modeName, exact: true });
  if (await modeRadio.count()) await modeRadio.check();
  await chooseAllCustomerTypes();
  const responsePromise = page.waitForResponse((response) => response.url().includes("/api/opportunities/search"), { timeout: 120_000 });
  await page.getByRole("button", { name: "Find customer signals", exact: true }).click();
  const data = await responseJson(responsePromise);
  await page.getByRole("heading", { name: "Inspect the evidence before you act." }).waitFor({ state: "visible", timeout: 120_000 });
  return data;
}

async function measureViewport(label) {
  return { label, ...(await page.evaluate(() => {
    const signOut = [...document.querySelectorAll("button")].find((button) => button.textContent?.trim().toLowerCase() === "sign out");
    const rect = signOut?.getBoundingClientRect();
    return {
      viewport: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      signOut: rect ? { left: Number(rect.left.toFixed(3)), right: Number(rect.right.toFixed(3)), width: Number(rect.width.toFixed(3)), visible: rect.right <= window.innerWidth && rect.left >= 0 } : null,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth,
      overflowingElements: [...document.querySelectorAll("*")].filter((element) => element.scrollWidth > element.clientWidth + 1).slice(0, 8).map((element) => ({ tag: element.tagName, className: typeof element.className === "string" ? element.className : "", scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120) })),
      opportunityChildren: [...document.querySelectorAll(".opportunity-list > *")].slice(0, 3).map((element) => ({ className: typeof element.className === "string" ? element.className : "", scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 160) })),
    };
  })) };
}

async function measureAtWidths(label) {
  const measurements = [];
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 });
    measurements.push(await measureViewport(`${label}-${width}`));
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  return measurements;
}

async function cleanup() {
  if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) return { status: "skipped" };
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
    return { status: "pass", deletedTestAccounts: ids.length };
  } finally {
    await client.close().catch(() => undefined);
  }
}

let productSearch;
let serviceSearch;
let profileMeasurements;
let productResultsMeasurements;
let serviceResultsMeasurements;
try {
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "Display name" }).fill("Directive 033 Reach and Service");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Create my account", exact: true }).click();
  await page.getByRole("heading", { name: "Let your existing work do the introducing." }).waitFor({ state: "visible", timeout: 30_000 });

  await page.getByRole("textbox", { name: "Public website URL" }).fill(reachUrl);
  const reachAnalysisPromise = page.waitForResponse((response) => response.url().includes("/api/profile/analyze"), { timeout: 120_000 });
  await page.getByRole("button", { name: "Analyze website", exact: true }).click();
  const reachAnalysis = await responseJson(reachAnalysisPromise);
  assert(reachAnalysis.profile?.sourceUrl?.includes("reach-seven-lemon.vercel.app"), "Reach analysis was not grounded in the requested public page");
  await page.getByRole("heading", { name: "Keep what the page can support." }).waitFor({ state: "visible", timeout: 120_000 });
  await page.getByRole("textbox", { name: "Services and products" }).fill("Passkey-based payment interactions\nPeer-to-peer payment flows\nClaim-link payments\nTest-token payment demonstrations");
  await page.getByRole("textbox", { name: "Skills and technologies" }).fill("Passkey account flows\nPeer-to-peer payment workflows");
  await page.getByRole("textbox", { name: "Search keywords" }).fill("passkey payments, peer-to-peer payments, claim-link payments, test-token payments");
  await page.getByLabel("Offering type", { exact: true }).selectOption("product-owner");
  await page.getByLabel("Discovery objective", { exact: true }).selectOption("product-users");
  profileMeasurements = await measureAtWidths("product-profile-confirmation");
  await page.getByRole("button", { name: /Confirm offering and choose an audience|Save profile and continue/ }).click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });

  productSearch = await search("Potential customers + research");
  const productOpportunities = productSearch.opportunities || [];
  const productProviders = Object.fromEntries((productSearch.providers || []).map((provider) => [provider.provider, provider.status]));
  assert(productSearch.policy?.mode === "potential-customers", "Reach did not remain in server-enforced product discovery mode");
  assert(productProviders["Contracts Finder"] === "skipped", "Reach product-owner discovery queried Contracts Finder");
  assert(productOpportunities.every((item) => item.source !== "Contracts Finder"), "Reach product-owner results contained service procurement records");
  assert(!productOpportunities.some((item) => /Northampton College|Oracy Framework|media planning|expert panel/i.test(`${item.title} ${item.organization} ${item.description}`)), "Reach product-owner results contained an unrelated live tender");
  productResultsMeasurements = await measureAtWidths("product-results");

  await page.getByRole("button", { name: "Adjust search", exact: true }).first().click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await page.getByRole("heading", { name: "Let your existing work do the introducing." }).waitFor({ state: "visible", timeout: 30_000 });
  await page.getByRole("textbox", { name: "Public website URL" }).fill(mindshareUrl);
  const mindshareAnalysisPromise = page.waitForResponse((response) => response.url().includes("/api/profile/analyze"), { timeout: 120_000 });
  await page.getByRole("button", { name: "Analyze website", exact: true }).click();
  const mindshareAnalysis = await responseJson(mindshareAnalysisPromise);
  assert(mindshareAnalysis.profile?.sourceUrl?.includes("mindshareworld.com"), "service-provider analysis was not grounded in the Mindshare public page");
  await page.getByRole("heading", { name: "Keep what the page can support." }).waitFor({ state: "visible", timeout: 120_000 });
  await page.getByRole("textbox", { name: "Services and products" }).fill("Media planning\nMedia buying\nMarketing communications");
  await page.getByRole("textbox", { name: "Skills and technologies" }).fill("Audience strategy\nCampaign measurement");
  await page.getByRole("textbox", { name: "Search keywords" }).fill("media planning, media buying, marketing communications, audience strategy");
  await page.getByLabel("Offering type", { exact: true }).selectOption("service-provider");
  await page.getByLabel("Discovery objective", { exact: true }).selectOption("external-services");
  await page.getByRole("button", { name: /Confirm offering and choose an audience|Save profile and continue/ }).click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });

  serviceSearch = await search("Active requests");
  const serviceOpportunities = serviceSearch.opportunities || [];
  const northampton = serviceOpportunities.find((item) => /Northampton College/i.test(`${item.title} ${item.organization} ${item.description}`));
  assert(northampton?.source === "Contracts Finder", "service-provider journey did not surface the live Northampton procurement notice");
  assert(northampton.prospectType === "active-request" && northampton.buyerIntent === "confirmed", "Northampton was not classified as a confirmed active request");
  assert(northampton.buyerName && northampton.organization && northampton.noticeStatus === "active", "Northampton buyer/status evidence was incomplete");
  assert(northampton.deadline && new Date(northampton.deadline).getTime() > Date.now(), "Northampton deadline was missing or not future-dated");
  assert(northampton.sourceUrl.includes("contractsfinder.service.gov.uk/Notice/"), "Northampton official source URL was missing");
  assert(northampton.contactUrl?.includes("contractsfinder.service.gov.uk/Notice/"), "Northampton application route was missing");
  assert(northampton.qualificationSummary?.includes("Detailed selection criteria"), "Northampton eligibility limitation was missing");
  const northamptonCard = page.locator(".opportunity-card").filter({ hasText: "Northampton College" }).first();
  assert(await northamptonCard.count() === 1, "Northampton was not visible as a browser result card");
  const cardText = await northamptonCard.innerText();
  assert(cardText.includes("Active request") && cardText.includes("Confirmed external-service signal") && cardText.includes("Deadline:"), "browser card omitted buyer-intent or deadline evidence");
  assert(await northamptonCard.locator('a[aria-label="Open original source"]').getAttribute("href") === northampton.sourceUrl, "browser card source link did not match the official notice URL");
  serviceResultsMeasurements = await measureAtWidths("service-results");

  await page.getByRole("button", { name: "Adjust search", exact: true }).first().click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });
  await page.locator(".discovery-stage").getByRole("button", { name: "My profile", exact: true }).click();
  await page.getByRole("heading", { name: "Keep what the page can support." }).waitFor({ state: "visible", timeout: 30_000 });
  await page.getByRole("textbox", { name: "Services and products" }).fill("Brand identity design");
  await page.getByRole("textbox", { name: "Skills and technologies" }).fill("Visual identity");
  await page.getByRole("textbox", { name: "Search keywords" }).fill("brand identity, visual identity, logo design");
  await page.getByLabel("Offering type", { exact: true }).selectOption("service-provider");
  await page.getByLabel("Discovery objective", { exact: true }).selectOption("external-services");
  await page.getByRole("button", { name: /Confirm offering and choose an audience|Save profile and continue/ }).click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });
  const brandingSearch = await search("Active requests");
  assert(!(brandingSearch.opportunities || []).some((item) => /Northampton College|media planning.*buying/i.test(`${item.title} ${item.organization} ${item.description}`)), "general branding profile matched specialized media buying");

  const allMeasurements = [...profileMeasurements, ...productResultsMeasurements, ...serviceResultsMeasurements];
  for (const measurement of allMeasurements) {
    assert(measurement.documentWidth <= measurement.viewport && measurement.bodyWidth <= measurement.viewport, `${measurement.label} overflowed: ${JSON.stringify(measurement)}`);
    assert(!measurement.signOut || measurement.signOut.visible, `${measurement.label} sign-out control was outside the viewport: ${JSON.stringify(measurement)}`);
  }
  console.log(JSON.stringify({
    status: "pass",
    sourceEvidence: { reachUrl, mindshareUrl },
    reach: { effectiveMode: productSearch.policy.mode, contractsFinder: productProviders["Contracts Finder"], opportunityCount: productOpportunities.length, tierCounts: productSearch.tierCounts, noUnrelatedTender: true },
    serviceProvider: { northampton: { title: northampton.title, buyer: northampton.buyerName, status: northampton.noticeStatus, deadline: northampton.deadline, officialNoticeUrl: northampton.sourceUrl, applicationRoute: northampton.contactUrl, qualificationSummary: northampton.qualificationSummary }, tierCounts: serviceSearch.tierCounts },
    crossObjective: { specializedMediaBuyingRejectedForBranding: true },
    mobile: allMeasurements,
  }));
} catch (error) {
  console.log(JSON.stringify({ status: "fail", reason: error instanceof Error ? error.message : String(error), reach: productSearch?.tierCounts || null, serviceProvider: serviceSearch?.tierCounts || null }));
  process.exitCode = 1;
} finally {
  await browser.close();
  try { console.log(JSON.stringify({ cleanup: await cleanup() })); } catch (error) { console.log(JSON.stringify({ cleanup: { status: "fail", message: String(error?.message || error) } })); process.exitCode = 1; }
}
