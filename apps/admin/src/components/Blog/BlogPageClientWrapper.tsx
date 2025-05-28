'use client';
import { useState } from "react";
import { LeftMenu } from "../Menu/LeftMenu";
import { FilteredBlogList } from "./FilteredBlogList";
import { Post } from "@repo/db/client";

export function BlogPageClientWrapper({ posts }: { posts: Post[] }) {
  const [tag, setTag] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [sort, setSort] = useState('');

  return (
    <div className="flex">
      <LeftMenu
        tag={tag}
        setTag={setTag}
        date={date}
        setDate={setDate}
        content={content}
        setContent={setContent}
        sort={sort}
        setSort={setSort}
      />
      <FilteredBlogList
        posts={posts}
        tag={tag}
        date={date}
        content={content}
        sort={sort}
      />
    </div>
  );
}