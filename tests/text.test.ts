import { describe, expect, it } from "vitest";
import { normalizeExternalText } from "@/lib/text";

describe("external text normalization", () => {
  it("repairs a UTF-8 em dash that arrived as Latin-1 mojibake", () => {
    expect(normalizeExternalText("data\u00e2\u0080\u0094moving")).toBe("data—moving");
  });

  it("repairs mojibaked curly quotes without changing nearby real accents", () => {
    expect(normalizeExternalText("\u00e2\u0080\u009cCafé\u00e2\u0080\u009d — déjà vu")).toBe("“Café” — déjà vu");
  });

  it("leaves legitimate Unicode punctuation and accented characters unchanged", () => {
    const value = "“Café” — déjà vu; naïve coöperation.";
    expect(normalizeExternalText(value)).toBe(value);
  });
});
