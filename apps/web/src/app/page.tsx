import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";

const prisma = client.db;
const POSTS_PER_PAGE = 6;

export default async function Page() {
  const posts = await prisma.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    take: POSTS_PER_PAGE,
  });

  return (
    <AppLayout>
      <Main posts={posts} />
    </AppLayout>
  );
}
