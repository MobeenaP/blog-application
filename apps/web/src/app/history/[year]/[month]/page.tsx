import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";
import Link from "next/link";
import { LinkList } from "@/components/Menu/LinkList";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  const postsByDate = await client.db.post.findMany({
    where: {
      active: true,
      date: {
        gte: new Date(Number(year), Number(month) - 1, 1),
        lt: new Date(Number(year), Number(month), 1),
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

export function HistoryList({ history = [] }) {
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <LinkList title="History">
        <div className="px-3 text-sm text-gray-500 dark:text-gray-400">
          No history available
        </div>
      </LinkList>
    );
  }

  return (
    <LinkList title="History">
      <ul className="px-3 py-2">
        {history.map((item) => {
          if (typeof item.month !== "number" || typeof item.year !== "number")
            return null;
          return (
            <li
              key={`${item.year}-${item.month}`}
              className="mb-4 flex justify-between items-center"
            >
              <Link
                href={`/history/${item.year}/${item.month + 1}`}
                className="font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {MONTHS[item.month]}, {item.year}
              </Link>
              <span className="ml-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold">
                {item.count}
              </span>
            </li>
          );
        })}
      </ul>
    </LinkList>
  );
}
