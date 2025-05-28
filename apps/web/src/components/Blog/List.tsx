'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Post } from "@repo/db/client";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts: initialPosts }: { posts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${page + 1}`);
      const newPosts = await response.json();
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => {
          const existingIds = new Set(prev.map(post => post.id));
          const uniqueNewPosts = newPosts.filter((post: Post) => !existingIds.has(post.id));
          return [...prev, ...uniqueNewPosts];
        });
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      if (scrolledToBottom) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  if (posts.length === 0) {
    return (
      <div className="w-full flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-400 py-12" data-testid="no-more-posts">No posts available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">From the blog</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Learn how to grow your business with our expert advice.</p>
        </div>
        <div className="grid gap-8 py-8" data-testid="blog-posts-container">
          {posts.map((post) => (
            <BlogListItem key={post.id} post={post} />
          ))}
        </div>
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" data-testid="posts-loading" />
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-4">
            <p className="text-lg text-gray-600 dark:text-gray-400" data-testid="no-more-posts">No more posts to load</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;
