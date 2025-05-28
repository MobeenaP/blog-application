'use client';

import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Store scroll positions for different paths
const scrollPositions = new Map<string, number>();

interface LeftMenuProps {
  categories: Array<{ name: string; count: number }>;
  tags: Array<{ name: string; count: number }>;
  history: Array<{ title: string; urlId: string }>;
}

export function LeftMenu({ categories = [], tags = [], history = [] }: LeftMenuProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Save scroll position when navigating away
  useEffect(() => {
    const nav = navRef.current;
    if (nav) {
      // Save current scroll position for current path
      scrollPositions.set(pathname, nav.scrollTop);

      // Restore scroll position for new path
      const savedPosition = scrollPositions.get(pathname) || 0;
      nav.scrollTop = savedPosition;
    }
  }, [pathname]);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Fixed header */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <Image src={"/wsulogo.png"} alt="WSU logo" width={40} height={40} className="dark:invert" />
        <Link href={"/"} className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
          Full Stack Blog
        </Link>
      </div>
      
      {/* Scrollable content */}
      <nav ref={navRef} className="flex-1 overflow-y-auto px-6 py-4">
        <ul role="list" className="flex flex-col gap-y-7">
          <li>
            <CategoryList categories={categories} />
          </li>
          <li>
            <HistoryList history={history} />
          </li>
          <li>
            <TagList tags={tags} />
          </li>
          <li>
            <Link 
              href={"/admin"} 
              className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400"
            >
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
