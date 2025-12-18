import { describe, it, expect, vi, beforeEach } from "vitest";

import { MetaApiClient } from "./meta-api-client";

describe("MetaApiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("retries on 429 up to maxAttempts", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Map([ ["retry-after", "0"] ]),
        text: async () => "rate limited",
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
        headers: new Map(),
      });

    // @ts-ignore - override global fetch
    globalThis.fetch = fetchMock;

    const client = new MetaApiClient("token");
    const res = await client.request<{ ok: boolean }>("me");

    expect(res.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("fetchAllPages iterates paging.next", async () => {
    const first = {
      ok: true,
      status: 200,
      headers: new Map(),
      json: async () => ({ data: [{ id: "1" }], paging: { next: "https://graph.facebook.com/v19.0/me?after=2&access_token=token" } }),
    };

    const second = {
      ok: true,
      status: 200,
      headers: new Map(),
      json: async () => ({ data: [{ id: "2" }], paging: {} }),
    };

    const fetchMock = vi.fn().mockResolvedValueOnce(first).mockResolvedValueOnce(second);
    // @ts-ignore - override global fetch
    globalThis.fetch = fetchMock;

    const client = new MetaApiClient("token");
    const pages: any[] = [];

    for await (const page of client.fetchAllPages<any>("me", {})) {
      pages.push(page);
    }

    expect(pages).toHaveLength(2);
    expect(pages[0][0].id).toBe("1");
    expect(pages[1][0].id).toBe("2");
  });
});
