"use client";

import { useEffect, useMemo, useState } from "react";
import type { CustomerType, DiscoveryMode, Opportunity, ProfileDraft, PublicUser, SavedOpportunity } from "@/lib/types";

type Stage = "url" | "review" | "discover" | "results";
type AuthMode = "login" | "register";

const categoryOptions: Array<{ value: CustomerType; label: string; note: string }> = [
  { value: "small-businesses", label: "Small businesses", note: "Owner-led teams and local operators" },
  { value: "startups", label: "Startups", note: "Founders, MVPs, and early-stage teams" },
  { value: "agencies", label: "Agencies", note: "Studios, consultancies, and partners" },
  { value: "individuals", label: "Individuals", note: "Creators, coaches, and personal projects" },
];

const initialProfile: ProfileDraft = {
  businessName: "",
  summary: "",
  productsAndServices: [],
  problemsSolved: [],
  skillsAndTechnologies: [],
  valueProposition: [],
  differentiators: [],
  portfolioEvidence: [],
  customerSegments: [],
  searchKeywords: [],
  buyerIntentSignals: [],
  inferenceNotes: [],
  sourceUrl: "",
  analyzedAt: "",
  model: "",
  grounding: { sourceTitle: "", sourceExcerptCount: 0, unsupportedFields: [] },
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { "content-type": "application/json", ...(init?.headers || {}) } });
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "The request failed.");
  return body;
}

function claimsToText(claims: ProfileDraft["productsAndServices"]) {
  return claims.map((claim) => claim.text).join("\n");
}

function textToClaims(value: string, previous: ProfileDraft["productsAndServices"]) {
  const previousByText = new Map(previous.map((claim) => [claim.text, claim]));
  return value.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 20).map((line) => previousByText.get(line) || ({ text: line, evidence: [], inference: true }));
}

function formatDate(value: string | null) {
  if (!value) return "Date not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date not provided" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function SourceMark() {
  return <span className="source-mark" aria-hidden="true"><span>↗</span></span>;
}

function AuthPanel({ mode, setMode, onComplete }: { mode: AuthMode; setMode: (mode: AuthMode) => void; onComplete: (user: PublicUser) => void }) {
  const [fields, setFields] = useState({ displayName: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api<{ user: PublicUser }>(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(fields) });
      onComplete(result.user);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-card">
    <div className="eyebrow">{isRegister ? "Start with your work" : "Welcome back"}</div>
    <h2>{isRegister ? "Make your work easier to find." : "Return to your source of work."}</h2>
    <p className="muted">Source reads what you have already made, then helps you investigate opportunities that fit.</p>
    <form onSubmit={submit} className="stack-form">
      {isRegister && <label>Display name<input autoComplete="name" value={fields.displayName} onChange={(event) => setFields({ ...fields, displayName: event.target.value })} placeholder="Your name or studio" required /></label>}
      <label>Email<input autoComplete="email" type="email" value={fields.email} onChange={(event) => setFields({ ...fields, email: event.target.value })} placeholder="you@example.com" required /></label>
      <label>Password<input autoComplete={isRegister ? "new-password" : "current-password"} type="password" value={fields.password} onChange={(event) => setFields({ ...fields, password: event.target.value })} placeholder={isRegister ? "At least 12 characters" : "Your password"} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" disabled={busy}>{busy ? "Working..." : isRegister ? "Create my account" : "Sign in"}</button>
    </form>
    <button className="text-button" onClick={() => { setMode(isRegister ? "login" : "register"); setError(""); }}>{isRegister ? "Already have an account? Sign in" : "New to Source? Create an account"}</button>
  </div>;
}

function ProfileReview({ profile, setProfile, onConfirm, busy, error }: { profile: ProfileDraft; setProfile: (profile: ProfileDraft) => void; onConfirm: () => void; busy: boolean; error: string }) {
  const update = (key: keyof ProfileDraft, value: string) => setProfile({ ...profile, [key]: value });
  return <section className="workspace-section profile-review" aria-labelledby="profile-title">
    <div className="section-heading"><div><div className="eyebrow">Step 2 of 3</div><h2 id="profile-title">Review the profile Source found</h2><p className="muted">Edit anything that is wrong. Evidence stays attached to claims that came from the public page. Anything you add is marked as your edit.</p></div><span className="status-chip success">Grounded draft</span></div>
    <div className="profile-grid">
      <label>Business or project name<input value={profile.businessName} onChange={(event) => update("businessName", event.target.value)} /></label>
      <label>Source URL<input value={profile.sourceUrl} readOnly /></label>
      <label className="wide">What it does<textarea value={profile.summary} onChange={(event) => update("summary", event.target.value)} rows={4} /></label>
      <label>Services and products<textarea value={claimsToText(profile.productsAndServices)} onChange={(event) => setProfile({ ...profile, productsAndServices: textToClaims(event.target.value, profile.productsAndServices) })} rows={6} placeholder="One item per line" /></label>
      <label>Skills and technologies<textarea value={claimsToText(profile.skillsAndTechnologies)} onChange={(event) => setProfile({ ...profile, skillsAndTechnologies: textToClaims(event.target.value, profile.skillsAndTechnologies) })} rows={6} placeholder="One item per line" /></label>
      <label className="wide">Search keywords<textarea value={profile.searchKeywords.join(", ")} onChange={(event) => setProfile({ ...profile, searchKeywords: event.target.value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 16) })} rows={2} /></label>
    </div>
    <div className="grounding-note"><span className="note-icon">i</span><span>{profile.grounding.sourceExcerptCount} page excerpts were available to the model. Source never treats pricing, ownership, past clients, or years of experience as verified from this page.</span></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="section-actions"><button className="button button-primary" onClick={onConfirm} disabled={busy}>{busy ? "Saving profile..." : "Confirm profile"}</button></div>
  </section>;
}

function OpportunityCard({ opportunity, onSave, onProposal, saved }: { opportunity: Opportunity; onSave: () => void; onProposal: () => void; saved: boolean }) {
  return <article className="opportunity-card">
    <div className="opportunity-topline"><span className={`classification ${opportunity.classification}`}>{opportunity.classification.replaceAll("-", " ")}</span><span className="match-score">{opportunity.score} fit</span></div>
    <h3>{opportunity.title}</h3>
    <div className="opportunity-meta"><span>{opportunity.source}</span><span>{formatDate(opportunity.publishedAt)}</span><span>{opportunity.clientType === "unknown" ? "Customer type unknown" : opportunity.clientType.replaceAll("-", " ")}</span></div>
    <p>{opportunity.description}</p>
    <div className="evidence-list"><strong>Why it surfaced</strong>{opportunity.evidence.map((line) => <span key={line}>• {line}</span>)}</div>
    {opportunity.budgetSignal && <div className="budget-line">Source signal: {opportunity.budgetSignal}</div>}
    <div className="card-actions"><button className="button button-secondary" onClick={onProposal}>{saved ? "Draft proposal" : "Save and draft"}</button><button className="button button-quiet" onClick={onSave} disabled={saved}>{saved ? "Saved" : "Save opportunity"}</button><a className="button button-quiet" href={opportunity.sourceUrl} target="_blank" rel="noreferrer">Open source ↗</a></div>
  </article>;
}

export default function SourceApp() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [stage, setStage] = useState<Stage>("url");
  const [url, setUrl] = useState("");
  const [profile, setProfile] = useState<ProfileDraft>(initialProfile);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>(["startups"]);
  const [mode, setMode] = useState<DiscoveryMode>("services");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [saved, setSaved] = useState<SavedOpportunity[]>([]);
  const [selectedSaved, setSelectedSaved] = useState<SavedOpportunity | null>(null);
  const [proposal, setProposal] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [providerText, setProviderText] = useState("");

  async function loadSaved() {
    try { const result = await api<{ opportunities: SavedOpportunity[] }>("/api/saved"); setSaved(result.opportunities); } catch { /* anonymous or not configured yet */ }
  }

  useEffect(() => {
    api<{ user: PublicUser | null }>("/api/auth/me").then((result) => { setUser(result.user); if (result.user) void loadSaved(); }).catch(() => undefined).finally(() => setAuthLoading(false));
  }, []);

  const savedUrls = useMemo(() => new Set(saved.map((item) => item.sourceUrl)), [saved]);

  async function analyze() {
    setBusy(true); setError(""); setNotice("");
    try { const result = await api<{ profile: ProfileDraft }>("/api/profile/analyze", { method: "POST", body: JSON.stringify({ url }) }); setProfile(result.profile); setStage("review"); setNotice("The profile is ready for your review."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Website analysis failed."); } finally { setBusy(false); }
  }

  async function confirmProfile() {
    setBusy(true); setError("");
    try { const result = await api<{ profile: ProfileDraft }>("/api/profile/confirm", { method: "POST", body: JSON.stringify({ profile }) }); setProfile(result.profile); setStage("discover"); setNotice("Profile confirmed. Choose who you want to work with."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Could not save the profile."); } finally { setBusy(false); }
  }

  async function findOpportunities() {
    setBusy(true); setError(""); setNotice("");
    try { const result = await api<{ opportunities: Opportunity[]; providers: Array<{ provider: string; status: string; detail: string }> }>("/api/opportunities/search", { method: "POST", body: JSON.stringify({ customerTypes, mode }) }); setOpportunities(result.opportunities); setProviderText(result.providers.map((provider) => `${provider.provider}: ${provider.status}`).join(" · ")); setStage("results"); setNotice(result.opportunities.length ? "Results are ranked from live source responses. Inspect the evidence before acting." : "No current match passed the freshness and classification rules."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Opportunity search failed."); } finally { setBusy(false); }
  }

  async function saveOpportunity(opportunity: Opportunity) {
    setError("");
    try { await api("/api/opportunities/save", { method: "POST", body: JSON.stringify({ opportunity }) }); await loadSaved(); setNotice("Saved to your account. It will still be here after you return."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Could not save this opportunity."); }
  }

  async function draftProposal(opportunity: Opportunity | SavedOpportunity) {
    setError("");
    try {
      let item = opportunity as SavedOpportunity;
      if (!item.id) { await saveOpportunity(opportunity); const refreshed = await api<{ opportunities: SavedOpportunity[] }>("/api/saved"); item = refreshed.opportunities.find((candidate) => candidate.sourceUrl === opportunity.sourceUrl) || item; }
      if (!item.id) throw new Error("Save the opportunity before drafting a proposal.");
      const result = await api<{ proposal: string }>(`/api/opportunities/${item.id}/proposal`, { method: "POST", body: JSON.stringify({}) }); setSelectedSaved(item); setProposal(result.proposal); await loadSaved();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Could not draft the proposal."); }
  }

  async function signOut() { await fetch("/api/auth/logout", { method: "POST" }); setUser(null); setStage("url"); setSaved([]); setProfile(initialProfile); }

  if (authLoading) return <main className="loading-screen"><div className="loader-orbit" /><p>Opening Source...</p></main>;
  if (!user) return <main className="public-shell"><header className="public-nav"><div className="brand"><span className="brand-dot" />Source</div><span className="nav-note">A clearer path from good work to good-fit conversations</span></header><section className="hero-grid"><div className="hero-copy"><div className="eyebrow">Opportunity discovery for independent work</div><h1>Let your actual work point to the next right conversation.</h1><p>Source reads your public project or portfolio, keeps the evidence visible, and searches public opportunity signals that match what you do.</p><div className="promise-line"><span>Public evidence first</span><span>Human review always</span><span>No outreach automation</span></div></div><AuthPanel mode={authMode} setMode={setAuthMode} onComplete={(nextUser) => { setUser(nextUser); void loadSaved(); }} /></section><footer className="public-footer"><span>Source does not guarantee clients or payments.</span><span>Investigate every source before you act.</span></footer></main>;

  return <main className="app-shell">
    <header className="app-nav"><div className="brand"><span className="brand-dot" />Source</div><div className="nav-center"><span className="nav-step active">01 Profile</span><span className={`nav-step ${stage === "discover" || stage === "results" ? "active" : ""}`}>02 Audience</span><span className={`nav-step ${stage === "results" ? "active" : ""}`}>03 Opportunities</span></div><div className="user-menu"><span>{user.displayName}</span><button className="text-button" onClick={signOut}>Sign out</button></div></header>
    <div className="app-layout"><aside className="context-rail"><div className="rail-kicker">Your source</div><h2>{profile.businessName || "Start with your public work"}</h2><p>{profile.summary || "A grounded profile gives every search something real to match against."}</p><div className="rail-divider" /><div className="rail-status"><span className={`status-dot ${profile.summary ? "ready" : ""}`} />{profile.summary ? "Profile ready to search" : "Profile not started"}</div><div className="saved-block"><div className="rail-kicker">Saved opportunities</div>{saved.length ? saved.slice(0, 5).map((item) => <button className="saved-link" key={item.id} onClick={() => { setSelectedSaved(item); setProposal(item.proposalDraft || ""); }}>{item.title}</button>) : <p className="rail-small">Saved work will appear here.</p>}</div></aside>
      <section className="main-workspace">
        {stage === "url" && <section className="workspace-section start-section"><div className="eyebrow">Step 1 of 3</div><h1>Start with a URL, not a blank form.</h1><p className="lead">Paste a live business, project, portfolio, agency, or product URL. Source will analyze its public content and show you exactly what became evidence.</p><form className="url-form" onSubmit={(event) => { event.preventDefault(); void analyze(); }}><label htmlFor="source-url">Public website URL</label><div className="url-input-row"><input id="source-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://your-work.example" required /><button className="button button-primary" disabled={busy}>{busy ? "Reading page..." : "Analyze website"}</button></div><p className="field-help">Only publicly accessible pages are fetched. No passwords or private dashboards.</p></form><div className="alternative-entry"><div><strong>No live website yet?</strong><span>Sign in first, then use the public profile fields as a manual starting point.</span></div><button className="button button-secondary" onClick={() => { setProfile({ ...initialProfile, businessName: user.displayName }); setStage("review"); }}>Enter manually</button></div></section>}
        {stage === "review" && <ProfileReview profile={profile} setProfile={setProfile} onConfirm={() => void confirmProfile()} busy={busy} error={error} />}
        {stage === "discover" && <section className="workspace-section discover-section"><div className="eyebrow">Step 3 of 3</div><h1>Who should Source look for?</h1><p className="lead">Your choices change the query vocabulary, category evidence, and ranking. Select one or more.</p><div className="category-grid">{categoryOptions.map((option) => <label key={option.value} className={`category-option ${customerTypes.includes(option.value) ? "selected" : ""}`}><input type="checkbox" checked={customerTypes.includes(option.value)} onChange={() => setCustomerTypes((current) => current.includes(option.value) ? current.filter((item) => item !== option.value) : [...current, option.value])} /><span className="category-check" /><span><strong>{option.label}</strong><small>{option.note}</small></span></label>)}</div><div className="mode-selector"><div><strong>What are you looking for?</strong><span>Source prioritizes service-provider discovery in this release.</span></div><div className="mode-options"><label className={mode === "services" ? "selected" : ""}><input type="radio" checked={mode === "services"} onChange={() => setMode("services")} />Projects and contracts</label><label className={mode === "product" ? "selected" : ""}><input type="radio" checked={mode === "product"} onChange={() => setMode("product")} />Potential buyers for my product</label></div></div><div className="search-boundary"><span className="note-icon">i</span><span>Potential buyer results are public signals only. Source will label uncertain intent instead of claiming a customer wants to pay.</span></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" onClick={() => void findOpportunities()} disabled={busy || !customerTypes.length}>{busy ? "Searching live sources..." : "Find opportunities"}</button></section>}
        {stage === "results" && <section className="workspace-section results-section"><div className="section-heading"><div><div className="eyebrow">Live source results</div><h1>Investigate the right next step.</h1><p className="muted">Matched to {profile.businessName}. Results are not promises. Open the original source before you decide.</p></div><button className="button button-secondary" onClick={() => setStage("discover")}>Change audience</button></div>{notice && <div className="notice success-notice">{notice}</div>}{providerText && <div className="provider-line">{providerText}</div>}{error && <p className="form-error" role="alert">{error}</p>}{opportunities.length ? <div className="opportunity-list">{opportunities.map((opportunity) => <OpportunityCard key={`${opportunity.source}-${opportunity.sourceUrl}`} opportunity={opportunity} onSave={() => void saveOpportunity(opportunity)} onProposal={() => void draftProposal(opportunity)} saved={savedUrls.has(opportunity.sourceUrl)} />)}</div> : <div className="empty-state"><div className="empty-mark">∅</div><h2>No current match passed the evidence rules.</h2><p>That is a useful result, not a failure. Try a different customer type or broaden the confirmed keywords. Source excluded stale and full-time records.</p><button className="button button-secondary" onClick={() => setStage("discover")}>Adjust search</button></div>}</section>}
        {notice && stage !== "results" && <div className="notice success-notice">{notice}</div>}
        {selectedSaved && <section className="proposal-panel" aria-labelledby="proposal-title"><div className="section-heading"><div><div className="eyebrow">Saved work</div><h2 id="proposal-title">Editable proposal draft</h2><p className="muted">Built from confirmed profile claims and the saved opportunity. Source never sends it for you.</p></div><button className="text-button" onClick={() => setSelectedSaved(null)}>Close</button></div><textarea value={proposal} onChange={(event) => setProposal(event.target.value)} rows={14} /><div className="card-actions"><button className="button button-secondary" onClick={() => navigator.clipboard?.writeText(proposal)}>Copy proposal</button><a className="button button-quiet" href={selectedSaved.sourceUrl} target="_blank" rel="noreferrer">Open original source ↗</a></div></section>}
      </section>
    </div>
  </main>;
}
