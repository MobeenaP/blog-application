import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

const prisma = client.db;

export async function GET() {
  // Get all active posts and their categories
  const posts = await prisma.post.findMany({
    where: { 
      AND: [
        { active: true },
        // Ensure category is not empty or null
        { 
          category: {
            not: "",
          },
        }
      ]
    },
    select: {
      category: true,
    },
  });

  // Count posts per category (case-insensitive)
  const categoryCount: Record<string, { count: number; properName: string }> = {};
  posts.forEach(post => {
    const lowerCaseCategory = post.category.toLowerCase();
    if (categoryCount[lowerCaseCategory]) {
      categoryCount[lowerCaseCategory].count++;
    } else {
      categoryCount[lowerCaseCategory] = {
        count: 1,
        properName: post.category // Keep the proper casing from the first occurrence
      };
    }
  });

  // Convert to array of category objects
  const categories = Object.entries(categoryCount)
    .map(([_, { count, properName }]) => ({
      name: properName,
      count,
    }));

  // Sort categories alphabetically
  categories.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(categories);
} 