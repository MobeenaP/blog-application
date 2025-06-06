import { LeftMenu } from "./LeftMenu";
import { client } from "@repo/db/client";

const prisma = client.db;

// Query the database directly, no hardcoded URLs or fetch
async function getCategories() {
  const posts = await prisma.post.findMany({
    where: {
      AND: [
        { active: true },
        { category: { not: "" } },
      ],
    },
    select: { category: true },
  });

  const categoryCount: Record<string, { count: number; properName: string }> = {};
  posts.forEach(post => {
    if (!post.category) return;
    const lower = post.category.toLowerCase();
    if (categoryCount[lower]) {
      categoryCount[lower].count++;
    } else {
      categoryCount[lower] = { count: 1, properName: post.category };
    }
  });

  return Object.entries(categoryCount)
    .map(([_, { count, properName }]) => ({ name: properName, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function getTags() {
  const posts = await prisma.post.findMany({
    where: {
      AND: [
        { active: true },
        { tags: { not: "" } },
      ],
    },
    select: { tags: true },
  });

  const tagCount: Record<string, { count: number; properName: string }> = {};
  posts.forEach(post => {
    if (!post.tags) return;
    const tags = post.tags.split(',').map(tag => tag.trim());
    tags.forEach(tag => {
      const lower = tag.toLowerCase();
      if (tagCount[lower]) {
        tagCount[lower].count++;
      } else {
        tagCount[lower] = { count: 1, properName: tag };
      }
    });
  });

  return Object.entries(tagCount)
    .map(([_, { count, properName }]) => ({ name: properName, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function getHistory() {
  const posts = await prisma.post.findMany({
    where: { active: true },
    select: { date: true },
  });

  // Group by month/year
  const map = new Map<string, { month: number; year: number; count: number }>();
  posts.forEach(post => {
    const date = new Date(post.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    if (map.has(key)) {
      map.get(key)!.count += 1;
    } else {
      map.set(key, { month, year, count: 1 });
    }
  });

  // Sort descending by year/month
  return Array.from(map.values()).sort(
    (a, b) =>
      b.year - a.year || b.month - a.month
  );
}

function LoadingMenu() {
  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />
        <div className="ml-4 h-6 w-32 animate-pulse bg-gray-200 rounded" />
      </div>
      <div className="p-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex space-x-3">
                <div className="h-7 w-7 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

async function MenuContent() {
  const [categories, tags, history] = await Promise.all([
    getCategories(),
    getTags(),
    getHistory()
  ]);

  return (
    <LeftMenu 
      categories={categories || []}
      tags={tags || []}
      history={history || []}
    />
  );
}

export function LeftMenuWrapper() {
  return (
    <MenuContent />
  );
}