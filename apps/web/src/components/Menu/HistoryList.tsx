'use client';

import { LinkList } from "./LinkList";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HistoryItem {
  title: string;
  urlId: string;
}

export function HistoryList({ history = [] }: { history?: HistoryItem[] }) {
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>, href: string, urlId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Update history
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urlId }),
      });
    } catch (error) {
      console.error('Failed to update history:', error);
    }

    router.push(href);
  };

  if (!history || history.length === 0) {
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
      {history.map((item, index) => {
        const href = `/post/${item.urlId}`;
        return (
          <Link
            title={item.title}
            href={href}
            key={index}
            className="block truncate px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md py-2"
            onClick={(e) => handleClick(e, href, item.urlId)}
          >
            {item.title}
          </Link>
        );
      })}
    </LinkList>
  );
}
