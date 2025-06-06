import type { Post } from "@repo/db/client";

export function history(posts: Post[]) {
  // Collect all post dates
  const allDates = posts.map((post) => new Date(post.date));

  // Group by year and month
  const map = new Map<string, { month: number; year: number; count: number }>();
  allDates.forEach((date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    if (map.has(key)) {
      map.get(key)!.count += 1;
    } else {
      map.set(key, { month, year, count: 1 });
    }
  });

  // Sort descending by year/month
  return Array.from(map.values()).sort(
    (a, b) => b.year - a.year || b.month - a.month
  );
}

