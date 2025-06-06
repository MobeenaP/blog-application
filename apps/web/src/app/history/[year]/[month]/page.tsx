import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";

const prisma = client.db;

export default async function Page({
  params,
}: {
  params: Record<string, string>;
}) {
  const { year, month } = params;

  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 1);

  const postsByDate = await prisma.post.findMany({
    where: {
      active: true,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: { date: "desc" },
  });

  return (
    <AppLayout>
      <Main posts={postsByDate} />
    </AppLayout>
  );
}
