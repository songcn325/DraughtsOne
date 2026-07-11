import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText } from "./clipboard";

describe("copyText", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses the Clipboard API when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    await expect(copyText("moves")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("moves");
  });

  it("falls back to selecting text on HTTP origins", async () => {
    const textarea = {
      value: "",
      style: {},
      setAttribute: vi.fn(),
      select: vi.fn(),
      remove: vi.fn()
    };
    const appendChild = vi.fn();
    const execCommand = vi.fn(() => true);
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("document", {
      createElement: () => textarea,
      body: { appendChild },
      execCommand
    });

    await expect(copyText("1. 34-29")).resolves.toBe(true);
    expect(textarea.value).toBe("1. 34-29");
    expect(textarea.select).toHaveBeenCalled();
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(textarea.remove).toHaveBeenCalled();
  });
});
