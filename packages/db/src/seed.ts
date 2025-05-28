import { client } from "./client";
import { posts } from "./seed-data";

const prisma = client.db;

export async function seed() {
  try {
    // Delete existing data
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();

    // Create posts
    for (const post of posts) {
      await prisma.post.create({
        data: post
      });
    }

    // Create some comments for testing
    const firstPost = await prisma.post.findFirst();
    if (firstPost) {
      await prisma.comment.create({
        data: {
          content: "This is a test comment",
          authorName: "Test User",
          postId: firstPost.id
        }
      });

      const comment = await prisma.comment.findFirst();
      if (comment) {
        await prisma.comment.create({
          data: {
            content: "This is a reply to the test comment",
            authorName: "Reply User",
            postId: firstPost.id,
            parentId: comment.id
          }
        });
      }
    }

    console.log("Database has been seeded");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

