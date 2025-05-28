import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("PAGINATION AND INFINITE SCROLL", () => {
  test(
    "Load more posts on scroll",
    {
      tag: "@pagination",
    },
    async ({ page }) => {
      await page.goto("/");

      // Get initial post count
      const initialPosts = await page.getByTestId("blog-post").count();

      // Scroll to bottom to trigger loading more posts
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Wait for new posts to load
      await page.waitForTimeout(2000);

      // Verify more posts were loaded
      const newPostCount = await page.getByTestId("blog-post").count();
      expect(newPostCount).toBeGreaterThan(initialPosts);
    }
  );

  test(
    "Loading indicator appears while fetching more posts",
    {
      tag: "@pagination",
    },
    async ({ page }) => {
      await page.goto("/");

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Verify loading indicator appears
      const loader = await page.getByTestId("posts-loading");
      await expect(loader).toBeVisible({ timeout: 10000 });

      // Wait for new posts and verify loader disappears
      await page.waitForTimeout(2000);
      await expect(loader).not.toBeVisible();
    }
  );

  test(
    "End of posts indicator",
    {
      tag: "@pagination",
    },
    async ({ page }) => {
      await page.goto("/");

      // Scroll multiple times to load all posts
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);
      }

      // Verify end of posts message appears
      const endMessage = await page.getByTestId("no-more-posts");
      await expect(endMessage).toBeVisible({ timeout: 10000 });
      await expect(endMessage).toHaveText("No more posts to load");
    }
  );

  test(
    "Posts retain their position after navigating back",
    {
      tag: "@pagination",
    },
    async ({ page }) => {
      await page.goto("/");

      // Scroll down to load more posts
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);

      // Click on a post
      const postTitle = await page.getByTestId("blog-post").nth(12).getByRole("heading").textContent();
      await page.getByTestId("blog-post").nth(12).click();

      // Navigate back
      await page.goBack();

      // Verify scroll position is maintained
      const scrollPosition = await page.evaluate(() => window.scrollY);
      expect(scrollPosition).toBeGreaterThan(0);

      // Verify the same posts are visible
      const visiblePostTitle = await page.getByTestId("blog-post").nth(12).getByRole("heading").textContent();
      expect(visiblePostTitle).toBe(postTitle);
    }
  );
}); 