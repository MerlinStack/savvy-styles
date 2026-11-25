/**
 * Local visual QA harness.
 *
 * Captures desktop and mobile screenshots, then reports console errors, broken
 * images, horizontal overflow and heading structure for each route.
 *
 * Usage: node scripts/visual-qa.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const OUT = path.join(process.cwd(), "qa-screens");

const DESKTOP_ROUTES = [
  ["home", "/"],
  ["shop", "/shop"],
  ["shop-filtered", "/shop?category=formal&sort=price-asc"],
  ["product", "/product/regent-court-low"],
  ["product-preorder", "/product/aeon-runner"],
  ["collections", "/collections"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["cart", "/cart"],
  ["checkout", "/checkout"],
  ["policy", "/policies/pre-orders"],
  ["not-found", "/definitely-not-a-page"],
];

const MOBILE_ROUTES = [
  ["home", "/"],
  ["shop", "/shop"],
  ["product", "/product/regent-court-low"],
  ["collections", "/collections"],
];

async function diagnose(page) {
  // Entrance reveals are client-side; wait until React has hydrated before
  // judging visibility, otherwise a slow first compile reads as a visual bug.
  await page.waitForFunction(
    () => {
      const target =
        document.querySelector("[data-reveal]") ??
        document.querySelector("header");
      // The root 404 is a self-contained page with no animated shell.
      if (!target) return true;
      return Object.keys(target).some((key) => key.startsWith("__reactFiber$"));
    },
    undefined,
    { timeout: 30_000 },
  );

  await page.evaluate(async () => {
    // The site uses smooth scrolling; instant jumps are required so every
    // scroll-triggered reveal actually enters the viewport during capture.
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const step = Math.max(320, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    root.style.scrollBehavior = previous;
  });
  await page.waitForTimeout(900);

  return page.evaluate(() => {
    const images = Array.from(document.images);
    return {
      title: document.title,
      h1: Array.from(document.querySelectorAll("h1")).map((node) =>
        (node.textContent ?? "").replace(/\s+/g, " ").trim(),
      ),
      h1Count: document.querySelectorAll("h1").length,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      imageCount: images.length,
      brokenImages: images
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
      imagesWithoutAlt: images
        .filter((image) => !image.hasAttribute("alt"))
        .map((image) => image.currentSrc || image.src),
      documentHeight: document.documentElement.scrollHeight,
    };
  });
}

async function capture(page, name, { fullPage = true } = {}) {
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage,
    animations: "disabled",
  });
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const report = { desktop: [], mobile: [], menu: null };

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });

  for (const [name, route] of DESKTOP_ROUTES) {
    const page = await desktop.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(`${BASE}${route}`, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);

    const diagnostics = await diagnose(page);
    await capture(page, `desktop-${name}`);
    report.desktop.push({
      route,
      status: response?.status() ?? null,
      errors,
      ...diagnostics,
    });

    await page.close();
  }

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });

  for (const [name, route] of MOBILE_ROUTES) {
    const page = await mobile.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(`${BASE}${route}`, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);

    const diagnostics = await diagnose(page);
    await capture(page, `mobile-${name}`);
    report.mobile.push({
      route,
      status: response?.status() ?? null,
      errors,
      ...diagnostics,
    });

    if (name === "home") {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.waitForTimeout(600);
      await capture(page, "mobile-menu", { fullPage: false });
      report.menu = {
        visible: await page
          .getByRole("dialog", { name: "Site menu" })
          .isVisible(),
      };
      await page.keyboard.press("Escape");
    }

    await page.close();
  }

  await browser.close();
  await writeFile(
    path.join(OUT, "report.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  for (const entry of [...report.desktop, ...report.mobile]) {
    const flags = [
      entry.overflow > 1 ? `OVERFLOW ${entry.overflow}px` : null,
      entry.brokenImages.length ? `BROKEN IMG ${entry.brokenImages.length}` : null,
      entry.errors.length ? `CONSOLE ${entry.errors.length}` : null,
      entry.h1Count !== 1 ? `H1 x${entry.h1Count}` : null,
    ].filter(Boolean);
    console.log(
      `${entry.route} → ${entry.status} · ${entry.title} · ${flags.length ? flags.join(" · ") : "clean"}`,
    );
  }
  console.log(`Screenshots: ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  // Exit hard: an open Playwright browser would otherwise keep Node alive.
  process.exit(1);
});
