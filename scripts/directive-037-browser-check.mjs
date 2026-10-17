import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { MongoClient } from "mongodb";

const require = createRequire(import.meta.url);
const { chromium } = require("C:\\Users\\HomePC\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright");

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) process.loadEnvFile(".env.local");

const baseUrl = (process.env.SOURCE_LOCAL_URL || "http://127.0.0.1:3101").replace(/\/$/, "");
const runId = Date.now().toString(36);
const email = `source-directive-037-${runId}@example.test`;
const password = `Source-${runId}-BrowserCheck!`;
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

async function measure(label) {
  return { label, ...(await page.evaluate(() => {
    const signOut = [...document.querySelectorAll("button")].find((button) => button.textContent?.trim().toLowerCase() === "sign out");
    const rect = signOut?.getBoundingClientRect();
    return {
      viewport: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      signOut: rect ? { left: Number(rect.left.toFixed(3)), right: Number(rect.right.toFixed(3)), width: Number(rect.width.toFixed(3)), visible: rect.right <= window.innerWidth && rect.left >= 0 } : null,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth,
    };
  })) };
}

async function measureAtWidths(label) {
  const measurements = [];
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 });
    measurements.push(await measure(`${label}-${width}`));
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  return measurements;
}

async function chooseAllCustomerTypes() {
  const inputs = page.locator(".category-option input");
  for (let index = 0; index < await inputs.count(); index += 1) {
    if (!(await inputs.nth(index).isChecked())) await inputs.nth(index).check();
  }
}

async function searchActiveRequests() {
  await chooseAllCustomerTypes();
  const responsePromise = page.waitForResponse((response) => response.url().includes("/api/opportunities/search"), { timeout: 120_000 });
  await page.getByRole("button", { name: "Find customer signals", exact: true }).click();
  const data = await responseJson(responsePromise);
  await page.getByRole("heading", { name: "Inspect the evidence before you act." }).waitFor({ state: "visible", timeout: 120_000 });
  return data;
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

let manualSearch;
let websiteSearch;
const mobile = [];
try {
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "Display name" }).fill("Directive 037 Manual Freelancer");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Create my account", exact: true }).click();
  await page.getByRole("heading", { name: "Start with what you know." }).waitFor({ state: "visible", timeout: 30_000 });

  mobile.push(...await measureAtWidths("profile-paths"));
  await page.getByRole("button", { name: /Option A · Describe my services/ }).click();
  await page.getByRole("heading", { name: "Start without a website." }).waitFor({ state: "visible", timeout: 30_000 });
  await page.getByLabel("Services offered").fill("Media planning\nMedia buying");
  await page.getByLabel(/Skills and specialties/).fill("Audience strategy\nCampaign measurement");
  await page.getByLabel(/Short description/).fill("I help organizations plan and measure paid media campaigns.");
  await page.getByLabel(/Portfolio or example-work link/).fill("https://example.com/manual-reference");
  await page.locator(".manual-category-grid .category-option").nth(0).click();
  await page.locator(".manual-category-grid .category-option").nth(2).click();
  mobile.push(...await measureAtWidths("manual-profile-form"));
  await page.getByRole("button", { name: "Review my services", exact: true }).click();
  await page.getByRole("heading", { name: "Make the profile yours." }).waitFor({ state: "visible", timeout: 30_000 });
  assert((await page.getByText("User-provided details", { exact: true }).count()) > 0, "manual review did not identify user-provided details");
  assert((await page.getByText("Nothing in this profile has been independently verified by Source.", { exact: false }).count()) > 0, "manual review omitted verification boundary");
  assert(await page.getByRole("textbox", { name: /Portfolio or example-work link/ }).inputValue() === "https://example.com/manual-reference", "manual portfolio reference was not preserved in review");
  await page.getByLabel("Offering type", { exact: true }).selectOption("service-provider");
  await page.getByLabel("Discovery objective", { exact: true }).selectOption("external-services");
  mobile.push(...await measureAtWidths("manual-profile-confirmation"));
  await page.getByRole("button", { name: /Confirm services and choose an audience/ }).click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });
  manualSearch = await searchActiveRequests();
  const manualNorthampton = (manualSearch.opportunities || []).find((item) => /Northampton College/i.test(`${item.title} ${item.organization} ${item.description}`));
  assert(manualNorthampton?.source === "Contracts Finder", "manual profile did not surface the live Northampton procurement source");
  assert(manualNorthampton.prospectType === "active-request" && manualNorthampton.buyerIntent === "confirmed", "manual result was not classified as a confirmed active request");
  assert(manualNorthampton.profileMatches?.length > 0, "manual result had no service-fit explanation");
  const manualCard = page.locator(".opportunity-card").filter({ hasText: "Northampton College" }).first();
  assert(await manualCard.count() === 1, "manual Northampton result card was not visible");
  await manualCard.getByRole("button", { name: /Save and draft proposal/ }).click();
  await page.getByRole("heading", { name: /Editable application draft|Saved proposal draft/ }).waitFor({ state: "visible", timeout: 30_000 });
  const draft = page.getByRole("textbox", { name: "Proposal draft" });
  const editedProposal = `${await draft.inputValue()}\n\nManual profile acceptance edit.`;
  await draft.fill(editedProposal);
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await page.getByText("Proposal draft saved to your account.", { exact: true }).waitFor({ state: "visible", timeout: 30_000 });
  mobile.push(...await measureAtWidths("manual-results"));
  const registeredIdentity = await page.evaluate(async () => (await fetch("/api/auth/me", { cache: "no-store" })).json());
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByRole("textbox", { name: "Email" }).waitFor({ state: "visible", timeout: 30_000 });
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForFunction(() => document.querySelector(".saved-count")?.textContent?.trim() === "1", undefined, { timeout: 30_000 });
  const recoveredIdentity = await page.evaluate(async () => (await fetch("/api/auth/me", { cache: "no-store" })).json());
  const recoverySaved = await page.evaluate(async () => (await fetch("/api/saved", { cache: "no-store" })).json());
  await page.getByRole("button", { name: /My pipeline/ }).click();
  await page.getByRole("heading", { name: "Keep the next step visible." }).waitFor({ state: "visible", timeout: 30_000 });
  assert((await page.getByText("Northampton College", { exact: false }).count()) > 0, "saved manual opportunity was not recovered after login");
  await page.getByRole("button", { name: /Edit draft|Saved proposal draft/ }).click();
  assert((await page.getByRole("textbox", { name: "Proposal draft" }).inputValue()).includes("Manual profile acceptance edit."), "edited manual proposal was not recovered after login");
  mobile.push(...await measureAtWidths("manual-pipeline"));

  await page.getByRole("button", { name: "Close proposal", exact: true }).click();
  await page.getByRole("button", { name: "Discover customers", exact: true }).click();
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await page.getByRole("heading", { name: "Start with what you know." }).waitFor({ state: "visible", timeout: 30_000 });
  await page.locator("#source-url").fill(mindshareUrl);
  const analysisPromise = page.waitForResponse((response) => response.url().includes("/api/profile/analyze"), { timeout: 120_000 });
  await page.getByRole("button", { name: "Analyze website", exact: true }).click();
  const analysis = await responseJson(analysisPromise);
  assert(analysis.profile?.sourceUrl?.includes("mindshareworld.com"), "website import was not grounded in Mindshare");
  await page.getByRole("heading", { name: "Keep what the page can support." }).waitFor({ state: "visible", timeout: 120_000 });
  await page.getByRole("textbox", { name: "Services and products" }).fill("Media planning\nMedia buying\nMarketing communications");
  await page.getByRole("textbox", { name: "Skills and technologies" }).fill("Audience strategy\nCampaign measurement");
  await page.getByRole("textbox", { name: "Search keywords" }).fill("media planning, media buying, marketing communications, audience strategy");
  await page.getByLabel("Offering type", { exact: true }).selectOption("service-provider");
  await page.getByLabel("Discovery objective", { exact: true }).selectOption("external-services");
  await page.getByRole("button", { name: /Confirm offering and choose an audience/ }).click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });
  websiteSearch = await searchActiveRequests();
  const websiteNorthampton = (websiteSearch.opportunities || []).find((item) => /Northampton College/i.test(`${item.title} ${item.organization} ${item.description}`));
  assert(websiteNorthampton?.source === "Contracts Finder", "website-import path did not preserve live procurement discovery");
  mobile.push(...await measureAtWidths("website-discover"));
  for (const measurement of mobile) assert(!measurement.horizontalOverflow && (!measurement.signOut || measurement.signOut.visible), `${measurement.label} failed mobile geometry: ${JSON.stringify(measurement)}`);
  console.log(JSON.stringify({
    status: "pass",
    manual: { sourceUrl: "", profileOrigin: "manual", services: ["Media planning", "Media buying"], userProvidedBoundary: true, liveOpportunity: { title: manualNorthampton.title, buyer: manualNorthampton.buyerName, sourceUrl: manualNorthampton.sourceUrl, classification: manualNorthampton.classification, buyerIntent: manualNorthampton.buyerIntent, profileMatches: manualNorthampton.profileMatches }, savedProposalRecovered: true, sameUserAfterLogin: registeredIdentity.user?.id === recoveredIdentity.user?.id, savedCountAfterLogin: recoverySaved.opportunities?.length || 0 },
    websiteImport: { sourceUrl: analysis.profile.sourceUrl, liveOpportunity: { title: websiteNorthampton.title, source: websiteNorthampton.source, classification: websiteNorthampton.classification } },
    mobile,
  }));
} catch (error) {
  console.log(JSON.stringify({ status: "fail", reason: error instanceof Error ? error.message : String(error), manual: manualSearch?.tierCounts || null, websiteImport: websiteSearch?.tierCounts || null }));
  process.exitCode = 1;
} finally {
  await browser.close();
  try { console.log(JSON.stringify({ cleanup: await cleanup() })); } catch (error) { console.log(JSON.stringify({ cleanup: { status: "fail", message: String(error?.message || error) } })); process.exitCode = 1; }
}
