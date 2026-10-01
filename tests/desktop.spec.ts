import { test, expect } from "@playwright/test";

test("desktop navigation and layouts use the available screen width", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop layout check");
  await page.goto("/home");
  const sidebar = page.getByRole("navigation", { name: "Desktop navigation" });
  await expect(sidebar).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeHidden();
  const content = await page.locator("main").boundingBox();
  expect(content!.width).toBeGreaterThan(800);
  await sidebar
    .getByRole("link", { name: "Report Found ID", exact: true })
    .click();
  await expect(page).toHaveURL(/\/report$/);
  await expect(
    sidebar.getByRole("link", { name: "Report Found ID", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("heading", { name: "Help return this ID" }),
  ).toBeVisible();
  for (const width of [900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/login",
      "/create-account",
      "/home",
      "/search",
      "/report",
      "/review",
      "/success",
      "/details",
      "/contact",
      "/reports",
      "/notifications",
      "/profile",
      "/settings",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${route} overflow at ${width}px`,
      ).toBeTruthy();
      const main = await page.locator("main").boundingBox();
      expect(main!.x).toBeGreaterThanOrEqual(0);
      expect(main!.x + main!.width).toBeLessThanOrEqual(width + 1);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of ["home", "search", "report", "profile", "settings"]) {
    await page.goto("/" + route);
    await page.screenshot({
      path: `test-results/desktop-${route}.png`,
      fullPage: true,
    });
  }
});
