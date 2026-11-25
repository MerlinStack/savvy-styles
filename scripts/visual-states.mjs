/**
 * Targeted visual checks for states the route sweep cannot reach: the hero,
 * a populated bag and checkout, the newsletter block, and mobile viewports.
 *
 * Usage: node scripts/visual-states.mjs
 */
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const OUT = "qa-screens";

const browser = await chromium.launch();

async function settle(page, route) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => {
      const target =
        document.querySelector("[data-reveal]") ??
        document.querySelector("header");
      if (!target) return true;
      return Object.keys(target).some((key) => key.startsWith("__reactFiber$"));
    },
    undefined,
    { timeout: 30_000 },
  );
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

async function shot(page, name, options = {}) {
  await page.screenshot({ path: `${OUT}/${name}.png`, ...options });
}

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await desktop.newPage();

await settle(page, "/");
await shot(page, "state-hero");
const newsletter = page.locator("section.bg-ink").last();
await newsletter.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await newsletter.screenshot({ path: `${OUT}/state-newsletter.png` });

await settle(page, "/product/regent-court-low");
await page.getByRole("button", { name: "41", exact: true }).click();
await page.getByRole("button", { name: "Add to bag" }).click();
await page.waitForTimeout(800);
await shot(page, "state-drawer");
await page.getByRole("button", { name: "Close bag" }).last().click();
await page.waitForTimeout(500);

await settle(page, "/cart");
await page.waitForTimeout(600);
await shot(page, "state-cart", { fullPage: true });

await settle(page, "/checkout");
await page.waitForTimeout(800);
await shot(page, "state-checkout", { fullPage: true });

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 1,
});
const m = await mobile.newPage();

await settle(m, "/");
await shot(m, "state-mobile-hero");
await m.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
await m.waitForTimeout(700);
await shot(m, "state-mobile-featured");

await m.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await m.getByRole("button", { name: "Open menu" }).click();
await m.waitForTimeout(700);
await shot(m, "state-mobile-menu");

await settle(m, "/product/regent-court-low");
await shot(m, "state-mobile-product");
await m.evaluate(() => window.scrollTo({ top: 720, behavior: "instant" }));
await m.waitForTimeout(600);
await shot(m, "state-mobile-buy");

await settle(m, "/shop");
await shot(m, "state-mobile-shop");

await browser.close();
console.log("targeted screenshots written");
