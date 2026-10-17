import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { MongoClient } from "mongodb";

const require = createRequire(import.meta.url);
const { chromium } = require("C:\\Users\\HomePC\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright");

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) process.loadEnvFile(".env.local");

const baseUrl = (process.env.SOURCE_LOCAL_URL || "http://127.0.0.1:3100").replace(/\/$/, "");
const runId = Date.now().toString(36);
const email = `source-directive-027-${runId}@example.test`;
const password = `Source-${runId}-BrowserCheck!`;
const sourceUrl = "https://www.mindshareworld.com/services";
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
  await page.getByRole("radio", { name: modeName, exact: true }).check();
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

let activeSearch;
let potentialSearch;
try {
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "Display name" }).fill("Directive 027 Media Buyer");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Create my account", exact: true }).click();
  await page.getByRole("heading", { name: "Let your existing work do the introducing." }).waitFor({ state: "visible", timeout: 30_000 });

  await page.getByRole("textbox", { name: "Public website URL" }).fill(sourceUrl);
  const analysisResponsePromise = page.waitForResponse((response) => response.url().includes("/api/profile/analyze"), { timeout: 120_000 });
  await page.getByRole("button", { name: "Analyze website", exact: true }).click();
  const analysisResponse = await responseJson(analysisResponsePromise);
  await page.getByRole("heading", { name: "Keep what the page can support." }).waitFor({ state: "visible", timeout: 120_000 });
  assert(analysisResponse.profile?.sourceUrl?.includes("mindshareworld.com"), "profile was not grounded in the selected public media-services page");

  const services = page.getByRole("textbox", { name: "Services and products" });
  const skills = page.getByRole("textbox", { name: "Skills and technologies" });
  const keywords = page.getByRole("textbox", { name: "Search keywords" });
  await services.fill("Media planning\nMedia buying\nMarketing communications");
  await skills.fill("Audience strategy\nCampaign measurement");
  await keywords.fill("media planning, media buying, marketing communications, audience strategy");
  await page.getByLabel("Offering type", { exact: true }).selectOption("service-provider");
  await page.getByLabel("Discovery objective", { exact: true }).selectOption("external-services");
  await page.getByRole("button", { name: /Confirm offering and choose an audience|Save profile and continue/ }).click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });

  activeSearch = await search("Active requests");
  const activeOpportunities = activeSearch.opportunities || [];
  const northampton = activeOpportunities.find((item) => /Northampton College/i.test(`${item.title} ${item.organization} ${item.description}`));
  assert(northampton, `Northampton College procurement notice was not surfaced; Contracts Finder results: ${activeOpportunities.filter((item) => item.source === "Contracts Finder").map((item) => item.title).join(" | ") || "none"}`);
  assert(northampton.source === "Contracts Finder", "Northampton candidate did not come from Contracts Finder");
  assert(northampton.prospectType === "active-request" && northampton.buyerIntent === "confirmed", "Northampton candidate was not classified as an active request with confirmed intent");
  assert(northampton.buyerName && northampton.organization, "Northampton buyer identity was missing");
  assert(northampton.noticeStatus === "active", `Northampton notice status was ${northampton.noticeStatus || "missing"}`);
  assert(northampton.deadline && new Date(northampton.deadline).getTime() > Date.now(), "Northampton deadline was missing or not in the future");
  assert(northampton.contactUrl?.includes("contractsfinder.service.gov.uk/Notice/"), "Northampton official notice/application route was missing");
  assert(northampton.qualificationSummary?.includes("Detailed selection criteria"), "Northampton eligibility limitation was missing");

  const activeCard = page.locator(".opportunity-card").filter({ hasText: "Northampton College" }).first();
  assert(await activeCard.count() === 1, "Northampton active-request card was not visible in the browser");
  const activeCardText = await activeCard.innerText();
  assert(activeCardText.includes("Active request"), "browser card did not show Active request");
  assert(activeCardText.includes("Confirmed external-service signal"), "browser card did not show confirmed buying intent");
  assert(activeCardText.includes("Deadline:"), "browser card did not show tender deadline");
  assert(activeCardText.includes("Detailed selection criteria"), "browser card did not show unknown eligibility/selection limitation");
  const activeSourceHref = await activeCard.locator('a[aria-label="Open original source"]').getAttribute("href");
  assert(activeSourceHref === northampton.sourceUrl, "browser card did not link to the original official notice URL");
  const activeDraftButton = activeCard.getByRole("button", { name: /Save and draft proposal|Draft proposal/ });
  assert(await activeDraftButton.count() === 1, "active request did not expose the permitted proposal route");

  await page.getByRole("button", { name: "Adjust search", exact: true }).click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });
  potentialSearch = await search("Potential customers + research");
  const potentialOpportunities = potentialSearch.opportunities || [];
  const githubSignals = potentialOpportunities.filter((item) => item.source === "GitHub");
  assert(githubSignals.some((item) => item.prospectType === "potential-customer" && item.buyerIntent === "possible"), "potential-customer GitHub signal was not displayed with possible intent");
  assert(githubSignals.some((item) => item.prospectType === "research-signal" && item.buyerIntent === "unsupported"), "research-only GitHub signal was not displayed with unsupported intent");
  const researchCard = page.locator(".research-card").first();
  assert(await researchCard.count() === 1, "research-signal card was not visible in the browser");
  const researchCardText = await researchCard.innerText();
  assert(researchCardText.includes("Research signal"), "research card label was missing");
  assert(researchCardText.includes("Research guidance only"), "research card offered more than research guidance");
  assert(await researchCard.getByRole("button", { name: /Draft/ }).count() === 0, "research signal exposed an unsupported draft action");

  await page.getByRole("button", { name: "Adjust search", exact: true }).click();
  await page.locator(".discovery-stage").getByRole("button", { name: "My profile", exact: true }).click();
  await page.getByRole("heading", { name: "Keep what the page can support." }).waitFor({ state: "visible", timeout: 30_000 });
  await services.fill("Brand identity design");
  await skills.fill("Visual identity");
  await keywords.fill("brand identity, visual identity, logo design");
  await page.getByRole("button", { name: "Save profile and continue", exact: true }).click();
  await page.getByRole("heading", { name: "Find customers who need what you do." }).waitFor({ state: "visible", timeout: 30_000 });
  const brandingActive = await search("Active requests");
  const brandingNorthampton = (brandingActive.opportunities || []).find((item) => /Northampton College|Media planning.*Buying/i.test(`${item.title} ${item.organization}`));
  assert(!brandingNorthampton, "general branding profile was incorrectly matched to the specialized Northampton media-buying notice");

  console.log(JSON.stringify({
    status: "pass",
    sourceUrl,
    activeRequest: { title: northampton.title, buyer: northampton.buyerName, noticeStatus: northampton.noticeStatus, deadline: northampton.deadline, officialNoticeUrl: northampton.sourceUrl, applicationRoute: northampton.contactUrl, qualificationSummary: northampton.qualificationSummary },
    activeTierCounts: activeSearch.tierCounts,
    potentialTierCounts: potentialSearch.tierCounts,
    githubSignals: githubSignals.map((item) => ({ title: item.title, organization: item.organization, prospectType: item.prospectType, buyerIntent: item.buyerIntent, sourceUrl: item.sourceUrl })),
    browser: { activeCardVisible: true, originalNoticeLinkVerified: true, researchCardVisible: true, researchDraftBlocked: true, brandingSpecializedMatchRejected: true },
  }));
} catch (error) {
  console.log(JSON.stringify({ status: "fail", reason: error instanceof Error ? error.message : String(error), activeTierCounts: activeSearch?.tierCounts || null, potentialTierCounts: potentialSearch?.tierCounts || null }));
  process.exitCode = 1;
} finally {
  await browser.close();
  try { console.log(JSON.stringify({ cleanup: await cleanup() })); } catch (error) { console.log(JSON.stringify({ cleanup: { status: "fail", message: String(error?.message || error) } })); process.exitCode = 1; }
}
