import { LeftMenu } from "./LeftMenu";
import { client } from "@repo/db/client";

const prisma = client.db;

async function getCategories() {
  const res = await fetch('http://localhost:3001/api/categories', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

async function getTags() {
  const res = await fetch('http://localhost:3001/api/tags', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch tags');
  }
  return res.json();
}

async function getHistory() {
  // Get the 5 most recent active posts
  const recentPosts = await prisma.post.findMany({
    where: { active: true },
    orderBy: { date: 'desc' },
    take: 5,
    select: {
      title: true,
      urlId: true,
    }
  });

  return recentPosts.map(post => ({
    title: post.title,
    urlId: post.urlId,
  }));
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