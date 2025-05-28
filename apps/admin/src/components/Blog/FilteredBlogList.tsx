'use client';
import { useMemo } from "react";
import { BlogList } from "./List";
import { Post } from "@repo/db/client";

type FilteredBlogListProps = {
  posts: Post[];
  tag: string;
  date: string;
  content: string;
  sort: string;
};

export function FilteredBlogList({ posts, tag, date, content, sort }: FilteredBlogListProps) {
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter((post) => {
      const tags = typeof post.tags === "string" ? post.tags : "";
      const matchesTag = !tag ||
        tags
          .toLowerCase()
          .split(',')
          .some(t => t.trim().includes(tag.toLowerCase().trim()));

      const postDate = new Date(post.date);
      const dd = postDate.getDate().toString().padStart(2, "0");
      const mm = (postDate.getMonth() + 1).toString().padStart(2, "0");
      const yyyy = postDate.getFullYear().toString();
      const dateDigits = `${dd}${mm}${yyyy}`;
      const matchesDate = !date || dateDigits.includes(date);

      const title = post.title ?? "";
      const contentField = post.content ?? "";
      const description = post.description ?? "";

      const matchesContent = !content ||
        title.toLowerCase().includes(content.toLowerCase()) ||
        contentField.toLowerCase().includes(content.toLowerCase()) ||
        description.toLowerCase().includes(content.toLowerCase());

      return matchesTag && matchesDate && matchesContent;
    });

    // Default: newest date first
    if (sort) {
      const [key, order] = sort.split("-");
      filtered = filtered.slice().sort((a, b) => {
        if (key === "title") {
          return order === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (key === "date") {
          return order === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });
    } else {
      filtered = filtered.slice().sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return filtered;
  }, [posts, tag, date, content, sort]);

  return (
    <BlogList posts={filteredPosts} />
  );
}