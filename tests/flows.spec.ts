import { test, expect } from "@playwright/test";

test("search finds a matching ID and opens its details", async ({ page }) => {
  await page.goto("/home");
  await page
    .getByRole("textbox", { name: "Name or index number" })
    .fill("22012345");
  await page.getByRole("button", { name: "Search for ID" }).click();
  await expect(
    page.getByRole("heading", { name: "3 possible matches" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Ama Mensah.*View Details/ }).click();
  await expect(page.getByRole("heading", { name: "Ama Mensah" })).toBeVisible();
  await expect(
    page.getByText("Balme Library, Legon", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Contact Finder" }).click();
  await expect(
    page.getByRole("heading", { name: "Arrange a safe handover" }),
  ).toBeVisible();
});

test("report can be reviewed, persisted and resolved", async ({ page }) => {
  await page.goto("/report");
  await page.getByLabel("NAME ON ID").fill("Test Student");
  await page.getByLabel("INDEX NUMBER", { exact: true }).fill("22998877");
  await page.getByLabel("LOCATION FOUND").fill("Campus security");
  await page
    .locator("input[type=file]")
    .last()
    .setInputFiles({
      name: "sample.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4V8AAAAASUVORK5CYII=",
        "base64",
      ),
    });
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Check the details" }),
  ).toBeVisible();
  await expect(page.getByText("22998877", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Submit Report" }).click();
  await expect(
    page.getByRole("heading", { name: "Report submitted" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View My Reports" }).click();
  await expect(page).toHaveURL(/\/reports$/);
  await page.reload();
  await expect(page.getByRole("heading", { name: "22998877" })).toBeVisible();
  await page.getByRole("button", { name: "View details" }).click();
  await page.getByRole("link", { name: "Contact Finder" }).click();
  await page.getByRole("button", { name: "Mark as Resolved" }).click();
  await page.getByRole("button", { name: "Solved", exact: true }).click();
  await expect(page.getByRole("heading", { name: "22998877" })).toBeVisible();
  await expect(page.getByText("Recovered", { exact: true })).toBeVisible();
});

test("preferences survive reload and narrow screens do not overflow", async ({
  page,
}) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: /Dark Mode/ }).click();
  await expect(page.getByRole("switch", { name: "Dark Mode" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await page.reload();
  await expect(page.getByRole("switch", { name: "Dark Mode" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  for (const route of [
    "/",
    "/home",
    "/profile",
    "/settings",
    "/search",
    "/report",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  }
});

test("mobile and desktop previews render without client errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("link", { name: "Create Account", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/welcome-mobile.png",
    fullPage: true,
  });
  await page.goto("/home");
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/welcome-desktop.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
