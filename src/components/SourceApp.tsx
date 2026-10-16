"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { CustomerType, DiscoveryMode, Opportunity, OpportunityClassification, ProfileDraft, PublicUser, SavedOpportunity } from "@/lib/types";

type Stage = "url" | "review" | "discover" | "results";
type AuthMode = "login" | "register";
type IconName = "arrow" | "briefcase" | "check" | "chevron" | "clock" | "edit" | "external" | "file" | "globe" | "lock" | "menu" | "search" | "shield" | "spark" | "target" | "users" | "x";

const categoryOptions: Array<{ value: CustomerType; label: string; note: string; icon: IconName }> = [
  { value: "small-businesses", label: "Small businesses", note: "Owner-led teams and local operators", icon: "briefcase" },
  { value: "startups", label: "Startups", note: "Founders, MVPs, and early-stage teams", icon: "spark" },
  { value: "agencies", label: "Agencies", note: "Studios, consultancies, and partners", icon: "users" },
  { value: "individuals", label: "Individuals", note: "Creators, coaches, and personal projects", icon: "target" },
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

function classificationLabel(value: OpportunityClassification) {
  const labels: Record<OpportunityClassification, string> = {
    "explicit-project-request": "Explicit project request",
    "freelance-or-contract": "Freelance or contract",
    "potential-buyer-signal-unconfirmed": "Unconfirmed buyer signal",
    "full-time-employment": "Full-time employment",
    "unknown-employment-type": "Employment type unknown",
    irrelevant: "Not relevant",
    "expired-or-stale": "Expired or stale",
  };
  return labels[value];
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path {...common} d="M4 12h15" /><path {...common} d="m13 6 6 6-6 6" /></>,
    briefcase: <><rect {...common} x="3" y="6" width="18" height="13" rx="2" /><path {...common} d="M8 6V4h8v2M3 11h18M10 11v2h4v-2" /></>,
    check: <path {...common} d="m5 12 4 4L19 6" />,
    chevron: <path {...common} d="m7 10 5 5 5-5" />,
    clock: <><circle {...common} cx="12" cy="12" r="8.5" /><path {...common} d="M12 7v5l3 2" /></>,
    edit: <><path {...common} d="m4 16.5-.8 3.3 3.3-.8L17.8 7.7a2.1 2.1 0 0 0-3-3L4 16.5Z" /><path {...common} d="m13.5 6.5 3 3" /></>,
    external: <><path {...common} d="M14 4h6v6M20 4l-9 9" /><path {...common} d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
    file: <><path {...common} d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path {...common} d="M14 3v5h5M9 13h6M9 17h4" /></>,
    globe: <><circle {...common} cx="12" cy="12" r="8.5" /><path {...common} d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.1 2.2 3.2 5.1 3.2 8.5s-1.1 6.3-3.2 8.5c-2.1-2.2-3.2-5.1-3.2-8.5S9.9 5.7 12 3.5Z" /></>,
    lock: <><rect {...common} x="5" y="10" width="14" height="10" rx="2" /><path {...common} d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" /></>,
    menu: <><path {...common} d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle {...common} cx="10.5" cy="10.5" r="6.5" /><path {...common} d="m16 16 4 4" /></>,
    shield: <><path {...common} d="M12 3 19 6v5c0 4.7-3 8-7 10-4-2-7-5.3-7-10V6l7-3Z" /><path {...common} d="m9 12 2 2 4-4" /></>,
    spark: <><path {...common} d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path {...common} d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    target: <><circle {...common} cx="12" cy="12" r="8.5" /><circle {...common} cx="12" cy="12" r="4" /><path {...common} d="M12 3.5V6M20.5 12H18M12 20.5V18M3.5 12H6" /></>,
    users: <><circle {...common} cx="9" cy="9" r="3" /><path {...common} d="M3.8 19a5.2 5.2 0 0 1 10.4 0M16 7a3 3 0 0 1 0 5.8M17 14.5a4.5 4.5 0 0 1 3.2 4" /></>,
    x: <><path {...common} d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function SourceLogo({ compact = false }: { compact?: boolean }) {
  return <span className={`source-logo ${compact ? "compact" : ""}`} aria-hidden="true"><svg viewBox="0 0 32 32" role="presentation"><path d="M16 2.5C9.3 2.5 4 7.8 4 14.3c0 7.5 7.2 11.4 12 15.2 4.8-3.8 12-7.7 12-15.2C28 7.8 22.7 2.5 16 2.5Z" /><path d="M11 10.5h10a3 3 0 0 1 0 6h-6v4h-4v-10Zm4 3v0h5a1 1 0 0 0 0-2h-5v2Zm0 3h3.5l3 4H17l-2-4Z" /></svg></span>;
}

function HeroArtwork() {
  return <div className="hero-art" aria-label="Original illustration showing public work becoming evidence and opportunity signals" role="img">
    <svg viewBox="0 0 620 500" className="hero-art-svg" aria-hidden="true">
      <defs>
        <linearGradient id="source-paper" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#f1f4ef" /></linearGradient>
        <linearGradient id="source-mint" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#d5f2e6" /><stop offset="1" stopColor="#b6e4d5" /></linearGradient>
        <filter id="source-shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="18" stdDeviation="17" floodColor="#143f32" floodOpacity=".14" /></filter>
      </defs>
      <path className="art-grid" d="M38 122h544M38 222h544M38 322h544M38 422h544M98 42v416M218 42v416M338 42v416M458 42v416" />
      <path className="art-connector" d="M184 238c73-78 117-82 178-24s92 71 177-3" />
      <path className="art-connector secondary" d="M188 267c67 48 121 54 169 5s111-59 171-6" />
      <g className="art-card art-page" filter="url(#source-shadow)">
        <rect x="45" y="72" width="190" height="235" rx="18" fill="url(#source-paper)" />
        <rect x="45" y="72" width="190" height="38" rx="18" fill="#ecf1ed" />
        <circle cx="67" cy="91" r="4" fill="#9db2a8" /><circle cx="82" cy="91" r="4" fill="#c3d3cb" /><circle cx="97" cy="91" r="4" fill="#d3ded8" />
        <rect x="69" y="136" width="106" height="9" rx="4.5" fill="#173d31" opacity=".9" /><rect x="69" y="154" width="136" height="6" rx="3" fill="#9aaba3" />
        <rect x="69" y="187" width="139" height="64" rx="12" fill="#d8eee6" /><path d="M83 228c19-28 30-12 45-27 18-18 32 19 62-10" fill="none" stroke="#087e63" strokeWidth="4" strokeLinecap="round" /><circle cx="83" cy="228" r="4" fill="#087e63" /><circle cx="190" cy="191" r="4" fill="#087e63" />
        <rect x="69" y="271" width="72" height="8" rx="4" fill="#c2d1c9" /><rect x="148" y="271" width="53" height="8" rx="4" fill="#d5dfda" />
      </g>
      <g className="art-card art-evidence" filter="url(#source-shadow)">
        <rect x="215" y="151" width="198" height="183" rx="18" fill="url(#source-paper)" />
        <rect x="239" y="177" width="70" height="8" rx="4" fill="#087e63" /><rect x="239" y="197" width="142" height="6" rx="3" fill="#9aaba3" />
        <circle cx="250" cy="234" r="12" fill="url(#source-mint)" /><path d="m244 234 4 4 8-9" fill="none" stroke="#087e63" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><rect x="273" y="229" width="106" height="7" rx="3.5" fill="#173d31" opacity=".8" />
        <circle cx="250" cy="274" r="12" fill="#e9e3f8" /><path d="m250 267 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="none" stroke="#6958a6" strokeWidth="1.8" /><rect x="273" y="269" width="84" height="7" rx="3.5" fill="#173d31" opacity=".8" />
        <rect x="239" y="304" width="130" height="6" rx="3" fill="#c2d1c9" />
      </g>
      <g className="art-card art-opportunity" filter="url(#source-shadow)">
        <rect x="401" y="226" width="175" height="178" rx="18" fill="#173d31" />
        <rect x="426" y="252" width="60" height="8" rx="4" fill="#9ce5ca" /><rect x="426" y="273" width="119" height="6" rx="3" fill="#a7bcb1" />
        <rect x="426" y="304" width="120" height="31" rx="9" fill="#2e5d4e" /><rect x="426" y="349" width="87" height="7" rx="3.5" fill="#73998a" /><rect x="426" y="370" width="109" height="7" rx="3.5" fill="#557e6e" />
        <circle cx="535" cy="319" r="13" fill="#9ce5ca" /><path d="m529 319 4 4 8-9" fill="none" stroke="#173d31" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="art-label art-label-page"><rect x="61" y="337" width="112" height="30" rx="15" fill="#ffffff" /><text x="78" y="357">PUBLIC WORK</text></g>
      <g className="art-label art-label-evidence"><rect x="250" y="350" width="101" height="30" rx="15" fill="#d5f2e6" /><text x="268" y="370">EVIDENCE</text></g>
      <g className="art-label art-label-fit"><rect x="457" y="419" width="81" height="30" rx="15" fill="#ffffff" /><text x="475" y="439">FIT</text></g>
    </svg>
    <div className="hero-art-note"><span className="art-note-dot" /><span>Original Source artwork · public work to useful signals</span></div>
  </div>;
}

function AuthPanel({ mode, setMode, onComplete }: { mode: AuthMode; setMode: (mode: AuthMode) => void; onComplete: (user: PublicUser) => void }) {
  const [fields, setFields] = useState({ displayName: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  async function submit(event: FormEvent) {
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

  return <div className="auth-card" id="start">
    <div className="auth-card-top"><SourceLogo compact /><span className="auth-index">{isRegister ? "01 / START" : "RETURNING USER"}</span></div>
    <div className="eyebrow">{isRegister ? "Start with what you have made" : "Welcome back to Source"}</div>
    <h2>{isRegister ? "Make your work easier to find." : "Pick up where your work left off."}</h2>
    <p className="auth-copy">{isRegister ? "Create your private Source workspace. Your public page stays the starting point." : "Sign in to review your saved opportunities and continue investigating."}</p>
    <form onSubmit={submit} className="stack-form">
      {isRegister && <label><span>Display name</span><input autoComplete="name" value={fields.displayName} onChange={(event) => setFields({ ...fields, displayName: event.target.value })} placeholder="Your name or studio" required /></label>}
      <label><span>Email</span><input autoComplete="email" type="email" value={fields.email} onChange={(event) => setFields({ ...fields, email: event.target.value })} placeholder="you@example.com" required /></label>
      <label><span>Password</span><input autoComplete={isRegister ? "new-password" : "current-password"} type="password" value={fields.password} onChange={(event) => setFields({ ...fields, password: event.target.value })} placeholder={isRegister ? "At least 12 characters" : "Your password"} required /></label>
      {error && <p className="form-error" role="alert"><Icon name="x" size={16} />{error}</p>}
      <button className="button button-primary button-wide" disabled={busy}>{busy ? "Working..." : isRegister ? <>Create my account <Icon name="arrow" size={17} /></> : <>Sign in <Icon name="arrow" size={17} /></>}</button>
    </form>
    <div className="auth-switch"><span>{isRegister ? "Already have an account?" : "New to Source?"}</span><button className="text-button" onClick={() => { setMode(isRegister ? "login" : "register"); setError(""); }}>{isRegister ? "Sign in" : "Create an account"}</button></div>
    <p className="auth-boundary"><Icon name="lock" size={15} />No private credentials are requested. Source reads only public pages you provide.</p>
  </div>;
}

function PublicLanding({ authMode, setAuthMode, onComplete }: { authMode: AuthMode; setAuthMode: (mode: AuthMode) => void; onComplete: (user: PublicUser) => void }) {
  return <main className="public-shell">
    <header className="public-nav">
      <a className="brand" href="#top"><SourceLogo /><span>Source</span></a>
      <nav className="public-nav-links" aria-label="Public navigation"><a href="#how-it-works">How it works</a><a href="#boundaries">What Source checks</a><a href="#start">Sign in</a></nav>
      <a className="button button-primary nav-cta" href="#start">Start with your work <Icon name="arrow" size={16} /></a>
    </header>
    <section className="public-hero" id="top">
      <div className="hero-copy"><div className="eyebrow">Opportunity intelligence for independent work</div><h1>Find client opportunities that fit your work.</h1><p>Paste your portfolio or project website. Source builds an editable profile from your public work and helps you investigate relevant client opportunities.</p><div className="hero-actions"><a className="button button-primary button-large" href="#start">Start with your work <Icon name="arrow" size={18} /></a><span className="hero-action-note">Public page first · Your review stays in control</span></div><div className="signal-strip" aria-label="Source workflow signals"><span><Icon name="globe" size={16} />Public page</span><span><Icon name="check" size={16} />Grounded claims</span><span><Icon name="target" size={16} />Relevant signals</span></div></div>
      <HeroArtwork />
    </section>
    <section className="activation-section"><div className="activation-copy"><div className="eyebrow">A focused beginning</div><h2>Bring the work you already have.</h2><p>Source starts from evidence you can inspect. Create an account, add a public URL, and decide what belongs in the profile before any search begins.</p><div className="activation-notes"><span><Icon name="lock" size={16} />Public pages only</span><span><Icon name="edit" size={16} />You edit before confirming</span><span><Icon name="shield" size={16} />No client guarantee</span></div></div><AuthPanel mode={authMode} setMode={setAuthMode} onComplete={onComplete} /></section>
    <section className="story-section" id="how-it-works"><div className="section-intro centered"><div className="eyebrow">The Source path</div><h2>From public work to a useful next step.</h2><p>Each stage keeps the original source close, so the result stays understandable and yours.</p></div><div className="story-grid"><article className="story-card"><span className="story-number">01</span><div className="story-icon"><Icon name="globe" size={22} /></div><h3>Bring a public page</h3><p>Start with a portfolio, project, agency, or business URL. No passwords or private dashboards.</p></article><article className="story-card"><span className="story-number">02</span><div className="story-icon"><Icon name="file" size={22} /></div><h3>Review the evidence</h3><p>Source drafts a profile and shows which claims came from the page before you confirm anything.</p></article><article className="story-card"><span className="story-number">03</span><div className="story-icon"><Icon name="target" size={22} /></div><h3>Investigate fit</h3><p>Choose who you want to work with, then inspect source-linked opportunities and why they surfaced.</p></article></div></section>
    <section className="boundary-section" id="boundaries"><div className="boundary-inner"><div><div className="eyebrow">Good signals need clear limits</div><h2>Useful does not mean certain.</h2></div><div className="boundary-list"><div><Icon name="check" size={17} /><span>Source keeps page evidence attached to profile claims.</span></div><div><Icon name="check" size={17} /><span>Unconfirmed buyer intent remains labeled as unconfirmed.</span></div><div><Icon name="check" size={17} /><span>Source never promises clients, payments, or outreach results.</span></div></div></div></section>
    <footer className="public-footer"><span className="brand footer-brand"><SourceLogo compact />Source</span><span>Investigate every source before you act.</span><a href="#top">Back to top <Icon name="arrow" size={14} /></a></footer>
  </main>;
}

function ContextRail({ profile, saved, stage, onSavedSelect }: { profile: ProfileDraft; saved: SavedOpportunity[]; stage: Stage; onSavedSelect: (item: SavedOpportunity) => void }) {
  return <aside className="context-rail"><div className="rail-identity"><div className="rail-kicker">Current source</div><h2>{profile.businessName || "Your public work"}</h2><p>{profile.summary || "A grounded profile gives every investigation something real to match against."}</p><div className="rail-status"><span className={`status-dot ${profile.summary ? "ready" : ""}`} />{profile.summary ? "Profile ready to search" : "Profile not started"}</div></div><div className="rail-progress"><span className={stage === "url" ? "active" : "complete"}><b>01</b> Public page</span><span className={stage === "review" ? "active" : stage === "url" ? "" : "complete"}><b>02</b> Review evidence</span><span className={stage === "discover" || stage === "results" ? "active" : ""}><b>03</b> Investigate fit</span></div><div className="saved-block"><div className="rail-heading"><span className="rail-kicker">Saved work</span><span className="saved-count">{saved.length ? saved.length : "—"}</span></div>{saved.length ? saved.slice(0, 5).map((item) => <button className="saved-link" key={item.id} onClick={() => onSavedSelect(item)}><Icon name="file" size={15} /><span>{item.title}</span><Icon name="chevron" size={15} /></button>) : <p className="rail-small">Saved opportunities will appear here after your first investigation.</p>}</div><div className="rail-boundary"><Icon name="shield" size={16} /><span>Source keeps your account data separate.</span></div></aside>;
}

function AppHeader({ stage, user, onSignOut }: { stage: Stage; user: PublicUser; onSignOut: () => void }) {
  return <header className="app-nav"><a className="brand" href="#main-workspace"><SourceLogo /><span>Source</span><em>Workspace</em></a><nav className="app-steps" aria-label="Source workflow"><span className={stage === "url" || stage === "review" ? "active" : "complete"}><b>01</b> Profile</span><span className={stage === "discover" ? "active" : stage === "results" ? "complete" : ""}><b>02</b> Audience</span><span className={stage === "results" ? "active" : ""}><b>03</b> Opportunities</span></nav><div className="user-menu"><span className="user-name">{user.displayName}</span><button className="text-button" onClick={onSignOut}>Sign out</button></div></header>;
}

function UrlOnboarding({ url, setUrl, busy, error, onAnalyze, onManual }: { url: string; setUrl: (value: string) => void; busy: boolean; error: string; onAnalyze: () => void; onManual: () => void }) {
  return <section className="workspace-section onboarding-stage" aria-labelledby="onboarding-title"><div className="stage-header"><div><div className="eyebrow">Step 1 · Start with public work</div><h1 id="onboarding-title">Let your existing work do the introducing.</h1><p className="lead">Paste a live project, portfolio, agency, or business URL. Source will read its public content and show you what became evidence.</p></div><span className="stage-pill"><Icon name="globe" size={14} /> Public page first</span></div><div className="onboarding-layout"><form className="url-card" onSubmit={(event) => { event.preventDefault(); onAnalyze(); }}><div className="card-topline"><label className="card-label url-label" htmlFor="source-url">Public website URL</label><span className="card-step">Required to analyze</span></div><div className="url-input-row"><div className="input-with-icon"><Icon name="globe" size={19} /><input id="source-url" aria-describedby="source-url-help" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://your-work.example" required /></div><button className="button button-primary" disabled={busy}>{busy ? <><span className="button-spinner" />Reading page...</> : <>Analyze website <Icon name="arrow" size={16} /></>}</button></div><p id="source-url-help" className="field-help">Only publicly accessible pages are fetched. No passwords or private dashboards.</p>{error && <div className="notice error-notice" role="alert"><Icon name="x" size={17} /><div><strong>We couldn&apos;t analyze that page.</strong><span>{error}</span><small>Check the URL, try again, or use the manual profile option below. Your input is still here.</small></div></div>}</form><div className="onboarding-side"><div className="process-card"><div className="card-label">What Source does next</div><div className="process-row"><span className="process-dot"><Icon name="file" size={16} /></span><div><strong>Read the public page</strong><small>Content is bounded and isolated from instructions.</small></div></div><div className="process-row"><span className="process-dot"><Icon name="check" size={16} /></span><div><strong>Draft grounded claims</strong><small>Evidence stays available for your review.</small></div></div><div className="process-row"><span className="process-dot"><Icon name="target" size={16} /></span><div><strong>Prepare the search</strong><small>Your confirmed choices shape discovery.</small></div></div></div><button className="manual-card" onClick={onManual}><span><Icon name="edit" size={18} /><strong>No live website yet?</strong><small>Start a manual draft and add a supporting URL when you have one.</small></span><Icon name="arrow" size={17} /></button></div></div></section>;
}

function ProfileReview({ profile, setProfile, onConfirm, busy, error, isSaved }: { profile: ProfileDraft; setProfile: (profile: ProfileDraft) => void; onConfirm: () => void; busy: boolean; error: string; isSaved: boolean }) {
  const update = (key: keyof ProfileDraft, value: string) => setProfile({ ...profile, [key]: value });
  const evidenceClaims = [...profile.productsAndServices, ...profile.skillsAndTechnologies].slice(0, 8);
  const groundedClaims = evidenceClaims.filter((claim) => claim.evidence.length > 0 && !claim.inference);
  const suggestedClaims = evidenceClaims.filter((claim) => claim.evidence.length === 0 || claim.inference);
  return <section className="workspace-section review-stage" aria-labelledby="profile-title"><div className="stage-header"><div><div className="eyebrow">Step 2 · Review before search</div><h1 id="profile-title">Keep what the page can support.</h1><p className="lead">Source drafted this profile from public content. Review the evidence first, then edit anything that needs your voice.</p></div><span className="stage-pill verified-pill"><Icon name="check" size={14} /> {isSaved ? "Confirmed profile" : "Grounded draft"}</span></div><div className="profile-layout"><div className="profile-main-card"><div className="card-label">Profile identity</div><label><span>Business or project name</span><input value={profile.businessName} onChange={(event) => update("businessName", event.target.value)} /></label><label><span>What it does</span><textarea value={profile.summary} onChange={(event) => update("summary", event.target.value)} rows={4} /></label><label><span>Source URL</span><input value={profile.sourceUrl} readOnly={Boolean(profile.sourceUrl)} onChange={(event) => update("sourceUrl", event.target.value)} placeholder="Add a supporting public URL before confirming" /></label><div className="identity-note"><Icon name="globe" size={16} /><span>{profile.sourceUrl ? "Read from the public page you submitted." : "Manual draft — add a supporting public URL before confirmation."}</span></div></div><aside className="evidence-tray" aria-label="Website evidence summary"><div className="evidence-header"><div><div className="card-label">Page evidence</div><h2>What the page supports</h2></div><span className="evidence-count">{groundedClaims.length} grounded</span></div><p className="evidence-intro">Every verified signal below can point back to a public excerpt. Suggestions stay visibly separate.</p>{groundedClaims.length > 0 && <div className="evidence-group"><span className="evidence-group-label"><Icon name="check" size={14} /> Supported by the page</span>{groundedClaims.map((claim) => <div className="evidence-claim" key={`grounded-${claim.text}`}><strong>{claim.text}</strong>{claim.evidence[0] && <em>“{claim.evidence[0]}”</em>}</div>)}</div>}{suggestedClaims.length > 0 && <div className="evidence-group suggested-group"><span className="evidence-group-label"><Icon name="edit" size={14} /> Review before confirming</span>{suggestedClaims.map((claim) => <div className="evidence-claim suggested-claim" key={`suggested-${claim.text}`}><strong>{claim.text}</strong><small>This is a suggestion or user edit, not external verification.</small></div>)}</div>}{!evidenceClaims.length && <div className="empty-evidence"><Icon name="file" size={20} /><span>No service or skill claims were supported on this page yet.</span></div>}<p className="evidence-boundary"><Icon name="shield" size={14} />Pricing, ownership, past clients, and years of experience are never treated as verified from this page.</p></aside></div><div className="editor-card"><div className="editor-header"><div><div className="card-label">Editable profile</div><h2>Shape the search around your work.</h2><p>These fields influence discovery. Your edits are not external verification.</p></div><span className="editor-badge"><Icon name="edit" size={14} /> Your control</span></div><div className="editor-grid"><label><span>Services and products</span><textarea value={claimsToText(profile.productsAndServices)} onChange={(event) => setProfile({ ...profile, productsAndServices: textToClaims(event.target.value, profile.productsAndServices) })} rows={5} placeholder="One item per line" /><small>Keep only services you want matched to opportunities.</small></label><label><span>Skills and technologies</span><textarea value={claimsToText(profile.skillsAndTechnologies)} onChange={(event) => setProfile({ ...profile, skillsAndTechnologies: textToClaims(event.target.value, profile.skillsAndTechnologies) })} rows={5} placeholder="Not found on this page — add your own only if accurate" /><small>Source distinguishes your edit from page evidence.</small></label><label className="wide"><span>Search keywords</span><textarea value={profile.searchKeywords.join(", ")} onChange={(event) => setProfile({ ...profile, searchKeywords: event.target.value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 16) })} rows={2} /><small>These words influence live opportunity queries and ranking.</small></label></div>{error && <p className="form-error" role="alert"><Icon name="x" size={16} />{error}</p>}<div className="section-actions"><button className="button button-primary" onClick={onConfirm} disabled={busy}>{busy ? "Saving profile..." : isSaved ? <>Save profile and continue <Icon name="arrow" size={16} /></> : <>Confirm and choose an audience <Icon name="arrow" size={16} /></>}</button></div></div></section>;
}

function OpportunityCard({ opportunity, onSave, onProposal, saved }: { opportunity: Opportunity; onSave: () => void; onProposal: () => void; saved: boolean }) {
  const className = opportunity.classification;
  return <article className={`opportunity-card ${className}`}><div className="opportunity-topline"><span className={`classification ${className}`}><Icon name={className === "explicit-project-request" ? "target" : className === "freelance-or-contract" ? "briefcase" : "clock"} size={14} />{classificationLabel(className)}</span><span className="match-score">{opportunity.score} fit</span></div><div className="opportunity-title-row"><div><h2>{opportunity.title}</h2><div className="opportunity-meta"><span>{opportunity.source}</span><span>{formatDate(opportunity.publishedAt)}</span><span>{opportunity.clientType === "unknown" ? "Customer type unknown" : opportunity.clientType.replaceAll("-", " ")}</span></div></div><a className="icon-button" href={opportunity.sourceUrl} target="_blank" rel="noreferrer" aria-label="Open original source"><Icon name="external" size={18} /></a></div><p className="opportunity-description">{opportunity.description}</p><div className="evidence-list"><strong><Icon name="check" size={14} /> Why it surfaced</strong>{opportunity.evidence.map((line) => <span key={line}>{line}</span>)}</div><div className="eligibility-note" role="note"><Icon name="shield" size={15} /><span>Eligibility is not verified by Source. Check the original listing for location, schedule, and availability requirements before acting.</span></div>{opportunity.budgetSignal && <div className="budget-line"><Icon name="briefcase" size={14} /> Source signal: {opportunity.budgetSignal}</div>}<div className="card-actions"><button className="button button-primary" onClick={onProposal}>{saved ? "Draft proposal" : "Save and draft"} <Icon name="arrow" size={16} /></button><button className="button button-quiet" onClick={onSave} disabled={saved}>{saved ? <><Icon name="check" size={15} /> Saved</> : <>Save opportunity <Icon name="file" size={15} /></>}</button></div></article>;
}

export default function SourceApp() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [stage, setStage] = useState<Stage>("url");
  const [url, setUrl] = useState("");
  const [profile, setProfile] = useState<ProfileDraft>(initialProfile);
  const [profileConfirmed, setProfileConfirmed] = useState(false);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>(["startups"]);
  const [mode, setMode] = useState<DiscoveryMode>("services");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [saved, setSaved] = useState<SavedOpportunity[]>([]);
  const [selectedSaved, setSelectedSaved] = useState<SavedOpportunity | null>(null);
  const [proposal, setProposal] = useState("");
  const [proposalDirty, setProposalDirty] = useState(false);
  const [proposalSaving, setProposalSaving] = useState(false);
  const [proposalSaveError, setProposalSaveError] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [providerText, setProviderText] = useState("");

  const changeStage = useCallback((nextStage: Stage) => {
    setStage(nextStage);
    window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }, []);

  const loadSaved = useCallback(async () => {
    try { const result = await api<{ opportunities: SavedOpportunity[] }>("/api/saved"); setSaved(result.opportunities); } catch { /* anonymous or not configured yet */ }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const result = await api<{ profile: ProfileDraft | null }>("/api/profile");
      if (result.profile) {
        setProfile(result.profile);
        setProfileConfirmed(true);
        changeStage("discover");
      }
    } catch { /* a new account has no profile yet */ }
  }, [changeStage]);

  useEffect(() => {
    api<{ user: PublicUser | null }>("/api/auth/me").then((result) => { setUser(result.user); if (result.user) { void loadSaved(); void loadProfile(); } }).catch(() => undefined).finally(() => setAuthLoading(false));
  }, [loadProfile, loadSaved]);

  const savedUrls = useMemo(() => new Set(saved.map((item) => item.sourceUrl)), [saved]);

  async function analyze() {
    setBusy(true); setError(""); setNotice("");
    try { const result = await api<{ profile: ProfileDraft }>("/api/profile/analyze", { method: "POST", body: JSON.stringify({ url }) }); setProfile(result.profile); setProfileConfirmed(false); changeStage("review"); setNotice("Profile drafted from the public page. Review the evidence before you confirm it."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Website analysis failed."); } finally { setBusy(false); }
  }

  async function confirmProfile() {
    setBusy(true); setError("");
    try { const result = await api<{ profile: ProfileDraft }>(profileConfirmed ? "/api/profile" : "/api/profile/confirm", { method: profileConfirmed ? "PUT" : "POST", body: JSON.stringify({ profile }) }); setProfile(result.profile); setProfileConfirmed(true); changeStage("discover"); setNotice(profileConfirmed ? "Profile changes saved. Your next search will use them." : "Profile confirmed. Choose who you want to work with."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Could not save the profile."); } finally { setBusy(false); }
  }

  async function findOpportunities() {
    setBusy(true); setError(""); setNotice("");
    try { const result = await api<{ opportunities: Opportunity[]; providers: Array<{ provider: string; status: string; detail: string }> }>("/api/opportunities/search", { method: "POST", body: JSON.stringify({ customerTypes, mode }) }); setOpportunities(result.opportunities); setProviderText(result.providers.map((provider) => `${provider.provider}: ${provider.status}`).join(" · ")); changeStage("results"); setNotice(result.opportunities.length ? "Live source results are ready. Inspect the evidence before acting." : "No current match passed the freshness and classification rules."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Opportunity search failed."); } finally { setBusy(false); }
  }

  async function saveOpportunity(opportunity: Opportunity) {
    setError("");
    try { await api("/api/opportunities/save", { method: "POST", body: JSON.stringify({ opportunity }) }); await loadSaved(); setNotice("Saved to your account. It will still be here after you return."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Could not save this opportunity."); }
  }

  async function draftProposal(opportunity: Opportunity | SavedOpportunity) {
    setError(""); setProposalSaveError("");
    try {
      let item = opportunity as SavedOpportunity;
      if (!item.id) { await saveOpportunity(opportunity); const refreshed = await api<{ opportunities: SavedOpportunity[] }>("/api/saved"); item = refreshed.opportunities.find((candidate) => candidate.sourceUrl === opportunity.sourceUrl) || item; }
      if (!item.id) throw new Error("Save the opportunity before drafting a proposal.");
      const result = await api<{ proposal: string }>(`/api/opportunities/${item.id}/proposal`, { method: "POST", body: JSON.stringify({}) }); setSelectedSaved(item); setProposal(result.proposal); setProposalDirty(false); await loadSaved();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Could not draft the proposal."); }
  }

  async function saveProposalDraft() {
    if (!selectedSaved?.id) return;
    setProposalSaving(true); setProposalSaveError("");
    try {
      const result = await api<{ proposal: string; saved: boolean }>(`/api/opportunities/${selectedSaved.id}/proposal`, { method: "PUT", body: JSON.stringify({ proposal }) });
      setProposal(result.proposal); setProposalDirty(false); await loadSaved(); setNotice("Proposal draft saved to your account.");
    } catch (requestError) {
      setProposalSaveError(requestError instanceof Error ? requestError.message : "Could not save the proposal draft.");
    } finally { setProposalSaving(false); }
  }

  async function signOut() { await fetch("/api/auth/logout", { method: "POST" }); setUser(null); changeStage("url"); setSaved([]); setProfile(initialProfile); setProfileConfirmed(false); setSelectedSaved(null); setProposal(""); setProposalDirty(false); setProposalSaveError(""); }

  if (authLoading) return <main className="loading-screen"><SourceLogo /><span className="button-spinner large" /><p>Opening Source...</p></main>;
  if (!user) return <PublicLanding authMode={authMode} setAuthMode={setAuthMode} onComplete={(nextUser) => { setUser(nextUser); void loadSaved(); void loadProfile(); }} />;

  const selectSaved = (item: SavedOpportunity) => { setSelectedSaved(item); setProposal(item.proposalDraft || ""); setProposalDirty(false); setProposalSaveError(""); changeStage("results"); };

  const startOver = () => { setProfile(initialProfile); setProfileConfirmed(false); setUrl(""); setError(""); setNotice("Start with a different public page whenever your work changes."); changeStage("url"); };

  return <main className="app-shell"><AppHeader stage={stage} user={user} onSignOut={() => void signOut()} /><div className="app-layout"><ContextRail profile={profile} saved={saved} stage={stage} onSavedSelect={selectSaved} /><section className="main-workspace" id="main-workspace"><div className="workspace-mobile-context"><div className="card-label">Source workspace</div><strong>{profile.businessName || "Build from public work"}</strong></div>{stage === "url" && <UrlOnboarding url={url} setUrl={setUrl} busy={busy} error={error} onAnalyze={() => void analyze()} onManual={() => { setProfile({ ...initialProfile, businessName: user.displayName }); setProfileConfirmed(false); changeStage("review"); }} />}{stage === "review" && <ProfileReview profile={profile} setProfile={setProfile} onConfirm={() => void confirmProfile()} busy={busy} error={error} isSaved={profileConfirmed} />}{stage === "discover" && <section className="workspace-section discovery-stage" aria-labelledby="discover-title"><div className="stage-header"><div><div className="eyebrow">Step 3 · Choose your audience</div><h1 id="discover-title">Who should Source look for?</h1><p className="lead">Your choices change query vocabulary, category evidence, and ranking. Select one or more.</p></div><span className="stage-pill"><Icon name="users" size={14} /> Query changes with you</span></div><div className="profile-actions"><button className="button button-quiet" onClick={() => { setError(""); changeStage("review"); }}><Icon name="edit" size={16} /> Edit confirmed profile</button><button className="button button-quiet" onClick={startOver}>Start over</button></div><div className="category-grid">{categoryOptions.map((option) => <label key={option.value} className={`category-option ${customerTypes.includes(option.value) ? "selected" : ""}`}><input type="checkbox" checked={customerTypes.includes(option.value)} onChange={() => setCustomerTypes((current) => current.includes(option.value) ? current.filter((item) => item !== option.value) : [...current, option.value])} /><span className="category-check"><Icon name="check" size={15} /></span><span><strong>{option.label}</strong><small>{option.note}</small></span><Icon name="chevron" size={17} /></label>)}</div><div className="mode-selector"><div><strong>What are you looking for?</strong><span>Source prioritizes service-provider discovery in this release.</span></div><div className="mode-options"><label className={mode === "services" ? "selected" : ""}><input type="radio" checked={mode === "services"} onChange={() => setMode("services")} />Projects and contracts</label><label className={mode === "product" ? "selected" : ""}><input type="radio" checked={mode === "product"} onChange={() => setMode("product")} />Potential buyers</label></div></div><div className="search-boundary"><Icon name="shield" size={18} /><span>Potential buyer results are public signals only. Source labels uncertain intent instead of claiming a customer wants to pay.</span></div>{error && <p className="form-error" role="alert"><Icon name="x" size={16} />{error}</p>}<button className="button button-primary button-large" onClick={() => void findOpportunities()} disabled={busy || !customerTypes.length}>{busy ? <><span className="button-spinner" />Searching live sources...</> : <>Find opportunities <Icon name="arrow" size={17} /></>}</button></section>}{stage === "results" && <section className="workspace-section results-stage" aria-labelledby="results-title"><div className="stage-header"><div><div className="eyebrow">Live source results</div><h1 id="results-title">Investigate the right next step.</h1><p className="lead">Matched to {profile.businessName || "your confirmed profile"}. Results are not promises. Open the original source before you decide.</p></div><button className="button button-quiet" onClick={() => changeStage("discover")}><Icon name="edit" size={16} /> Adjust search</button></div><div className="results-summary"><span><Icon name="check" size={15} /> Customer types: {customerTypes.map((item) => item.replaceAll("-", " ")).join(", ")}</span><span><Icon name="globe" size={15} /> Live source response</span></div>{providerText && <div className="provider-line">{providerText}</div>}{error && <p className="form-error" role="alert"><Icon name="x" size={16} />{error}</p>}{opportunities.length ? <div className="opportunity-list">{opportunities.map((opportunity) => <OpportunityCard key={`${opportunity.source}-${opportunity.sourceUrl}`} opportunity={opportunity} onSave={() => void saveOpportunity(opportunity)} onProposal={() => void draftProposal(opportunity)} saved={savedUrls.has(opportunity.sourceUrl)} />)}</div> : <div className="empty-state"><div className="empty-mark"><Icon name="target" size={30} /></div><h2>No current match passed the evidence rules.</h2><p>That is a useful result, not a failure. Try a different customer type or broaden the confirmed keywords. Source excludes stale and full-time records.</p><button className="button button-quiet" onClick={() => changeStage("discover")}>Adjust search <Icon name="arrow" size={16} /></button></div>}</section>}{notice && <div className="notice success-notice"><Icon name="check" size={17} /><span>{notice}</span></div>}{selectedSaved && <section className="proposal-panel" aria-labelledby="proposal-title"><div className="proposal-header"><div><div className="eyebrow">Saved work</div><h2 id="proposal-title">Editable proposal draft</h2><p className="muted">Generated from your confirmed profile and saved opportunity. Source never sends it for you.</p></div><div className="proposal-status"><span className={proposalSaving ? "unsaved" : proposalDirty ? "unsaved" : "saved"}><Icon name={proposalSaving || proposalDirty ? "edit" : "check"} size={14} />{proposalSaving ? "Saving draft…" : proposalDirty ? "Unsaved edit" : "Saved draft"}</span><button className="icon-button" onClick={() => setSelectedSaved(null)} aria-label="Close proposal"><Icon name="x" size={18} /></button></div></div><textarea aria-label="Proposal draft" value={proposal} onChange={(event) => { setProposal(event.target.value); setProposalDirty(true); setProposalSaveError(""); }} rows={15} />{proposalSaveError && <p className="form-error" role="alert"><Icon name="x" size={16} />{proposalSaveError}</p>}<div className="proposal-foot"><span><Icon name="lock" size={14} />{proposalDirty ? "Save a draft before you leave." : "Saved to your account."}</span><div className="card-actions"><button className="button button-primary" onClick={() => void saveProposalDraft()} disabled={proposalSaving || !proposalDirty}>{proposalSaving ? "Saving draft…" : "Save draft"} <Icon name="check" size={15} /></button><button className="button button-quiet" onClick={() => navigator.clipboard?.writeText(proposal)}>Copy proposal <Icon name="file" size={15} /></button><a className="button button-quiet" href={selectedSaved.sourceUrl} target="_blank" rel="noreferrer">Open original <Icon name="external" size={15} /></a></div></div></section>}</section></div></main>;
}
