'use client';

import type { Post } from "@repo/db/client";
import Link from "next/link";
//import Image from "next/image";
import { useState } from "react";

export function BlogListItem({ post }: { post: Post }) {
  const [active, setActive] = useState(post.active);
  const [loading, setLoading] = useState(false);

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/post/${post.urlId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          description: post.description,
          content: post.content,
          imageUrl: post.imageUrl,
          tags: post.tags,
          active: !active,
        }),
      });
      const result = await res.json();
      if (result.success && result.post) {
        setActive(result.post.active);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      key={post.id}
      className="flex flex-row gap-8 p-8 transition-shadow duration-300 hover:shadow-lg"
      data-test-id={`blog-post-${post.id}`}
    >
      {/* Post Image */}
      <img
        src={post.imageUrl}
        alt={post.title}
        width={800}
        height={192}
        className="h-96 w-64 rounded-lg object-cover"
        data-testid="post-image"
      />

      {/* Post Details */}
      <div className="flex w-1/2 flex-col justify-between">
        {/* Post Title */}
        <Link
          href={`/post/${post.urlId}`}
          title={`Category / ${post.title}`}
          className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-blue-600"
        >
          {post.title}
        </Link>

        {/* Post Metadata */}
        <div className="mt-4 text-sm text-500">
          <span>
            Posted on{" "}
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </span>
          <span className="mx-2">|</span>
          <span>{post.category}</span>
          <span className="mx-2">|</span>
          <span>
            {post.tags
              .split(",")
              .map((tag) => `#${tag.trim()}`)
              .join(", ")}
          </span>
        </div>

        {/* Post active */}
        <div className="mt-1 flex items-center space-x-2">
          <button
            type="button"
            disabled={loading}
            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            onClick={handleToggleActive}
          >
            {active ? "Active" : "Inactive"}
          </button>
        </div>

        {/* Post Description */}
        <p className="mt-6 leading-relaxed text-700">{post.description}</p>

        {/* Views and Likes */}
        <div className="mt-6 flex flex-wrap gap-2 text-sm text-blue-500">
          <div className="text-500">{post.views} views</div>
          <div className="ml-auto flex items-center space-x-1 text-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <div>{post.likes} likes</div>
          </div>
        </div>
      </div>
    </article>
  );
}
