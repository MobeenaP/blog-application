import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("COMMENT SYSTEM", () => {
  test(
    "Add a comment to a blog post",
    {
      tag: "@comments",
    },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      // Fill in comment form
      await page.getByTestId("comment-input").fill("This is a test comment");
      await page.getByTestId("author-name-input").fill("Test User");
      await page.getByTestId("submit-comment").click();

      // Verify comment appears
      const comment = await page.getByTestId("comment-1");
      await expect(comment).toBeVisible();
      await expect(comment.getByText("This is a test comment")).toBeVisible();
      await expect(comment.getByText("Test User")).toBeVisible();
    }
  );

  test(
    "Add a nested reply to a comment",
    {
      tag: "@comments",
    },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      // Click reply on an existing comment
      await page.getByTestId("comment-1").getByTestId("reply-button").click();

      // Fill in reply form
      await page.getByTestId("reply-input").fill("This is a test reply");
      await page.getByTestId("reply-author-input").fill("Reply User");
      await page.getByTestId("submit-reply").click();

      // Verify reply appears nested under the comment
      const reply = await page.getByTestId("comment-1").getByTestId("reply-1");
      await expect(reply).toBeVisible();
      await expect(reply.getByText("This is a test reply")).toBeVisible();
      await expect(reply.getByText("Reply User")).toBeVisible();
    }
  );

  test(
    "Comments persist after page reload",
    {
      tag: "@comments",
    },
    async ({ page }) => {
      // Add a comment
      await page.goto("/post/boost-your-conversion-rate");
      await page.getByTestId("comment-input").fill("Persistence test comment");
      await page.getByTestId("author-name-input").fill("Persistence User");
      await page.getByTestId("submit-comment").click();

      // Reload page and verify comment still exists
      await page.reload();
      const comment = await page.getByTestId("comment-1");
      await expect(comment).toBeVisible();
      await expect(comment.getByText("Persistence test comment")).toBeVisible();
      await expect(comment.getByText("Persistence User")).toBeVisible();
    }
  );
}); 