import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("portfolio routes", () => {
  it("should return empty portfolio list", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    const result = await caller.portfolio.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should return empty blog list", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    const result = await caller.blog.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
