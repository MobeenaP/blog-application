'use client';

import type { Post } from "@repo/db/client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CommentList } from "../Comments/CommentList";
import { marked } from "marked";

type Comment = {
  id: number;
  content: string;
  authorName: string;
  createdAt: Date;
  postId: number;
  parentId?: number | null;
  replies?: Comment[];
};

type CommentWithReplies = Comment & {
  replies?: CommentWithReplies[];
};

type PostWithComments = Post & {
  comments?: CommentWithReplies[];
};

export function BlogDetail({ post }: { post: PostWithComments }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [imageError, setImageError] = useState(false);

  const hasIncremented = useRef(false);

  // Parse markdown on mount
  useEffect(() => {
    const result = marked.parse(post.content);
    if (result instanceof Promise) {
      result.then(setContent);
    } else {
      setContent(result);
    }
  }, [post.content]);

  // Check if user has already liked this post (using localStorage for demo)
  useEffect(() => {
    setLiked(localStorage.getItem(`liked-${post.id}`) === "true");
  }, [post.id]);

  // Increment view count on mount
  useEffect(() => {
    if (!hasIncremented.current) {
      fetch(`/api/post/${post.urlId}/view`, { method: "POST" });
      hasIncremented.current = true;
    }
  }, [post.urlId]);

  const handleLike = async () => {
    setLoading(true);
    try {
      // No need to send userIP, the server will determine it
      const res = await fetch(`/api/post/${post.urlId}/like`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        throw new Error('Failed to update like status');
      }
      
      const result = await res.json();
      
      if (result.success) {
        setLikes(result.post.likes);
        // Toggle the liked state based on the API response
        const newLikedState = result.liked;
        setLiked(newLikedState);
        
        if (newLikedState) {
          localStorage.setItem(`liked-${post.id}`, "true");
        } else {
          localStorage.removeItem(`liked-${post.id}`);
        }
      } else {
        console.error('Error updating like status:', result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 dark:text-white" data-test-id={`blog-post-${post.id}`}>
      <div className="max-w-4xl mx-auto">
        {/* Post Metadata */}
        <div className="flex space-x-8 text-sm text-gray-500">
          <p>
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p>{post.category}</p>
        </div>

        {/* Post Title */}
        <div className="max-w-4xl">
          <Link href={`/post/${post.urlId}`} className="py-6 text-4xl font-bold">
            {post.title}
          </Link>
          
          {/* Post Image */}
          {!imageError ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={1024}
              height={384}
              className="my-6 rounded-lg object-cover w-full max-h-96"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="my-6 rounded-lg bg-gray-200 w-full h-96 flex items-center justify-center">
              <span className="text-gray-500">Image not available</span>
            </div>
          )}

          {/* Full Post Content */}
          <div className="border-b-[0.5px] border-gray-400 pb-6">
            <article
              data-test-id="content-markdown"
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            ></article>
          </div>

          {/* Post Tags */}
          <div className="flex flex-wrap gap-3 py-4 text-sm text-blue-500">
            {post.tags.split(",").map((tag: string, index: number) => (
              <Link
                key={index}
                href={`/tags/${tag.trim().toLowerCase().replace(" ", "-")}`}
                className="hover:text-blue-700"
              >
                #{tag.trim()}
              </Link>
            ))}
          </div>

          {/* Post Footer */}
          <div className="flex justify-between py-4 border-b border-gray-200">
            <div>{post.views} views</div>
            <div className="flex items-center space-x-4">
              <button
                data-testid="like-button"
                onClick={handleLike}
                disabled={loading}
                className="inline-flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {liked ? "Unlike" : "Like"}
              </button>
              <span>{likes} likes</span>
            </div>
          </div>

          {/* Comments Section */}
          <CommentList comments={post.comments || []} postId={post.id} />
        </div>
      </div>
    </div>
  );
}
