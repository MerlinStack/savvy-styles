import { expect, test, type Page } from "@playwright/test";

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

async function assertNoBrokenImages(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  const broken = await page.$$eval("img", (images) =>
    images
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  );
  expect(broken).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
}

test.describe("storefront — desktop", () => {
  test("homepage renders the hero, imagery and no console errors", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /home to the classy/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Shop the collection" }).first(),
    ).toBeVisible();

    await assertNoHorizontalOverflow(page);
    await assertNoBrokenImages(page);
    expect(errors).toEqual([]);
  });

  test("shop filters by URL and clears back to the full collection", async ({
    page,
  }) => {
    await page.goto("/shop");
    await expect(
      page.getByRole("heading", { level: 1, name: /footwear, considered/i }),
    ).toBeVisible();

    const allCards = page.locator('a[href^="/product/"]');
    const allCount = await allCards.count();
    expect(allCount).toBeGreaterThan(0);

    await page.goto("/shop?category=formal");
    await expect(page).toHaveURL(/category=formal/);
    const formalCount = await page.locator('a[href^="/product/"]').count();
    expect(formalCount).toBeGreaterThan(0);
    expect(formalCount).toBeLessThan(allCount);

    await page.getByRole("link", { name: "Clear all" }).click();
    await expect(page).toHaveURL(/\/shop$/);
    expect(await page.locator('a[href^="/product/"]').count()).toBe(allCount);
  });

  test("adds a ready-stock pair to the bag and persists it", async ({
    page,
  }) => {
    await page.goto("/product/regent-court-low");
    await expect(
      page.getByRole("heading", { level: 1, name: "Regent Court Low" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "41", exact: true }).click();
    await page.getByRole("button", { name: "Add to bag" }).click();

    const drawer = page.getByRole("dialog", { name: "Shopping bag" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Regent Court Low")).toBeVisible();
    await expect(drawer.getByText("1 item")).toBeVisible();

    await page.getByRole("button", { name: "Close bag" }).last().click();
    await expect(drawer).toBeHidden();

    await page.reload();
    await page.getByRole("button", { name: /open bag/i }).click();
    await expect(page.getByRole("dialog", { name: "Shopping bag" })).toContainText(
      "Regent Court Low",
    );
  });

  test("search dialog finds a product and resets between visits", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Search the collection" }).click();
    const dialog = page.getByRole("dialog", { name: "Search the collection" });
    await expect(dialog).toBeVisible();

    await page.getByRole("searchbox", { name: "Search products" }).fill("aeon");
    await expect(
      dialog.getByRole("link", { name: /Aeon Runner/ }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.getByRole("button", { name: "Search the collection" }).click();
    await expect(
      page.getByRole("searchbox", { name: "Search products" }),
    ).toHaveValue("");
  });

  test("policy pages are clearly labelled drafts", async ({ page }) => {
    await page.goto("/policies/delivery");
    await expect(
      page.getByRole("heading", { level: 1, name: "Delivery & returns" }),
    ).toBeVisible();
    await expect(page.getByText("Draft.").first()).toBeVisible();
    await expect(
      page.getByText(/nothing here constitutes a final policy/i),
    ).toBeVisible();
  });

  test("unknown product renders the branded, noindexed 404", async ({
    page,
  }) => {
    // Cache Components commits the prerendered shell as 200 before notFound()
    // runs; Next marks the streamed response noindex instead of changing status.
    const response = await page.goto("/product/not-a-real-piece");
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: /a quiet corner/i }),
    ).toBeVisible();
    await expect(
      page.locator('meta[name="robots"]').first(),
    ).toHaveAttribute("content", "noindex");
    await expect(
      page.locator('meta[name="next-error"]').first(),
    ).toHaveAttribute("content", "not-found");
  });
});

test.describe("storefront — mobile", () => {
  test("homepage has no horizontal overflow and no broken images", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /home to the classy/i }),
    ).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await assertNoBrokenImages(page);
  });

  test("menu opens, navigates and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();

    const menu = page.getByRole("dialog", { name: "Site menu" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "New arrivals" }).click();

    await expect(page).toHaveURL(/\/new-arrivals$/);
    await expect(menu).toBeHidden();
    await expect(
      page.getByRole("heading", { level: 1, name: /new arrivals/i }),
    ).toBeVisible();
  });

  test("product purchase controls remain usable at 390px", async ({ page }) => {
    await page.goto("/product/regent-court-low");
    await page.getByRole("button", { name: "42", exact: true }).click();
    await page.getByRole("button", { name: "Add to bag" }).click();
    await expect(
      page.getByRole("dialog", { name: "Shopping bag" }),
    ).toContainText("Regent Court Low");
    await assertNoHorizontalOverflow(page);
  });
});
