import { chromium, devices } from "@playwright/test";

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["Pixel 7"] });
const page = await context.newPage();
page.on("console", (m) => console.log("console", m.type(), m.text()));
page.on("pageerror", (e) => console.log("pageerror", e.message));
page.on("framenavigated", (f) => console.log("navigated", f.url()));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Open menu" }).click();
const menu = page.getByRole("dialog", { name: "Site menu" });
await menu.waitFor({ state: "visible" });
console.log("menu open, url", page.url());

const link = menu.getByRole("link", { name: "New arrivals" });
console.log("link count", await link.count());
console.log("href", await link.getAttribute("href"));

await link.click();
await page.waitForTimeout(3000);
console.log("after click url", page.url());
console.log("menu visible", await menu.isVisible().catch(() => false));
console.log(
  "h1",
  await page.locator("h1").first().textContent().catch(() => null),
);

await browser.close();
