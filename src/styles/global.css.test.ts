import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, beforeAll } from "vitest";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract the raw text of a CSS rule block given a selector string. */
function extractBlock(css: string, selector: string): string | null {
  // Escape special chars in selector for use in RegExp
  const escaped = selector.replace(/[[\]"=]/g, "\\$&");
  const re = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "s");
  const match = css.match(re);
  return match ? match[1] : null;
}

/**
 * Parse CSS custom property declarations from a block of CSS text.
 * Returns a map of { '--var-name': 'value' }.
 */
function parseCssVars(block: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

let cssContent: string;
let darkVars: Record<string, string>;

beforeAll(() => {
  const cssPath = resolve(__dirname, "global.css");
  cssContent = readFileSync(cssPath, "utf-8");

  const darkBlock = extractBlock(cssContent, 'html[data-theme="dark"]');
  expect(darkBlock, "html[data-theme=\"dark\"] block must exist in global.css").not.toBeNull();
  darkVars = parseCssVars(darkBlock!);
});

// ---------------------------------------------------------------------------
// Dark theme — Core palette (changed in this PR)
// ---------------------------------------------------------------------------

describe('html[data-theme="dark"] — core palette', () => {
  it("sets --background to the balanced dark base #0a0a0b", () => {
    expect(darkVars["--background"]).toBe("#0a0a0b");
  });

  it("sets --foreground to zinc-200 #e4e4e7", () => {
    expect(darkVars["--foreground"]).toBe("#e4e4e7");
  });

  it("sets --accent to blue-500 #3b82f6", () => {
    expect(darkVars["--accent"]).toBe("#3b82f6");
  });

  it("sets --muted to zinc-900 #18181b", () => {
    expect(darkVars["--muted"]).toBe("#18181b");
  });

  it("sets --border to zinc-800 #27272a", () => {
    expect(darkVars["--border"]).toBe("#27272a");
  });
});

// ---------------------------------------------------------------------------
// Dark theme — Extended palette (changed in this PR: solid hex, Zinc scale)
// ---------------------------------------------------------------------------

describe('html[data-theme="dark"] — extended palette (Zinc scale)', () => {
  it("sets --card to solid #18181b (was rgba)", () => {
    expect(darkVars["--card"]).toBe("#18181b");
  });

  it("sets --panel to solid #121215 (was rgba)", () => {
    expect(darkVars["--panel"]).toBe("#121215");
  });

  it("sets --border-strong to solid #3f3f46 (was rgba accent tint)", () => {
    expect(darkVars["--border-strong"]).toBe("#3f3f46");
  });

  it("sets --accent-dim to blue-700 #1d4ed8 (was warm gold)", () => {
    expect(darkVars["--accent-dim"]).toBe("#1d4ed8");
  });

  it("sets --heading to near-white #fafafa (was warm cream)", () => {
    expect(darkVars["--heading"]).toBe("#fafafa");
  });

  it("sets --text-muted to zinc-400 #a1a1aa (was warm taupe)", () => {
    expect(darkVars["--text-muted"]).toBe("#a1a1aa");
  });
});

// ---------------------------------------------------------------------------
// Dark theme — Semantic colors (NEW in this PR)
// ---------------------------------------------------------------------------

describe('html[data-theme="dark"] — semantic colors (new variables)', () => {
  it("defines --primary as blue-500 #3b82f6", () => {
    expect(darkVars["--primary"]).toBe("#3b82f6");
  });

  it("defines --success as green-500 #22c55e", () => {
    expect(darkVars["--success"]).toBe("#22c55e");
  });

  it("defines --warning as amber-500 #f59e0b", () => {
    expect(darkVars["--warning"]).toBe("#f59e0b");
  });

  it("defines --error as red-500 #ef4444", () => {
    expect(darkVars["--error"]).toBe("#ef4444");
  });
});

// ---------------------------------------------------------------------------
// Dark theme — Shadow variables (NEW in this PR)
// ---------------------------------------------------------------------------

describe('html[data-theme="dark"] — shadow variables (new variables)', () => {
  it("defines --shadow-sm as a subtle shadow with 0.4 opacity", () => {
    expect(darkVars["--shadow-sm"]).toBe("0 1px 2px rgba(0,0,0,0.4)");
  });

  it("defines --shadow-md as a medium shadow with 0.5 opacity", () => {
    expect(darkVars["--shadow-md"]).toBe("0 4px 6px rgba(0,0,0,0.5)");
  });

  it("defines --shadow-lg as a large shadow with 0.6 opacity", () => {
    expect(darkVars["--shadow-lg"]).toBe("0 10px 15px rgba(0,0,0,0.6)");
  });

  it("shadow opacities increase from sm to lg (sm < md < lg)", () => {
    // Extract numeric opacity from each shadow value
    const opacityOf = (v: string) =>
      parseFloat(v.match(/rgba\(0,0,0,([\d.]+)\)/)?.[1] ?? "0");
    expect(opacityOf(darkVars["--shadow-sm"])).toBeLessThan(
      opacityOf(darkVars["--shadow-md"]),
    );
    expect(opacityOf(darkVars["--shadow-md"])).toBeLessThan(
      opacityOf(darkVars["--shadow-lg"]),
    );
  });
});

// ---------------------------------------------------------------------------
// Regression: old values must NOT appear in the dark block
// ---------------------------------------------------------------------------

describe('html[data-theme="dark"] — regression: old values removed', () => {
  it("no longer uses warm gold #cfa55b for --accent", () => {
    expect(darkVars["--accent"]).not.toBe("#cfa55b");
  });

  it("no longer uses near-black #040404 for --background", () => {
    expect(darkVars["--background"]).not.toBe("#040404");
  });

  it("no longer uses warm cream #ebe5db for --foreground", () => {
    expect(darkVars["--foreground"]).not.toBe("#ebe5db");
  });

  it("no longer uses rgba() for --card (solid hex replaces transparency)", () => {
    expect(darkVars["--card"]).not.toMatch(/^rgba/);
  });

  it("no longer uses rgba() for --panel (solid hex replaces transparency)", () => {
    expect(darkVars["--panel"]).not.toMatch(/^rgba/);
  });

  it("no longer uses warm gold rgba tint for --border-strong", () => {
    expect(darkVars["--border-strong"]).not.toMatch(/^rgba/);
  });

  it("no longer uses warm muted #8c6c3b for --accent-dim", () => {
    expect(darkVars["--accent-dim"]).not.toBe("#8c6c3b");
  });

  it("no longer uses warm cream #faf5ec for --heading", () => {
    expect(darkVars["--heading"]).not.toBe("#faf5ec");
  });

  it("no longer uses warm taupe #9d907b for --text-muted", () => {
    expect(darkVars["--text-muted"]).not.toBe("#9d907b");
  });
});

// ---------------------------------------------------------------------------
// Structural / completeness checks
// ---------------------------------------------------------------------------

describe('html[data-theme="dark"] — completeness', () => {
  const requiredVars = [
    "--background",
    "--foreground",
    "--accent",
    "--muted",
    "--border",
    "--card",
    "--panel",
    "--border-strong",
    "--accent-dim",
    "--heading",
    "--text-muted",
    "--primary",
    "--success",
    "--warning",
    "--error",
    "--shadow-sm",
    "--shadow-md",
    "--shadow-lg",
  ];

  it.each(requiredVars)("defines %s", varName => {
    expect(darkVars[varName]).toBeDefined();
    expect(darkVars[varName]).not.toBe("");
  });

  it("all hex color values are valid 6-digit hex codes", () => {
    const hexVars = [
      "--background",
      "--foreground",
      "--accent",
      "--muted",
      "--border",
      "--card",
      "--panel",
      "--border-strong",
      "--accent-dim",
      "--heading",
      "--text-muted",
      "--primary",
      "--success",
      "--warning",
      "--error",
    ];
    for (const v of hexVars) {
      expect(darkVars[v], `${v} should be a valid hex color`).toMatch(
        /^#[0-9a-fA-F]{6}$/,
      );
    }
  });

  it("--primary and --accent share the same blue-500 value", () => {
    // Both should resolve to the same colour to ensure consistency
    expect(darkVars["--primary"]).toBe(darkVars["--accent"]);
  });
});

// ---------------------------------------------------------------------------
// Light theme isolation — unchanged values must not be affected
// ---------------------------------------------------------------------------

describe("light theme (:root / html[data-theme=\"light\"]) — unchanged by this PR", () => {
  let lightVars: Record<string, string>;

  beforeAll(() => {
    // Prefer the combined :root + html[data-theme="light"] block
    const rootBlock = extractBlock(cssContent, ":root");
    const lightBlock = extractBlock(cssContent, 'html[data-theme="light"]');
    const combined = [rootBlock ?? "", lightBlock ?? ""].join("\n");
    lightVars = parseCssVars(combined);
  });

  it("light --background is still #faf8f4", () => {
    expect(lightVars["--background"]).toBe("#faf8f4");
  });

  it("light --accent is still #0b6aa8 (not the dark blue-500)", () => {
    expect(lightVars["--accent"]).toBe("#0b6aa8");
  });

  it("light theme does NOT define --primary (semantic colors are dark-only)", () => {
    expect(lightVars["--primary"]).toBeUndefined();
  });

  it("light theme does NOT define shadow variables (shadows are dark-only)", () => {
    expect(lightVars["--shadow-sm"]).toBeUndefined();
    expect(lightVars["--shadow-md"]).toBeUndefined();
    expect(lightVars["--shadow-lg"]).toBeUndefined();
  });
});