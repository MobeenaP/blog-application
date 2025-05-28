import "dotenv/config";

import { type BrowserContext, type Page } from "@playwright/test";
// TODO: Implement seed
export async function seedData(...options: any[]) {
  /* After assignment two, move the hard coded data to the seed */
}

type AppOptions = {};

export function createOptions(options: Partial<AppOptions>) {
  return JSON.stringify({});
}

export async function setOptions(
  context: BrowserContext,
  options: Partial<AppOptions>,
) {
  await context.addCookies([
    {
      name: "options",
      url: process.env.VERCEL_URL,
      value: createOptions(options),
    },
  ]);
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByTestId("username").fill("admin");
  await page.getByTestId("password").fill("123");
  await page.getByTestId("login-button").click();
  // Wait for navigation to complete
  await page.waitForURL("/");
}

export * from "@playwright/test";
