import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  use: {
    channel: "chrome",
    baseURL: "http://127.0.0.1:3100",
    viewport: { width: 390, height: 844 },
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
  ],
  workers: 2,
  webServer: [
    {
      command:
        "dotnet run --project ../backend --no-launch-profile --urls http://localhost:5051",
      env: {
        ASPNETCORE_ENVIRONMENT: "Development",
        ConnectionStrings__Database: "Data Source=Data/findmyid-tests.db",
      },
      url: "http://localhost:5051/api/health",
      reuseExistingServer: false,
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
      env: { API_BASE_URL: "http://localhost:5051" },
      url: "http://127.0.0.1:3100",
      reuseExistingServer: false,
    },
  ],
  reporter: "list",
});
