import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

const prisma = client.db;

export async function GET() {
  try {
    // Get all active posts and their tags
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          { active: true },
          {
            tags: {
              not: "",
            },
          },
        ],
      },
      select: {
        tags: true,
      },
    });

    const tagCount: Record<string, { count: number; properName: string }> = {};

    posts.forEach(post => {
      if (!post.tags) return; // skip empty/null
      const tags = post.tags.split(',').map(tag => tag.trim());
      tags.forEach(tag => {
        const lowerCaseTag = tag.toLowerCase();
        if (tagCount[lowerCaseTag]) {
          tagCount[lowerCaseTag].count++;
        } else {
          tagCount[lowerCaseTag] = {
            count: 1,
            properName: tag
          };
        }
      });
    });

    const tags = Object.entries(tagCount).map(([_, { count, properName }]) => ({
      name: properName,
      count,
    }));

    tags.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error in GET /api/tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}
