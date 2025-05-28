'use client';

import { LinkList } from "./LinkList";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Category {
  name: string;
  count: number;
}

export function CategoryList({ categories = [] }: { categories?: Category[] }) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  if (!categories || categories.length === 0) {
    return (
      <LinkList title="Categories">
        <div className="px-3 text-sm text-gray-500 dark:text-gray-400">
          No categories available
        </div>
      </LinkList>
    );
  }

  return (
    <LinkList title="Categories">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={`/category/${category.name.toLowerCase()}`}
          onClick={(e) => handleClick(e, `/category/${category.name.toLowerCase()}`)}
          className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          <span>{category.name}</span>
          <span className="text-gray-400 dark:text-gray-500">{category.count}</span>
        </Link>
      ))}
    </LinkList>
  );
}
