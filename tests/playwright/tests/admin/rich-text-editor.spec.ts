import { seed } from "@repo/db/seed";
import { expect, test, loginAsAdmin } from "../web/fixtures";

test.describe("RICH TEXT EDITOR", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test(
    "Create post with rich text formatting",
    {
      tag: "@rich-text",
    },
    async ({ page }) => {
      // Navigate to create post page
      await page.goto("/posts/create");

      // Fill in basic post details
      await page.getByTestId("title").fill("Test Rich Text Post");
      await page.getByTestId("description").fill("A test post with rich text");
      await page.getByTestId("imageUrl").fill("https://example.com/image.jpg");
      await page.getByTestId("category").fill("Test");
      await page.getByTestId("tags").fill("test,rich-text");

      // Test bold formatting
      const editor = page.frameLocator('.tox-edit-area__iframe');
      await editor.locator('body').click();
      await editor.locator('body').type("This is ");
      await page.keyboard.press('Control+b');
      await editor.locator('body').type("bold");
      await page.keyboard.press('Control+b');
      await editor.locator('body').type(" text");

      // Save the post
      await page.getByTestId("save-button").click();

      // Navigate to the post and verify formatting
      await page.goto("/posts/test-rich-text-post");
      const content = await page.getByTestId("post-content").innerHTML();
      await expect(content).toContain("<strong>bold</strong>");
    }
  );

  test(
    "Rich text editor toolbar functionality",
    {
      tag: "@rich-text",
    },
    async ({ page }) => {
      await page.goto("/posts/create");

      // Test toolbar buttons
      const editor = page.frameLocator('.tox-edit-area__iframe');
      
      // Bold button
      await page.getByTestId("toolbar-bold").click();
      await editor.locator('body').type("Bold text");
      await page.getByTestId("toolbar-bold").click();
      
      // Italic button
      await page.getByTestId("toolbar-italic").click();
      await editor.locator('body').type("Italic text");
      await page.getByTestId("toolbar-italic").click();
      
      // Bullet list
      await page.getByTestId("toolbar-bullet-list").click();
      await editor.locator('body').type("List item 1");
      await page.keyboard.press('Enter');
      await editor.locator('body').type("List item 2");

      // Preview content
      await page.getByTestId("preview-button").click();
      const preview = await page.getByTestId("content-preview");
      await expect(preview.getByText("Bold text")).toHaveCSS("font-weight", "700");
      await expect(preview.getByText("Italic text")).toHaveCSS("font-style", "italic");
      await expect(preview.locator("ul li")).toHaveCount(2);
    }
  );

  test(
    "Rich text editor content persistence",
    {
      tag: "@rich-text",
    },
    async ({ page }) => {
      await page.goto("/posts/create");

      // Add formatted content
      const editor = page.frameLocator('.tox-edit-area__iframe');
      await editor.locator('body').click();
      await page.getByTestId("toolbar-bold").click();
      await editor.locator('body').type("Persistent content");
      await page.getByTestId("toolbar-bold").click();

      // Navigate away
      await page.goto("/");
      
      // Navigate back and verify content persists
      await page.goto("/posts/create");
      const content = await editor.locator('body').innerHTML();
      await expect(content).toContain("<strong>Persistent content</strong>");
    }
  );
}); 