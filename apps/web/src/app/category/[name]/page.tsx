import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";
import { Pagination } from "@/components/Blog/Pagination";

const prisma = client.db;
const POSTS_PER_PAGE = 6;

// Map of special category names that need exact casing
const CATEGORY_MAP: Record<string, string> = {
  'typescript': 'TypeScript',
  // Add more special cases here if needed
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { name } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  // First, find the proper category name by checking existing posts
  const posts = await prisma.post.findMany({
    where: {
      active: true,
    },
    select: {
      category: true,
    },
  });

  // Find the proper category name case-insensitively
  const searchCategory = name.split('-').join(' ');
  const matchingPost = posts.find(
    post => post.category.toLowerCase() === searchCategory.toLowerCase()
  );

  // Get the proper category name
  const categoryName = matchingPost?.category || 
    CATEGORY_MAP[name.toLowerCase()] || 
    name.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  // Get posts for this category
  const [categoryPosts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: {
        AND: [
          { active: true },
          { category: categoryName }
        ]
      },
      orderBy: { date: 'desc' },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({
      where: {
        AND: [
          { active: true },
          { category: categoryName }
        ]
      },
    }),
  ]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {categoryName}
          </h1>
          <span className="text-gray-500 dark:text-gray-400">
            {totalPosts} {totalPosts === 1 ? 'Post' : 'Posts'}
          </span>
        </div>
        {totalPosts > 0 ? (
          <>
            <Main posts={categoryPosts} />
            {totalPosts > POSTS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalPosts / POSTS_PER_PAGE)}
                baseUrl={`/category/${name}`}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No posts available in this category.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
