import dns from "node:dns/promises";
import net from "node:net";
import { SourceError } from "./errors";

const MAX_BYTES = 1_000_000;
const MAX_REDIRECTS = 3;

function ipv4IsPrivate(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b] = parts;
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

function ipv6IsPrivate(ip: string) {
  const normalized = ip.toLowerCase();
  return normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:") || normalized.startsWith("::ffff:127.") || normalized.startsWith("::ffff:10.") || normalized.startsWith("::ffff:192.168.") || normalized.startsWith("::ffff:169.254.");
}

function isPrivateAddress(ip: string) {
  const kind = net.isIP(ip);
  return kind === 4 ? ipv4IsPrivate(ip) : kind === 6 ? ipv6IsPrivate(ip) : true;
}

export async function assertSafePublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new SourceError("Enter a complete public website URL, including https://.");
  }
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || !url.hostname) throw new SourceError("Only public http or https website URLs are supported.");
  if (url.port && !["80", "443"].includes(url.port)) throw new SourceError("This URL uses a non-standard port and cannot be fetched safely.");
  const addresses = await dns.lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new SourceError("This URL points to a private or local network address.");
  return url;
}

async function readBounded(response: Response) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) throw new SourceError("This page is larger than Source can safely analyze.", 413, "PAGE_TOO_LARGE");
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return new TextDecoder().decode(Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))));
}

export async function fetchPublicHtml(raw: string) {
  let current = await assertSafePublicUrl(raw);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(8_000),
      headers: { "user-agent": "Source/0.1 (+public website analysis)", accept: "text/html,application/xhtml+xml" },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new SourceError("The website returned an incomplete redirect.", 502, "BAD_REDIRECT");
      current = await assertSafePublicUrl(new URL(location, current).toString());
      continue;
    }
    if (!response.ok) throw new SourceError(`The website returned HTTP ${response.status}.`, 502, "WEBSITE_FETCH_FAILED");
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) throw new SourceError("That URL does not serve a readable HTML page.", 415, "UNSUPPORTED_CONTENT");
    return { url: current.toString(), html: await readBounded(response) };
  }
  throw new SourceError("The website redirected too many times.", 502, "TOO_MANY_REDIRECTS");
}
