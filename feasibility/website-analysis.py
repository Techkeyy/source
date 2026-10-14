"""Focused Phase 2 website-analysis feasibility test.

This is an isolated evidence script, not application code. It uses only the
Python standard library, validates public destinations before connecting,
binds the HTTP connection to the validated address, refuses automatic
redirects, extracts readable static HTML, and emits a grounded fallback
profile. It does not claim that a Gemma model ran.
"""

from __future__ import annotations

import http.client
import ipaddress
import json
import os
import re
import socket
import ssl
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit

MAX_BYTES = 1_000_000
MAX_REDIRECTS = 3
USER_AGENT = "Source-Phase2-Feasibility/0.1"

TEST_SITES = [
    {
        "label": "freelancer-portfolio-like",
        "url": "https://www.austinkleon.com/",
        "classification": "personal creator and portfolio-like site",
    },
    {
        "label": "agency-or-service",
        "url": "https://www.frog.co/",
        "classification": "design and strategy service organization",
    },
    {
        "label": "product-landing-page",
        "url": "https://www.campfire.so/",
        "classification": "software product landing page",
    },
    {
        "label": "sparse-difficult",
        "url": "https://example.com/",
        "classification": "intentionally sparse public HTML; not treated as a business",
    },
]


def is_public_address(address: ipaddress._BaseAddress) -> bool:
    return not (
        address.is_loopback
        or address.is_private
        or address.is_link_local
        or address.is_multicast
        or address.is_reserved
        or address.is_unspecified
    )


def resolve_public(hostname: str) -> list[str]:
    addresses = sorted(
        {
            str(item[4][0])
            for item in socket.getaddrinfo(hostname, None, type=socket.SOCK_STREAM)
        }
    )
    if not addresses:
        raise ValueError("hostname did not resolve to a stream address")
    parsed = [ipaddress.ip_address(item) for item in addresses]
    unsafe = [str(item) for item in parsed if not is_public_address(item)]
    if unsafe:
        raise ValueError("unsafe destination address(es): " + ", ".join(unsafe))
    return addresses


def validate_url(raw_url: str) -> tuple[str, str, int, str]:
    parsed = urlsplit(raw_url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("only http and https URLs are allowed")
    if not parsed.hostname:
        raise ValueError("URL has no hostname")
    if parsed.username or parsed.password:
        raise ValueError("credentials in URLs are not allowed")
    if parsed.fragment:
        raise ValueError("URL fragments are removed before fetching")
    addresses = resolve_public(parsed.hostname)
    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    path = parsed.path or "/"
    if parsed.query:
        path += "?" + parsed.query
    normalized = parsed._replace(fragment="").geturl()
    return normalized, addresses[0], port, path


class BoundHTTPConnection(http.client.HTTPConnection):
    def __init__(self, host: str, port: int, address: str, timeout: float):
        super().__init__(host, port, timeout=timeout)
        self.bound_address = address

    def connect(self) -> None:
        self.sock = socket.create_connection(
            (self.bound_address, self.port), timeout=self.timeout
        )


class BoundHTTPSConnection(http.client.HTTPSConnection):
    def __init__(
        self,
        host: str,
        port: int,
        address: str,
        timeout: float,
        context: ssl.SSLContext,
    ):
        super().__init__(host, port, timeout=timeout, context=context)
        self.bound_address = address

    def connect(self) -> None:
        sock = socket.create_connection(
            (self.bound_address, self.port), timeout=self.timeout
        )
        self.sock = self._context.wrap_socket(sock, server_hostname=self.host)


def fetch_public_html(raw_url: str, redirect_count: int = 0) -> dict:
    normalized, address, port, path = validate_url(raw_url)
    parsed = urlsplit(normalized)
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
        "Accept-Encoding": "identity",
        "Connection": "close",
        "Host": parsed.hostname
        if port in {80, 443}
        else f"{parsed.hostname}:{port}",
    }
    context = ssl.create_default_context()
    connection: http.client.HTTPConnection
    if parsed.scheme == "https":
        connection = BoundHTTPSConnection(
            parsed.hostname, port, address, timeout=15.0, context=context
        )
    else:
        connection = BoundHTTPConnection(
            parsed.hostname, port, address, timeout=15.0
        )
    try:
        connection.request("GET", path, headers=headers)
        response = connection.getresponse()
        status = response.status
        response_headers = {key.lower(): value for key, value in response.getheaders()}
        if 300 <= status < 400 and response_headers.get("location"):
            if redirect_count >= MAX_REDIRECTS:
                raise ValueError("redirect limit exceeded")
            target = urljoin(normalized, response_headers["location"])
            return fetch_public_html(target, redirect_count + 1)
        body = response.read(MAX_BYTES + 1)
        if len(body) > MAX_BYTES:
            raise ValueError("response exceeded the 1 MB feasibility limit")
        content_type = response_headers.get("content-type", "")
        if content_type and "html" not in content_type.lower():
            raise ValueError("response content type is not HTML: " + content_type)
        return {
            "requested_url": raw_url,
            "final_url": normalized,
            "validated_address": address,
            "status": status,
            "content_type": content_type,
            "bytes": len(body),
            "html": body.decode("utf-8", errors="replace"),
        }
    finally:
        connection.close()


class ReadableHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_parts: list[str] = []
        self.meta_description = ""
        self.headings: list[str] = []
        self.paragraphs: list[str] = []
        self.links: list[str] = []
        self.current_tag = ""
        self.current_heading: list[str] = []
        self.current_paragraph: list[str] = []
        self.ignored_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value or "" for key, value in attrs}
        if tag in {"script", "style", "noscript", "svg", "template"}:
            self.ignored_depth += 1
            return
        if self.ignored_depth:
            return
        self.current_tag = tag
        if tag in {"h1", "h2", "h3", "h4"}:
            self.current_heading = []
        elif tag == "p":
            self.current_paragraph = []
        elif tag == "meta" and values.get("name", "").lower() == "description":
            self.meta_description = values.get("content", "").strip()
        elif tag == "a" and values.get("href", ""):
            self.links.append(values["href"])

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript", "svg", "template"}:
            self.ignored_depth = max(0, self.ignored_depth - 1)
            return
        if self.ignored_depth:
            return
        if tag == "title":
            self.title_parts = self.title_parts
        elif tag in {"h1", "h2", "h3", "h4"} and self.current_heading:
            value = clean_text(" ".join(self.current_heading))
            if value:
                self.headings.append(value)
            self.current_heading = []
        elif tag == "p" and self.current_paragraph:
            value = clean_text(" ".join(self.current_paragraph))
            if value:
                self.paragraphs.append(value)
            self.current_paragraph = []
        self.current_tag = ""

    def handle_data(self, data: str) -> None:
        if self.ignored_depth:
            return
        value = clean_text(data)
        if not value:
            return
        if self.current_tag == "title":
            self.title_parts.append(value)
        elif self.current_tag in {"h1", "h2", "h3", "h4"}:
            self.current_heading.append(value)
        elif self.current_tag == "p":
            self.current_paragraph.append(value)


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def unique(values: list[str], limit: int = 10) -> list[str]:
    output: list[str] = []
    seen: set[str] = set()
    for item in values:
        normalized = clean_text(item)
        key = normalized.lower()
        if normalized and key not in seen:
            seen.add(key)
            output.append(normalized)
        if len(output) >= limit:
            break
    return output


def build_grounded_profile(site: dict, fetched: dict) -> dict:
    parser = ReadableHTML()
    parser.feed(fetched["html"])
    title = clean_text(" ".join(parser.title_parts))
    description = parser.meta_description
    paragraphs = unique(parser.paragraphs, 20)
    headings = unique(parser.headings, 20)
    evidence: list[dict] = []

    def direct(field: str, value: str, excerpt: str) -> dict:
        evidence.append(
            {
                "field": field,
                "value": value,
                "excerpt": excerpt[:280],
                "source_url": fetched["final_url"],
                "evidence_type": "DIRECT",
            }
        )
        return {"value": value, "evidence_type": "DIRECT"}

    name = title.split("|")[0].split(" — ")[0].strip() if title else ""
    what_it_does = description or (paragraphs[0] if paragraphs else "")
    services = unique(headings + paragraphs[1:5], 6)
    technology_names = [
        item
        for item in [
            "TypeScript",
            "JavaScript",
            "React",
            "Python",
            "Django",
            "Node.js",
            "Figma",
            "Webflow",
            "Shopify",
            "WordPress",
            "AI",
            "machine learning",
        ]
        if re.search(r"\b" + re.escape(item) + r"\b", fetched["html"], re.I)
    ]
    direct_categories = [
        item
        for item in ["small businesses", "startups", "agencies", "individuals"]
        if re.search(re.escape(item), fetched["html"], re.I)
    ]
    inferred_categories = [
        {
            "category": item,
            "evidence_type": "INFERRED",
            "reason": "No direct customer-category evidence was found; this is a reviewable suggestion only.",
        }
        for item in ["small businesses", "startups", "agencies", "individuals"]
        if item not in direct_categories
    ]
    if name:
        direct("business_or_project_name", name, title)
    if what_it_does:
        direct("what_it_does", what_it_does, description or paragraphs[0])
    for service in services[:5]:
        direct("service_or_product_signal", service, service)
    for technology in technology_names:
        direct("technology_signal", technology, technology)
    for category in direct_categories:
        direct("customer_segment_signal", category, category)

    unsupported: list[dict] = []
    for field, patterns in {
        "past_clients": [r"\btrusted by\b", r"\bclients?\b"],
        "pricing": [r"\$\s?\d", r"\bpricing\b", r"\bplans?\b"],
        "ownership": [r"\bfounded\b", r"\bowner\b", r"\bowned by\b"],
        "years_experience": [r"\b\d+\+?\s+years?\b"],
    }.items():
        if not any(re.search(pattern, fetched["html"], re.I) for pattern in patterns):
            unsupported.append(
                {
                    "field": field,
                    "status": "NOT_SUPPORTED_BY_SOURCE",
                    "message": "No source evidence found; do not invent this field.",
                }
            )

    keywords = unique(
        [
            *technology_names,
            *[word for word in re.findall(r"[A-Za-z][A-Za-z-]{4,}", what_it_does)][:8],
            *direct_categories,
        ],
        12,
    )
    return {
        "business_or_project_name": name,
        "what_it_does": what_it_does,
        "products_and_services": services,
        "problems_it_solves": [],
        "skills_and_technologies": technology_names,
        "value_proposition_and_differentiators": (
            direct("value_proposition", what_it_does, description or what_it_does)
            if what_it_does
            else {"value": "", "evidence_type": "UNSUPPORTED"}
        ),
        "portfolio_or_project_evidence": unique(headings + paragraphs, 8),
        "direct_customer_category_signals": direct_categories,
        "suggested_customer_categories": inferred_categories,
        "suggested_search_keywords": keywords,
        "evidence": evidence,
        "unsupported_claims_detected": unsupported,
        "grounding_note": "This fallback profile contains direct excerpts and explicitly labeled inferences; no LLM was used.",
    }


def safety_cases() -> list[dict]:
    cases = [
        "file:///C:/Windows/win.ini",
        "http://127.0.0.1/",
        "http://localhost/",
        "http://10.0.0.1/",
        "http://169.254.169.254/latest/meta-data/",
        "https://example.com/",
    ]
    results = []
    for raw_url in cases:
        expected = "accept" if raw_url == "https://example.com/" else "reject"
        try:
            validate_url(raw_url)
            results.append(
                {
                    "url": raw_url,
                    "expected": expected,
                    "observed": "accepted",
                    "status": "PASS" if expected == "accept" else "FAIL",
                }
            )
        except Exception as error:  # noqa: BLE001
            results.append(
                {
                    "url": raw_url,
                    "expected": expected,
                    "observed": str(error),
                    "status": "FAIL" if expected == "accept" else "PASS",
                }
            )
    return results


def model_status() -> dict:
    present = [name for name in ["GOOGLE_API_KEY", "GEMMA_API_KEY"] if os.environ.get(name)]
    local_runtimes = [name for name in ["OLLAMA_HOST"] if os.environ.get(name)]
    if present or local_runtimes:
        return {
            "status": "NOT_RUN",
            "provider": "credentials_or_runtime_detected_but_not_invoked_by_this_script",
            "reason": "Manual model invocation requires an owner-approved model endpoint and explicit runtime validation.",
        }
    return {
        "status": "BLOCKED",
        "provider": None,
        "reason": "No Gemma credential or local Gemma runtime was available on 2026-10-14.",
    }


def main() -> int:
    output: dict = {
        "test": "website-analysis-feasibility",
        "test_date": "2026-10-14",
        "model": model_status(),
        "ssrf_cases": safety_cases(),
        "sites": [],
    }
    for site in TEST_SITES:
        item = {**site}
        try:
            fetched = fetch_public_html(site["url"])
            profile = build_grounded_profile(site, fetched)
            item.update(
                {
                    "status": "PASS",
                    "fetch": {key: value for key, value in fetched.items() if key != "html"},
                    "profile": profile,
                }
            )
        except Exception as error:  # noqa: BLE001
            item.update({"status": "FAIL", "error": str(error)})
        output["sites"].append(item)
    destination = Path(__file__).with_name("website-analysis-results-2026-10-14.json")
    destination.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(output, indent=2, ensure_ascii=False))
    print("Wrote:", destination)
    return 0


if __name__ == "__main__":
    sys.exit(main())
