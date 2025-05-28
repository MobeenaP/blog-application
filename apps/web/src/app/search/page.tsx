import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";

const prisma = client.db;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const searchQuery = q.trim();

  const filteredPosts = await prisma.post.findMany({
    where: {
      active: true,
      OR: [
        { title: { contains: searchQuery} },
        { description: { contains: searchQuery } },
      ],
    },
    orderBy: { date: "desc" },
  });

  return (
    <AppLayout query={searchQuery}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
