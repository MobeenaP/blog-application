import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

const prisma = client.db;

export async function GET() {
  try {
    // Get all active posts and their categories
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          { active: true },
          {
            category: {
              not: "",
            },
          },
        ],
      },
      select: {
        category: true,
      },
    });

    const categoryCount: Record<string, { count: number; properName: string }> = {};

    posts.forEach(post => {
      if (!post.category) return; // skip empty/null
      const lowerCaseCategory = post.category.toLowerCase();
      if (categoryCount[lowerCaseCategory]) {
        categoryCount[lowerCaseCategory].count++;
      } else {
        categoryCount[lowerCaseCategory] = {
          count: 1,
          properName: post.category
        };
      }
    });

    const categories = Object.entries(categoryCount).map(([_, { count, properName }]) => ({
      name: properName,
      count,
    }));

    categories.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error in GET /api/categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
