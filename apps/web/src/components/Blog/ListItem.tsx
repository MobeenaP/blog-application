import type { Post } from "@repo/db/client";
import Link from "next/link";
import Image from "next/image";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article
      key={post.id}
      className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      data-testid="blog-post"
    >
      {/* Post Image */}
      <div className="relative w-full md:w-1/3 aspect-[16/9] md:aspect-[4/3]">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="rounded-lg object-cover"
          data-testid={`blog-post-image-${post.id}`}
        />
      </div>

      {/* Post Details */}
      <div className="flex flex-col flex-grow space-y-4">
        {/* Post Title and Category */}
        <div>
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-2" data-testid={`blog-post-category-${post.id}`}>{post.category}</div>
          <Link
            href={`/post/${post.urlId}`}
            className="inline-block text-xl md:text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            data-testid={`blog-post-title-${post.id}`}
          >
            {post.title}
          </Link>
        </div>

        {/* Post Date */}
        <div className="text-sm text-gray-500 dark:text-gray-400" data-testid={`blog-post-date-${post.id}`}>
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>

        {/* Post Description */}
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3" data-testid={`blog-post-description-${post.id}`}>{post.description}</p>

        {/* Post Tags */}
        <div className="flex flex-wrap gap-2" data-testid={`blog-post-tags-${post.id}`}>
          {post.tags.split(",").map((tag, index) => (
            <Link
              key={index}
              href={`/tags/${tag.trim().toLowerCase().replace(" ", "-")}`}
              className="text-sm rounded-full bg-blue-50 dark:bg-blue-900 px-3 py-1 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200"
              data-testid={`blog-post-tag-${post.id}-${index}`}
            >
              #{tag.trim()}
            </Link>
          ))}
        </div>

        {/* Post Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2">
          <div className="flex items-center gap-1" data-testid={`blog-post-views-${post.id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
            </svg>
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1" data-testid={`blog-post-likes-${post.id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 dark:text-red-400">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span>{post.likes}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
