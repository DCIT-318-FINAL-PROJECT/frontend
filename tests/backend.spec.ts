import { test, expect, type APIRequestContext } from "@playwright/test";
const headers = { "X-FindMyID": "1" };
const photo =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4V8AAAAASUVORK5CYII=";
async function register(request: APIRequestContext, name: string) {
  const credentials = {
    name,
    email: `${crypto.randomUUID()}@st.ug.edu.gh`,
    index: "22998877",
    password: "TestPassword123!",
  };
  const response = await request.post("/api/auth/register", {
    headers,
    data: credentials,
  });
  expect(response.status()).toBe(200);
  return credentials;
}
test("accounts enforce report ownership, private photos, and deliver messages", async ({
  playwright,
  baseURL,
}) => {
  const finder = await playwright.request.newContext({ baseURL });
  const student = await playwright.request.newContext({ baseURL });
  const guest = await playwright.request.newContext({ baseURL });
  try {
    const credentials = await register(finder, "Finder Student");
    await register(student, "ID Owner");
    const response = await finder.post("/api/reports", {
      headers,
      data: {
        name: "Privacy Student",
        index: "22998877",
        location: "Security office",
        photo,
      },
    });
    expect(response.status()).toBe(201);
    const report = await response.json();
    expect(report.own).toBe(true);
    expect((await finder.get(report.photo)).status()).toBe(200);
    expect((await student.get(report.photo)).status()).toBe(403);
    expect((await guest.get(report.photo)).status()).toBe(401);
    expect(
      (
        await student.patch(`/api/reports/${report.id}/resolve`, {
          headers,
          data: {},
        })
      ).status(),
    ).toBe(403);
    expect(
      (
        await guest.post("/api/reports", {
          headers,
          data: { name: "Unauthorized" },
        })
      ).status(),
    ).toBe(401);
    const publicResults = await (
      await guest.get("/api/reports?q=Privacy%20Student")
    ).json();
    const publicResult = publicResults.find(
      (r: { id: string }) => r.id === report.id,
    );
    expect(publicResult.index).toBe("****8877");
    expect(publicResult.photo).toBeNull();
    expect(publicResult.email).toBeUndefined();
    expect(
      (
        await student.post(`/api/reports/${report.id}/messages`, {
          headers,
          data: { body: "Meet at security at 10 am?" },
        })
      ).status(),
    ).toBe(204);
    const messages = await (await finder.get("/api/messages")).json();
    expect(
      messages.some(
        (m: { body: string; incoming: boolean }) =>
          m.body === "Meet at security at 10 am?" && m.incoming,
      ),
    ).toBe(true);
    expect(
      (
        await finder.put("/api/preferences", {
          headers,
          data: { alerts: false, email: true, dark: true },
        })
      ).status(),
    ).toBe(200);
    expect(
      (
        await finder.patch(`/api/reports/${report.id}/resolve`, {
          headers,
          data: {},
        })
      ).status(),
    ).toBe(200);
    await finder.post("/api/auth/logout", { headers, data: {} });
    expect((await finder.get("/api/messages")).status()).toBe(401);
    expect(
      (
        await finder.post("/api/auth/login", {
          headers,
          data: { email: credentials.email, password: "wrong-password" },
        })
      ).status(),
    ).toBe(401);
    expect(
      (
        await finder.post("/api/auth/login", { headers, data: credentials })
      ).status(),
    ).toBe(200);
    const saved = await (await finder.get("/api/bootstrap")).json();
    expect(saved.prefs.dark).toBe(true);
    expect(
      saved.records.find((r: { id: string }) => r.id === report.id).status,
    ).toBe("Solved");
    expect((await finder.post("/api/auth/logout", { data: {} })).status()).toBe(
      400,
    );
  } finally {
    await finder.dispose();
    await student.dispose();
    await guest.dispose();
  }
});
test("signup and login use the server rather than a demo session", async ({
  page,
}) => {
  const email = `${crypto.randomUUID()}@ug.edu.gh`;
  await page.goto("/create-account");
  await page.getByLabel("Full Name").fill("Browser Student");
  await page.getByLabel("University Email").fill(email);
  await page.getByLabel("Index Number").fill("22114455");
  await page
    .getByLabel("Password", { exact: true })
    .fill("BrowserPassword123!");
  await page.getByLabel("Confirm Password").fill("BrowserPassword123!");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Create Account", exact: true })
    .click();
  await expect(page).toHaveURL(/\/home$/);
  await page.goto("/settings");
  await page.getByRole("button", { name: /Profile Visibility/ }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Full Name")
    .fill("Updated Student");
  await page.getByRole("button", { name: "Save Profile" }).click();
  await page.reload();
  await expect(
    page
      .locator(".desktop-header-account, .sidebar-account")
      .getByText("Updated Student")
      .first(),
  ).toBeAttached();
  await page
    .getByRole("button", {
      name: "Log Out Sign out of your account",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/login");
  await page.getByLabel("University Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("WrongPassword123!");
  await page.getByRole("button", { name: "Log In", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveText(
    "Invalid email or password.",
  );
  await page
    .getByLabel("Password", { exact: true })
    .fill("BrowserPassword123!");
  await page.getByRole("button", { name: "Log In", exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
});
test("data loader and backend errors are visible and retryable", async ({
  page,
}) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/bootstrap", async (route) => {
    await pending;
    await route.fulfill({
      status: 503,
      json: { message: "Backend unavailable" },
    });
  });
  await page.goto("/home");
  await expect(page.getByRole("status")).toContainText("Loading FindMyID");
  release();
  await expect(page.locator("main").getByRole("alert")).toHaveText(
    "Backend unavailable",
  );
  await page.unroute("**/api/bootstrap");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(
    page.getByRole("textbox", { name: "Name or index number" }),
  ).toBeVisible();
});
