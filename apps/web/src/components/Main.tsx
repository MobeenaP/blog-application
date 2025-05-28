import type { Post } from "@repo/db/client";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  
  const activePosts = posts.filter(post => post.active === true);

  return (
    <main className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {activePosts.length === 0 ? (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-600">No posts available at the moment</p>
      </div>
      ) : (
      <BlogList posts={activePosts} />
      )}
    </main>
  );
}
