import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

const prisma = client.db;

export async function GET() {
  // Get all active posts and their tags
  const posts = await prisma.post.findMany({
    where: { 
      AND: [
        { active: true },
        // Ensure tags is not empty
        { 
          tags: {
            not: "",
          },
        }
      ]
    },
    select: {
      tags: true,
    },
  });

  // Create a map to store tag counts (case-insensitive)
  const tagCount: Record<string, { count: number; properName: string }> = {};
  
  // Process each post's tags
  posts.forEach(post => {
    const tags = post.tags.split(',').map(tag => tag.trim());
    tags.forEach(tag => {
      const lowerCaseTag = tag.toLowerCase();
      if (tagCount[lowerCaseTag]) {
        tagCount[lowerCaseTag].count++;
      } else {
        tagCount[lowerCaseTag] = {
          count: 1,
          properName: tag // Keep the proper casing from the first occurrence
        };
      }
    });
  });

  // Convert to array of tag objects
  const tags = Object.entries(tagCount)
    .map(([_, { count, properName }]) => ({
      name: properName,
      count,
    }));

  // Sort tags alphabetically
  tags.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(tags);
} 