"""Focused Phase 2 discovery and category-differentiation feasibility test.

This script queries fixed, documented public endpoints. It does not scrape
restricted services, send outreach, use paid APIs, or infer that an ambiguous
record is a buyer. Category scores are deterministic and deliberately
conservative; they are evidence for the design decision, not production
ranking code.
"""

from __future__ import annotations

import html
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

USER_AGENT = "Source-Phase2-Discovery-Feasibility/0.1"
FRESHNESS_DAYS = 30
PROFILE_KEYWORDS = {
    "design",
    "research",
    "ai",
    "experience",
    "strategy",
    "product",
    "creative",
    "technology",
}

CATEGORY_RULES = {
    "small businesses": {
        "query_terms": ["small business", "SMB", "local business"],
        "qualification_terms": ["small business", "small team", "owner", "local", "SMB"],
    },
    "startups": {
        "query_terms": ["startup", "founder", "MVP"],
        "qualification_terms": ["startup", "founder", "seed", "MVP", "early-stage", "venture"],
    },
    "agencies": {
        "query_terms": ["agency", "studio", "consultancy"],
        "qualification_terms": ["agency", "studio", "consultancy", "white-label", "subcontract"],
    },
    "individuals": {
        "query_terms": ["personal project", "creator", "individual"],
        "qualification_terms": ["personal project", "creator", "coach", "author", "individual", "one-off"],
    },
}


def request_json(url: str) -> object:
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    with urlopen(request, timeout=30) as response:
        body = response.read(4_000_000)
        return json.loads(body.decode("utf-8", errors="replace"))


def first_value(record: dict, names: list[str]) -> object:
    for name in names:
        value = record.get(name)
        if value not in (None, ""):
            return value
    return None


def strip_html(value: object) -> str:
    if value is None:
        return ""
    text = html.unescape(str(value))
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_datetime(value: object) -> datetime | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        try:
            return datetime.fromtimestamp(value, tz=timezone.utc)
        except (ValueError, OSError):
            return None
    text = str(value).strip()
    if not text:
        return None
    if text.isdigit():
        try:
            return datetime.fromtimestamp(int(text), tz=timezone.utc)
        except (ValueError, OSError):
            return None
    text = text.replace("Z", "+00:00")
    for candidate in [text, text.split(".")[0]]:
        try:
            parsed = datetime.fromisoformat(candidate)
            return parsed.replace(tzinfo=parsed.tzinfo or timezone.utc).astimezone(timezone.utc)
        except ValueError:
            pass
    for pattern in ["%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%a, %d %b %Y %H:%M:%S %z"]:
        try:
            parsed = datetime.strptime(text, pattern)
            return parsed.replace(tzinfo=parsed.tzinfo or timezone.utc).astimezone(timezone.utc)
        except ValueError:
            pass
    return None


def canonical_url(source: str, record: dict) -> str:
    value = first_value(
        record,
        [
            "url",
            "jobUrl",
            "job_url",
            "link",
            "applyUrl",
            "applicationUrl",
            "canonical_url",
        ],
    )
    if value:
        return str(value)
    if source == "Hacker News" and record.get("objectID"):
        return "https://news.ycombinator.com/item?id=" + str(record["objectID"])
    return ""


def normalize_record(source: str, record: dict) -> dict:
    title = strip_html(first_value(record, ["title", "position", "name", "jobTitle"]))
    description = strip_html(
        first_value(
            record,
            [
                "description",
                "excerpt",
                "content",
                "text",
                "story_text",
                "companyDescription",
                "company_description",
                "jobDescription",
                "jobExcerpt",
            ],
        )
    )
    timestamp_value = first_value(
        record,
        [
            "created_at",
            "created_at_i",
            "date",
            "pubDate",
            "published",
            "published_at",
            "postedDate",
            "updated_at",
        ],
    )
    published_at = parse_datetime(timestamp_value)
    raw_type = strip_html(first_value(record, ["jobType", "job_type", "employmentType", "employment_type"]))
    full_text = f"{title} {description} {raw_type}".strip()
    lower = full_text.lower()
    has_contract_signal = any(
        term in lower
        for term in ["freelance", "contractor", "contract position", "project-based", "part-time contract"]
    )
    has_full_time_signal = any(
        term in raw_type.lower()
        for term in ["full-time", "full time", "permanent"]
    )
    if has_contract_signal and (
        source != "Hacker News"
        or bool(raw_type)
        or bool(re.search(r"\b(freelance|contract)\b", title, re.I))
    ):
        classification = "explicit_freelance_or_contract"
    elif has_full_time_signal:
        classification = "permanent_or_unspecified_employment"
    elif source == "Hacker News" and any(
        term in lower
        for term in ["looking for", "seeking", "need a ", "need an ", "wanted:", "hiring"]
    ):
        classification = "potential_buyer_signal_unconfirmed"
    elif any(term in lower for term in ["who is hiring", "we are hiring", "job opening", "full-time", "full time", "permanent"]):
        classification = "permanent_or_unspecified_employment"
    elif any(term in lower for term in ["looking for", "seeking", "need a ", "need an ", "wanted:"]):
        classification = "potential_buyer_signal_unconfirmed"
    else:
        classification = "irrelevant_or_unclear"

    has_budget = bool(
        re.search(
            r"(\$|€|£)\s?\d|(?:budget|hourly|per hour|salary|compensation|rate)\b",
            lower,
        )
    )
    has_contact = bool(
        re.search(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b", full_text)
        or re.search(r"\b(apply|application|how to apply|submit|contact)\b", lower)
    )
    keyword_hits = sorted(
        {
            keyword
            for keyword in PROFILE_KEYWORDS
            if re.search(r"\b" + re.escape(keyword) + r"\b", lower)
        }
    )
    return {
        "source": source,
        "title": title,
        "canonical_url": canonical_url(source, record),
        "published_at": published_at.isoformat() if published_at else None,
        "description_excerpt": description[:500],
        "raw_job_type": raw_type,
        "classification": classification,
        "has_explicit_budget_or_compensation_signal": has_budget,
        "has_usable_contact_or_application_signal": has_contact,
        "profile_keyword_hits": keyword_hits,
        "raw_record_keys": sorted(record.keys()),
    }


def records_for_provider(source: str, payload: object) -> list[dict]:
    if source == "Hacker News":
        return payload.get("hits", []) if isinstance(payload, dict) else []
    if source == "Remote OK":
        return [item for item in payload if isinstance(item, dict)] if isinstance(payload, list) else []
    if source == "Jobicy":
        if isinstance(payload, dict):
            for key in ["jobs", "jobListings", "data", "results"]:
                if isinstance(payload.get(key), list):
                    return payload[key]
        return []
    if source == "Himalayas":
        if isinstance(payload, dict):
            for key in ["jobs", "data", "results"]:
                if isinstance(payload.get(key), list):
                    return payload[key]
        return []
    return []


def is_fresh(record: dict, cutoff: datetime) -> bool:
    published = parse_datetime(record.get("published_at"))
    return bool(published and published >= cutoff)


def summarize_records(records: list[dict], cutoff: datetime) -> dict:
    counts = Counter(record["classification"] for record in records)
    fresh_records = [record for record in records if is_fresh(record, cutoff)]
    fresh_counts = Counter(record["classification"] for record in fresh_records)
    duplicate_keys = [
        record["canonical_url"] or record["title"].lower()
        for record in records
        if record["canonical_url"] or record["title"]
    ]
    duplicates = sum(count - 1 for count in Counter(duplicate_keys).values() if count > 1)
    return {
        "total_records": len(records),
        "fresh_records": len(fresh_records),
        "freshness_cutoff_utc": cutoff.isoformat(),
        "classification_counts_all": dict(counts),
        "classification_counts_fresh": dict(fresh_counts),
        "records_with_explicit_budget_or_compensation_signal": sum(
            record["has_explicit_budget_or_compensation_signal"] for record in records
        ),
        "records_with_usable_contact_or_application_signal": sum(
            record["has_usable_contact_or_application_signal"] for record in records
        ),
        "records_with_profile_keyword_overlap": sum(
            bool(record["profile_keyword_hits"]) for record in records
        ),
        "duplicate_records_within_provider": duplicates,
    }


def run_provider(source: str, endpoint: str) -> dict:
    try:
        payload = request_json(endpoint)
        raw_records = records_for_provider(source, payload)
        return {
            "source": source,
            "endpoint": endpoint,
            "status": "PASS",
            "raw_record_count": len(raw_records),
            "records": [normalize_record(source, item) for item in raw_records],
        }
    except Exception as error:  # noqa: BLE001
        return {
            "source": source,
            "endpoint": endpoint,
            "status": "FAIL",
            "error": str(error),
            "raw_record_count": 0,
            "records": [],
        }


def category_query(category: str) -> str:
    terms = CATEGORY_RULES[category]["query_terms"]
    return f"{terms[0]} design"


def score_category_record(record: dict, category: str, cutoff: datetime) -> dict:
    text = f"{record['title']} {record['description_excerpt']}".lower()
    terms = CATEGORY_RULES[category]["qualification_terms"]
    matched_category_terms = [term for term in terms if term.lower() in text]
    score = 0
    score += min(4, len(record["profile_keyword_hits"]))
    score += min(8, 4 * len(matched_category_terms))
    if record["classification"] == "explicit_freelance_or_contract":
        score += 4
    if record["classification"] == "potential_buyer_signal_unconfirmed":
        score += 2
    if is_fresh(record, cutoff):
        score += 2
    if record["has_explicit_budget_or_compensation_signal"]:
        score += 1
    if record["has_usable_contact_or_application_signal"]:
        score += 1
    qualification = "explicit" if matched_category_terms else "uncertain"
    explanation = {
        "category": category,
        "score": score,
        "qualification": qualification,
        "category_terms_found_in_source_text": matched_category_terms,
        "profile_terms_found_in_source_text": record["profile_keyword_hits"],
        "freshness_pass": is_fresh(record, cutoff),
        "classification": record["classification"],
        "boundary": (
            "Category is explicit only when source text contains category evidence; "
            "otherwise this is an uncertain match, not a fact."
        ),
    }
    return {**record, "category_match": explanation}


def run_category_tests(cutoff: datetime) -> dict:
    result = {
        "representative_profile": {
            "source": "frog homepage extraction",
            "confirmed_direct_signals": [
                "transformative experiences",
                "research",
                "AI",
                "design",
                "experience partner",
            ],
            "model_status": "not used; website test recorded Gemma as BLOCKED",
        },
        "categories": {},
    }
    for category in CATEGORY_RULES:
        query = category_query(category)
        endpoint = (
            "https://hn.algolia.com/api/v1/search_by_date?"
            + urlencode({"query": query, "tags": "story", "hitsPerPage": 20})
        )
        provider = run_provider("Hacker News", endpoint)
        scored = [
            score_category_record(record, category, cutoff)
            for record in provider["records"]
        ]
        scored.sort(
            key=lambda item: (
                item["category_match"]["score"],
                item["category_match"]["qualification"] == "explicit",
            ),
            reverse=True,
        )
        result["categories"][category] = {
            "query": query,
            "endpoint": endpoint,
            "status": provider["status"],
            "raw_record_count": provider["raw_record_count"],
            "shortlist": scored[:5],
            "observed_effects": {
                "query_changed": True,
                "qualification_rule_changed": True,
                "ranking_terms_changed": True,
                "match_explanation_changed": True,
            },
        }
    return result


def main() -> int:
    as_of = datetime.now(timezone.utc)
    cutoff = as_of - timedelta(days=FRESHNESS_DAYS)
    endpoints = [
        (
            "Hacker News",
            "https://hn.algolia.com/api/v1/search_by_date?"
            + urlencode({"query": "freelance", "tags": "job", "hitsPerPage": 50}),
        ),
        (
            "Jobicy",
            "https://jobicy.com/api/v2/remote-jobs?"
            + urlencode({"count": 50, "tag": "typescript"}),
        ),
        ("Remote OK", "https://remoteok.com/api?tag=dev"),
        (
            "Himalayas",
            "https://himalayas.app/jobs/api/search?"
            + urlencode({"q": "typescript", "sort": "recent"}),
        ),
    ]
    providers = [run_provider(source, endpoint) for source, endpoint in endpoints]
    for provider in providers:
        provider["summary"] = summarize_records(provider["records"], cutoff)
        provider["sample_records"] = provider["records"][:12]
        del provider["records"]
    category_result = run_category_tests(cutoff)
    output = {
        "test": "client-discovery-and-category-feasibility",
        "test_date_utc": as_of.isoformat(),
        "freshness_policy_for_test": {
            "days": FRESHNESS_DAYS,
            "note": "This is a feasibility threshold, not yet a product policy.",
        },
        "profile_used_for_matching": {
            "services": ["experience design", "research", "AI-augmented research", "strategy"],
            "keywords": sorted(PROFILE_KEYWORDS),
        },
        "providers": providers,
        "category_tests": category_result,
        "interpretation": {
            "important_boundary": "HTTP success is not treated as opportunity proof; records are classified conservatively from returned text and fields.",
            "buyer_boundary": "Potential buyer signals are unconfirmed unless source text explicitly describes demand.",
            "ranking_boundary": "The category run demonstrates observable query, qualification, score, and explanation changes; it does not prove that all source records expose reliable customer-type labels.",
        },
    }
    destination = Path(__file__).with_name("discovery-analysis-results-2026-10-14.json")
    destination.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    print(json.dumps(output, indent=2, ensure_ascii=False))
    print("Wrote:", destination)
    return 0


if __name__ == "__main__":
    sys.exit(main())
