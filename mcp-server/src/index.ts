#!/usr/bin/env node
/**
 * Browser Automation MCP Server
 *
 * Exposes Playwright browser automation as MCP tools so that Copilot Chat
 * can navigate pages, inspect elements, and execute test scenarios on your behalf.
 *
 * Tools exposed:
 *  - navigate_to              Navigate browser to a URL
 *  - get_page_title           Get current page title and URL
 *  - get_page_html            Get current page HTML (truncated)
 *  - get_page_structure       Get a simplified DOM outline of the page
 *  - get_interactive_elements List all buttons, inputs, links on the page
 *  - inspect_element          Inspect a specific element's attributes and state
 *  - find_elements            Find all elements matching a CSS selector
 *  - click_element            Click an element (by selector, text, or role)
 *  - fill_input               Fill an input field (by selector, label, or placeholder)
 *  - select_option            Select a dropdown option
 *  - press_key                Press a keyboard key
 *  - check_text_on_page       Check whether text is present on the page
 *  - wait_for_element         Wait for an element to appear
 *  - take_screenshot          Save a screenshot to screenshots/
 *  - run_test_scenario        Execute a full test scenario (list of steps)
 *  - close_browser            Close the browser
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { chromium, Browser, Page, BrowserContext } from "playwright";
import * as path from "path";
import * as fs from "fs";

// ──────────────────────────────────────────────────────────────────────────────
// Browser state (persistent across tool calls within one server session)
// ──────────────────────────────────────────────────────────────────────────────

let browser: Browser | null = null;
let context: BrowserContext | null = null;
let currentPage: Page | null = null;

/** Returns an open page, launching the browser if needed. */
async function ensureBrowser(): Promise<Page> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      headless: false,
      slowMo: 30,
      args: ["--start-maximized"],
    });
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    });
    currentPage = await context.newPage();
  }

  if (!currentPage || currentPage.isClosed()) {
    currentPage = await context!.newPage();
  }

  return currentPage;
}

/** Resolve the screenshots directory relative to the workspace root. */
function screenshotsDir(): string {
  const dir = path.resolve(process.cwd(), "..", "screenshots");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// ──────────────────────────────────────────────────────────────────────────────
// MCP Server
// ──────────────────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "browser-automation",
  version: "1.0.0",
});

// ─── navigate_to ─────────────────────────────────────────────────────────────
server.tool(
  "navigate_to",
  "Navigate the browser to a URL",
  { url: z.string().describe("Full URL to navigate to (include https://)") },
  async ({ url }) => {
    try {
      const page = await ensureBrowser();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      const title = await page.title();
      return {
        content: [
          {
            type: "text",
            text: `✓ Navigated to: ${page.url()}\nPage title: "${title}"`,
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Navigation failed: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── get_page_title ───────────────────────────────────────────────────────────
server.tool(
  "get_page_title",
  "Get the title and URL of the current page",
  {},
  async () => {
    try {
      const page = await ensureBrowser();
      const title = await page.title();
      return {
        content: [{ type: "text", text: `Title: "${title}"\nURL: ${page.url()}` }],
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── get_page_html ────────────────────────────────────────────────────────────
server.tool(
  "get_page_html",
  "Get the HTML source of the current page (truncated to maxLength characters)",
  {
    maxLength: z
      .number()
      .optional()
      .default(8000)
      .describe("Max characters to return (default 8000)"),
  },
  async ({ maxLength }) => {
    try {
      const page = await ensureBrowser();
      const html = await page.content();
      const out =
        html.length > maxLength
          ? html.substring(0, maxLength) +
            `\n... [truncated — total ${html.length} chars]`
          : html;
      return { content: [{ type: "text", text: out }] };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── get_page_structure ───────────────────────────────────────────────────────
server.tool(
  "get_page_structure",
  "Get a simplified hierarchical outline of the page DOM — useful for discovering selectors",
  {},
  async () => {
    try {
      const page = await ensureBrowser();
      const structure: string = await page.evaluate(() => {
        const SKIP = new Set(["script", "style", "svg", "path", "meta", "link"]);
        function walk(el: Element, depth: number, maxDepth: number): string {
          if (depth > maxDepth) return "";
          const tag = el.tagName.toLowerCase();
          if (SKIP.has(tag)) return "";
          const id = el.id ? `#${el.id}` : "";
          const cls = el.className && typeof el.className === "string"
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : "";
          const preview = (el.textContent ?? "").trim().slice(0, 40);
          const textHint = preview ? ` → "${preview}"` : "";
          const line = "  ".repeat(depth) + `<${tag}${id}${cls}>${textHint}`;
          const children = Array.from(el.children)
            .slice(0, 12)
            .map((c) => walk(c, depth + 1, maxDepth))
            .filter(Boolean)
            .join("\n");
          return children ? `${line}\n${children}` : line;
        }
        return walk(document.body, 0, 6);
      });

      const out =
        structure.length > 6000
          ? structure.substring(0, 6000) + "\n... [truncated]"
          : structure;
      return { content: [{ type: "text", text: out }] };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── get_interactive_elements ─────────────────────────────────────────────────
server.tool(
  "get_interactive_elements",
  "List all interactive elements on the page: buttons, inputs, selects, textareas, and links",
  {},
  async () => {
    try {
      const page = await ensureBrowser();
      const elements = await page.evaluate(() => {
        const sel =
          'button, input, select, textarea, a[href], [role="button"], [role="link"]';
        return Array.from(document.querySelectorAll(sel))
          .slice(0, 60)
          .map((el) => {
            const a: Record<string, string> = {};
            for (const attr of el.attributes) a[attr.name] = attr.value;
            return {
              tag: el.tagName.toLowerCase(),
              text: (el.textContent ?? "").trim().slice(0, 60),
              type: a["type"],
              id: a["id"],
              name: a["name"],
              placeholder: a["placeholder"],
              href: a["href"],
              class: (a["class"] ?? "").split(" ").slice(0, 3).join(" "),
            };
          });
      });
      return {
        content: [
          {
            type: "text",
            text: `Found ${elements.length} interactive element(s):\n${JSON.stringify(elements, null, 2)}`,
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── inspect_element ─────────────────────────────────────────────────────────
server.tool(
  "inspect_element",
  "Inspect a specific element — returns tag, text, attributes, visibility, and bounding box",
  {
    selector: z
      .string()
      .describe('CSS selector, e.g. "#username", "button[type=submit]", ".error-msg"'),
  },
  async ({ selector }) => {
    try {
      const page = await ensureBrowser();
      const loc = page.locator(selector).first();
      if ((await loc.count()) === 0) {
        return {
          content: [
            { type: "text", text: `✗ No element found for selector: ${selector}` },
          ],
          isError: true,
        };
      }

      const [tag, text, visible, enabled, attrs, box] = await Promise.all([
        loc.evaluate((el) => el.tagName.toLowerCase()),
        loc.textContent(),
        loc.isVisible(),
        loc.isEnabled().catch(() => null),
        loc.evaluate((el) => {
          const a: Record<string, string> = {};
          for (const attr of el.attributes) a[attr.name] = attr.value;
          return a;
        }),
        loc.boundingBox(),
      ]);

      const info = { selector, tag, text: text?.trim(), visible, enabled, attributes: attrs, boundingBox: box };
      return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── find_elements ────────────────────────────────────────────────────────────
server.tool(
  "find_elements",
  "Find all elements matching a CSS selector (up to `limit`) and return their details",
  {
    selector: z.string().describe("CSS selector to search for"),
    limit: z
      .number()
      .optional()
      .default(15)
      .describe("Maximum number of elements to return (default 15)"),
  },
  async ({ selector, limit }) => {
    try {
      const page = await ensureBrowser();
      const locs = page.locator(selector);
      const count = await locs.count();
      if (count === 0) {
        return {
          content: [
            { type: "text", text: `No elements found for: ${selector}` },
          ],
        };
      }
      const cap = Math.min(count, limit);
      const results = [];
      for (let i = 0; i < cap; i++) {
        const el = locs.nth(i);
        const [tag, text, visible, attrs] = await Promise.all([
          el.evaluate((e) => e.tagName.toLowerCase()),
          el.textContent(),
          el.isVisible(),
          el.evaluate((e) => {
            const a: Record<string, string> = {};
            for (const attr of e.attributes) a[attr.name] = attr.value;
            return a;
          }),
        ]);
        results.push({ index: i, tag, text: text?.trim(), visible, attributes: attrs });
      }
      return {
        content: [
          {
            type: "text",
            text: `Found ${count} element(s), showing ${cap}:\n${JSON.stringify(results, null, 2)}`,
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── click_element ────────────────────────────────────────────────────────────
server.tool(
  "click_element",
  "Click an element. Supply one of: selector (CSS), text (visible text), or role+text.",
  {
    selector: z.string().optional().describe("CSS selector"),
    text: z
      .string()
      .optional()
      .describe("Visible text of the element to click"),
    role: z
      .string()
      .optional()
      .describe('ARIA role, e.g. "button", "link", "menuitem"'),
    nth: z
      .number()
      .optional()
      .default(0)
      .describe("0-based index when multiple elements match"),
  },
  async ({ selector, text, role, nth }) => {
    try {
      const page = await ensureBrowser();
      let loc;

      if (selector) {
        loc = page.locator(selector).nth(nth);
      } else if (role && text) {
        loc = page.getByRole(role as any, { name: text });
      } else if (text) {
        loc = page.getByText(text, { exact: false }).nth(nth);
      } else {
        return {
          content: [
            {
              type: "text",
              text: "✗ Provide at least one of: selector, text, or role+text",
            },
          ],
          isError: true,
        };
      }

      await loc.click({ timeout: 15_000 });
      await page.waitForTimeout(500);

      return {
        content: [
          {
            type: "text",
            text: `✓ Clicked element\nURL now: ${page.url()}\nTitle: "${await page.title()}"`,
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Click failed: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── fill_input ───────────────────────────────────────────────────────────────
server.tool(
  "fill_input",
  "Fill an input field with a value. Supply one of: selector, label text, or placeholder text.",
  {
    selector: z.string().optional().describe("CSS selector of the input"),
    label: z
      .string()
      .optional()
      .describe("Label text associated with the input"),
    placeholder: z
      .string()
      .optional()
      .describe("Placeholder text of the input"),
    value: z.string().describe("Value to type into the input"),
  },
  async ({ selector, label, placeholder, value }) => {
    try {
      const page = await ensureBrowser();
      let loc;

      if (selector) {
        loc = page.locator(selector).first();
      } else if (label) {
        loc = page.getByLabel(label, { exact: false });
      } else if (placeholder) {
        loc = page.getByPlaceholder(placeholder, { exact: false });
      } else {
        return {
          content: [
            {
              type: "text",
              text: "✗ Provide at least one of: selector, label, or placeholder",
            },
          ],
          isError: true,
        };
      }

      await loc.first().clear();
      await loc.first().fill(value);
      return { content: [{ type: "text", text: `✓ Filled input with: "${value}"` }] };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Fill failed: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── select_option ────────────────────────────────────────────────────────────
server.tool(
  "select_option",
  "Select an option from a <select> dropdown",
  {
    selector: z.string().describe("CSS selector of the <select> element"),
    value: z
      .string()
      .optional()
      .describe("The option value attribute to select"),
    label: z
      .string()
      .optional()
      .describe("The visible option text to select"),
  },
  async ({ selector, value, label }) => {
    try {
      const page = await ensureBrowser();
      const option: { value?: string; label?: string } = {};
      if (value) option.value = value;
      if (label) option.label = label;
      await page.selectOption(selector, option);
      return { content: [{ type: "text", text: `✓ Option selected in ${selector}` }] };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── press_key ────────────────────────────────────────────────────────────────
server.tool(
  "press_key",
  'Press a keyboard key, e.g. "Enter", "Tab", "Escape", "ArrowDown"',
  {
    key: z
      .string()
      .describe(
        'Key name following Playwright conventions: "Enter", "Tab", "Escape", "ArrowDown", etc.'
      ),
  },
  async ({ key }) => {
    try {
      const page = await ensureBrowser();
      await page.keyboard.press(key);
      return { content: [{ type: "text", text: `✓ Pressed key: ${key}` }] };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── check_text_on_page ───────────────────────────────────────────────────────
server.tool(
  "check_text_on_page",
  "Check whether specific text is visible on the current page (case-insensitive)",
  {
    text: z.string().describe("Text to search for"),
  },
  async ({ text }) => {
    try {
      const page = await ensureBrowser();
      const body = await page.evaluate(() => document.body.innerText);
      const found = body.toLowerCase().includes(text.toLowerCase());
      return {
        content: [
          {
            type: "text",
            text: found
              ? `✓ Text found: "${text}"`
              : `✗ Text NOT found: "${text}"`,
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── wait_for_element ─────────────────────────────────────────────────────────
server.tool(
  "wait_for_element",
  "Wait until an element appears in the DOM",
  {
    selector: z.string().describe("CSS selector to wait for"),
    timeout: z
      .number()
      .optional()
      .default(10_000)
      .describe("Timeout in milliseconds (default 10 000)"),
  },
  async ({ selector, timeout }) => {
    try {
      const page = await ensureBrowser();
      await page.waitForSelector(selector, { timeout });
      const text = await page.locator(selector).first().textContent();
      return {
        content: [
          {
            type: "text",
            text: `✓ Element appeared: ${selector}\nText: "${text?.trim()}"`,
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: "text",
            text: `✗ Element not found within ${timeout}ms: ${selector}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ─── take_screenshot ──────────────────────────────────────────────────────────
server.tool(
  "take_screenshot",
  "Take a screenshot of the current page and save it to the screenshots/ folder",
  {
    filename: z
      .string()
      .optional()
      .describe("Filename without extension (default: timestamp)"),
    fullPage: z
      .boolean()
      .optional()
      .default(false)
      .describe("Capture full scrollable page (default false = viewport only)"),
  },
  async ({ filename, fullPage }) => {
    try {
      const page = await ensureBrowser();
      const name = filename ?? `screenshot-${Date.now()}`;
      const screenshotPath = path.join(screenshotsDir(), `${name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage });
      return {
        content: [{ type: "text", text: `✓ Screenshot saved: ${screenshotPath}` }],
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Screenshot failed: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ─── run_test_scenario ────────────────────────────────────────────────────────
server.tool(
  "run_test_scenario",
  `Execute a complete test scenario as a sequence of steps.
Each step has an "action" field and optional fields depending on the action:
  navigate    → url
  click       → selector | text
  fill        → selector (required), value (required)
  fill_label  → label (required), value (required)
  check_text  → text (required)
  wait        → selector | timeout (ms)
  screenshot  → filename (optional)
  press_key   → key (required)
  select      → selector (required), value OR label`,
  {
    scenario: z
      .string()
      .describe("A human-readable name for this test scenario"),
    steps: z
      .array(
        z.object({
          action: z
            .string()
            .describe(
              "navigate | click | fill | fill_label | check_text | wait | screenshot | press_key | select"
            ),
          url: z.string().optional(),
          selector: z.string().optional(),
          text: z.string().optional(),
          label: z.string().optional(),
          value: z.string().optional(),
          key: z.string().optional(),
          filename: z.string().optional(),
          timeout: z.number().optional(),
        })
      )
      .describe("Ordered list of steps to execute"),
  },
  async ({ scenario, steps }) => {
    const log: string[] = [`▶ Running scenario: "${scenario}"`, ""];
    let page: Page;

    try {
      page = await ensureBrowser();
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Could not launch browser: ${err.message}` }],
        isError: true,
      };
    }

    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      const label = `  Step ${i + 1} [${s.action}]`;

      try {
        switch (s.action) {
          case "navigate":
            await page.goto(s.url!, { waitUntil: "domcontentloaded", timeout: 30_000 });
            log.push(`${label}: ✓  → ${s.url}`);
            break;

          case "click":
            if (s.selector) {
              await page.locator(s.selector).first().click({ timeout: 15_000 });
              log.push(`${label}: ✓  clicked selector "${s.selector}"`);
            } else if (s.text) {
              await page.getByText(s.text, { exact: false }).first().click({ timeout: 15_000 });
              log.push(`${label}: ✓  clicked text "${s.text}"`);
            } else {
              log.push(`${label}: ✗  no selector or text provided`);
            }
            break;

          case "fill":
            await page.locator(s.selector!).first().clear();
            await page.locator(s.selector!).first().fill(s.value!);
            log.push(`${label}: ✓  filled "${s.selector}" with "${s.value}"`);
            break;

          case "fill_label":
            await page.getByLabel(s.label!, { exact: false }).first().clear();
            await page.getByLabel(s.label!, { exact: false }).first().fill(s.value!);
            log.push(`${label}: ✓  filled label "${s.label}" with "${s.value}"`);
            break;

          case "check_text": {
            const body = await page.evaluate(() => document.body.innerText);
            const ok = body.toLowerCase().includes(s.text!.toLowerCase());
            log.push(
              ok
                ? `${label}: ✓  text found: "${s.text}"`
                : `${label}: ✗  text NOT found: "${s.text}"  ← ASSERTION FAILED`
            );
            break;
          }

          case "wait":
            if (s.selector) {
              await page.waitForSelector(s.selector, { timeout: s.timeout ?? 10_000 });
              log.push(`${label}: ✓  element visible: "${s.selector}"`);
            } else {
              await page.waitForTimeout(s.timeout ?? 1_000);
              log.push(`${label}: ✓  waited ${s.timeout ?? 1_000}ms`);
            }
            break;

          case "screenshot": {
            const name = s.filename ?? `${scenario.replace(/\s+/g, "-")}-step${i + 1}-${Date.now()}`;
            const p = path.join(screenshotsDir(), `${name}.png`);
            await page.screenshot({ path: p });
            log.push(`${label}: ✓  screenshot → ${p}`);
            break;
          }

          case "press_key":
            await page.keyboard.press(s.key!);
            log.push(`${label}: ✓  pressed "${s.key}"`);
            break;

          case "select": {
            const opt: { value?: string; label?: string } = {};
            if (s.value) opt.value = s.value;
            if (s.label) opt.label = s.label;
            await page.selectOption(s.selector!, opt);
            log.push(`${label}: ✓  selected option in "${s.selector}"`);
            break;
          }

          default:
            log.push(`${label}: ⚠  unknown action "${s.action}", skipped`);
        }

        await page.waitForTimeout(300); // brief pause between steps
      } catch (stepErr: any) {
        log.push(`${label}: ✗  FAILED — ${stepErr.message}`);
        log.push(`\n⛔ Scenario stopped at step ${i + 1}`);
        return { content: [{ type: "text", text: log.join("\n") }] };
      }
    }

    log.push(`\n✅ Scenario complete — ${steps.length} step(s) executed`);
    return { content: [{ type: "text", text: log.join("\n") }] };
  }
);

// ─── close_browser ────────────────────────────────────────────────────────────
server.tool(
  "close_browser",
  "Close the Playwright browser and release all resources",
  {},
  async () => {
    try {
      if (browser) {
        await browser.close();
        browser = null;
        context = null;
        currentPage = null;
      }
      return { content: [{ type: "text", text: "✓ Browser closed" }] };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `✗ Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// Start the server over stdio
// ──────────────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
