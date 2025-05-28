import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export type Post = Prisma.PostGetPayload<{}>;
export type Comment = Prisma.CommentGetPayload<{}>;
export type Like = Prisma.LikeGetPayload<{}>;

export const client = {
  db,
  getActiveCategories: async () => {
    const posts = await db.post.findMany({
      where: { active: true },
      select: { category: true },
      distinct: ['category'],
    });

    const categories = posts.map(post => post.category);
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await db.post.count({
          where: { category, active: true },
        });
        return { name: category, count };
      })
    );

    return categoryCounts;
  },

  getActiveTags: async () => {
    const posts = await db.post.findMany({
      where: { active: true },
      select: { tags: true },
    });

    const allTags = posts.flatMap(post => post.tags.split(',').map(tag => tag.trim()));
    const uniqueTags = [...new Set(allTags)];

    const tagCounts = uniqueTags.map(tag => ({
      name: tag,
      count: allTags.filter(t => t === tag).length,
    }));

    return tagCounts;
  },

  getActiveHistory: async () => {
    const recentPosts = await db.post.findMany({
      where: { active: true },
      select: { title: true, urlId: true },
      orderBy: { date: 'desc' },
      take: 5,
    });

    return recentPosts;
  },
};
