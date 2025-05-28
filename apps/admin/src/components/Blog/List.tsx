import type { Post } from "@repo/db/client";
import { BlogListItem } from "./ListItem";
import { CreatePostButton } from "./Create";


export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="w-3/4 flex items-center justify-center">
        <p className="font-semibold py-12">Posts are no longer available or being deactivated</p>
      </div>
    );
  }

  return (
    <div className="w-3/4">
      <div className="p-4">
        <h1 className="text-4xl font-bold">Admin of Full Stack Blog</h1>
        <div className="py-12">
          <div className="mb-8 flex justify-end">
            <CreatePostButton />
          </div>
          <div>
            {posts.map((post) => (
              <BlogListItem key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
