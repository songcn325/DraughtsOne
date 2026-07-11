import { afterEach, describe, expect, it, vi } from "vitest";
import { createClientMoveId } from "./clientId";

describe("createClientMoveId", () => {
  afterEach(() => vi.restoreAllMocks());

  it("uses randomUUID when the browser provides it", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "secure-id" });
    expect(createClientMoveId()).toBe("secure-id");
  });

  it("falls back on non-secure HTTP origins", () => {
    vi.stubGlobal("crypto", {});
    vi.spyOn(Date, "now").mockReturnValue(123);
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    expect(createClientMoveId()).toMatch(/^move-123-/);
  });
});
