import { describe, expect, it } from "vitest";
import { assertSafePublicUrl } from "@/lib/ssrf";
import { hashPassword, verifyPassword } from "@/lib/auth";

describe("public website boundary", () => {
  it("rejects loopback addresses before fetching", async () => {
    await expect(assertSafePublicUrl("http://127.0.0.1/health")).rejects.toThrow(/private|local/i);
  });

  it("rejects metadata and private network addresses", async () => {
    await expect(assertSafePublicUrl("http://169.254.169.254/latest/meta-data")).rejects.toThrow(/private|local/i);
    await expect(assertSafePublicUrl("http://10.0.0.1")).rejects.toThrow(/private|local/i);
  });

  it("rejects credentials and non-standard ports", async () => {
    await expect(assertSafePublicUrl("https://user:password@example.com")).rejects.toThrow(/public|http/i);
    await expect(assertSafePublicUrl("https://example.com:8080")).rejects.toThrow(/port/i);
  });
});

describe("password boundary", () => {
  it("stores a hash that verifies without storing the password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).not.toContain("correct horse");
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });
});
