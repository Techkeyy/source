import * as cheerio from "cheerio";
import { fetchPublicHtml } from "./ssrf";

export interface ExtractedWebsite {
  requestedUrl: string;
  finalUrl: string;
  title: string;
  description: string;
  text: string;
  excerpts: string[];
}

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function extractWebsite(rawUrl: string): Promise<ExtractedWebsite> {
  const fetched = await fetchPublicHtml(rawUrl);
  const $ = cheerio.load(fetched.html);
  $("script, style, noscript, svg, template, iframe, canvas").remove();
  const title = clean($("title").first().text() || $("h1").first().text() || new URL(fetched.url).hostname);
  const description = clean($("meta[name='description']").attr("content") || $("meta[property='og:description']").attr("content") || "");
  const excerpts = [title, description, ...$("h1, h2, h3, p, li").map((_, element) => clean($(element).text())).get()].filter((value) => value.length >= 12);
  const deduped = [...new Set(excerpts)].slice(0, 180);
  const text = deduped.join("\n").slice(0, 40_000);
  return { requestedUrl: rawUrl, finalUrl: fetched.url, title, description, text, excerpts: deduped };
}
