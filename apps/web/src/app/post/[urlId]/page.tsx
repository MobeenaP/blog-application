import { AppLayout } from "@/components/Layout/AppLayout";
import { BlogDetail } from "@/components/Blog/Detail";
import { client } from "@repo/db/client";

const prisma = client.db;

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const post = await prisma.post.findUnique({
    where: {
      urlId,
    },
    include: {
      comments: {
        where: {
          parentId: null, // Only fetch top-level comments
        },
        include: {
          replies: {
            include: {
              replies: true, // Include nested replies
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!post) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-gray-600">Post not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <BlogDetail post={post} />
    </AppLayout>
  );
}
