import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";
import { Pagination } from "@/components/Blog/Pagination";

const prisma = client.db;
const POSTS_PER_PAGE = 6;

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

  // First, find the proper tag name by checking existing posts
  const posts = await prisma.post.findMany({
    where: {
      active: true,
    },
    select: {
      tags: true,
    },
  });

  // Find the proper tag name case-insensitively
  const searchTag = name.split('-').join(' ');
  let properTagName = '';

  // Look through all posts' tags to find the proper casing
  for (const post of posts) {
    const tags = post.tags.split(',').map(tag => tag.trim());
    const matchingTag = tags.find(tag => tag.toLowerCase() === searchTag.toLowerCase());
    if (matchingTag) {
      properTagName = matchingTag;
      break;
    }
  }

  // If no matching tag was found, use the formatted search tag
  if (!properTagName) {
    properTagName = searchTag
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Get posts for this tag
  const [tagPosts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: {
        AND: [
          { active: true },
          {
            tags: {
              contains: properTagName,
            },
          },
        ],
      },
      orderBy: { date: 'desc' },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({
      where: {
        AND: [
          { active: true },
          {
            tags: {
              contains: properTagName,
            },
          },
        ],
      },
    }),
  ]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            #{properTagName}
          </h1>
          <span className="text-gray-500 dark:text-gray-400">
            {totalPosts} {totalPosts === 1 ? 'Post' : 'Posts'}
          </span>
        </div>
        {totalPosts > 0 ? (
          <>
            <Main posts={tagPosts} />
            {totalPosts > POSTS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalPosts / POSTS_PER_PAGE)}
                baseUrl={`/tags/${name}`}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No posts available with this tag.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
