import { LeftMenu } from "./LeftMenu";
import { client } from "@repo/db/client";

const prisma = client.db;

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
}

async function getCategories() {
  const res = await fetch(`${getBaseUrl()}/api/categories`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

async function getTags() {
  const res = await fetch(`${getBaseUrl()}/api/tags`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tags");
  }
  return res.json();
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
