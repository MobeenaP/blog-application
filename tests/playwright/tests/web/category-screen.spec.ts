import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("CATEGORY SCREEN", () => {
  test.beforeAll(async () => {
    await seed();
  });

 test(
    "Existing Category",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/react");
      const articles = await page.locator('[data-test-id^="blog-post-"]');
      
      const actualCount = await articles.count();
      await expect(articles).toHaveCount(actualCount);

      if (actualCount > 0) {

        const firstPost = articles.first();
        await expect(firstPost).toBeVisible();
  
      } else {
   
        await expect(page.getByText("0 Posts")).toBeVisible();
      }
    },
  );

  test(
    "Invalid Category",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/abc");

      // CATEGORY SCREEN > Displays "0 Posts" when search does not find anything

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(0);

      await expect(page.getByText("0 Posts")).toBeVisible();
    },
  );
});
