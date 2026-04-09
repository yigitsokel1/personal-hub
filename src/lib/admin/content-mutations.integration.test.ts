import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`);
});

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

describe("content-mutations integration", () => {
  beforeEach(() => {
    redirectMock.mockClear();
  });

  it("redirects with encoded field + global publish errors", async () => {
    const { enforcePublishEligibility } = await import("@/lib/admin/content-mutations");

    expect(() =>
      enforcePublishEligibility(true, "/admin/writing/new", {
        slug: "",
        summary: "",
        body: "",
        publishedAt: "",
      })
    ).toThrowError(/^REDIRECT:/);

    expect(redirectMock).toHaveBeenCalledTimes(1);
    const url = redirectMock.mock.calls[0]?.[0] as string;
    expect(url).toContain("/admin/writing/new?status=error&errors=");
    expect(decodeURIComponent(url)).toContain('"slug":"Slug is required before publishing."');
    expect(decodeURIComponent(url)).toContain('"_global":"Cannot publish yet.');
  });
});
