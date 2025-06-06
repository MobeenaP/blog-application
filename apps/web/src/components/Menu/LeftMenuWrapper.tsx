import { LeftMenu } from "./LeftMenu";
import { client } from "@repo/db/client";

const prisma = client.db;

async function getCategories() {
  // Adjust the query as needed for your schema
  return prisma.category.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

async function getTags() {
  // Aggregate tags from posts
  const posts = await prisma.post.findMany({
    where: { active: true, tags: { not: "" } },
    select: { tags: true },
  });

  const tagCount: Record<string, { count: number; properName: string }> = {};
  posts.forEach((post) => {
    const tags = post.tags.split(",").map((tag) => tag.trim());
    tags.forEach((tag) => {
      const lower = tag.toLowerCase();
      if (tagCount[lower]) {
        tagCount[lower].count++;
      } else {
        tagCount[lower] = { count: 1, properName: tag };
      }
    });
  });

  return Object.entries(tagCount)
    .map(([_, { count, properName }]) => ({
      name: properName,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function getHistory() {
  const recentPosts = await prisma.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    take: 5,
    select: {
      title: true,
      urlId: true,
    },
  });

  return recentPosts.map((post) => ({
    title: post.title,
    urlId: post.urlId,
  }));
}

async function MenuContent() {
  const [categories, tags, history] = await Promise.all([
    getCategories(),
    getTags(),
    getHistory(),
  ]);

  return (
    <LeftMenu
      categories={categories || []}
      tags={tags || []}
      history={history || []}
    />
  );
}

export async function LeftMenuWrapper() {
  return <MenuContent />;
}
