'use client';

import { LinkList } from "./LinkList";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Tag {
  name: string;
  count: number;
}

export function TagList({ tags = [] }: { tags?: Tag[] }) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  if (!tags || tags.length === 0) {
    return (
      <LinkList title="Tags">
        <div className="px-3 text-sm text-gray-500 dark:text-gray-400">
          No tags available
        </div>
      </LinkList>
    );
  }

  return (
    <LinkList title="Tags">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/tags/${tag.name.toLowerCase()}`}
          onClick={(e) => handleClick(e, `/tags/${tag.name.toLowerCase()}`)}
          className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          <span>{tag.name}</span>
          <span className="text-gray-400 dark:text-gray-500">{tag.count}</span>
        </Link>
      ))}
    </LinkList>
  );
}
