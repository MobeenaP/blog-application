import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { Prisma } from "@prisma/client";

const prisma = client.db;

function generateUrlId(title: string, attempt = 0): string {
  const baseUrlId = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return attempt === 0 ? baseUrlId : `${baseUrlId}-${attempt}`;
}

export async function POST(request: Request) {
  const data = await request.json();
  try {
    // Validate required fields
    if (!data.title || !data.content || !data.description || !data.imageUrl || !data.category || !data.tags) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Handle potential duplicate urlIds
    let urlId = generateUrlId(data.title);
    let attempt = 0;
    let post = null;

    while (!post && attempt < 10) {
      try {
        post = await prisma.post.create({
          data: {
            title: data.title,
            content: data.content,
            description: data.description,
            imageUrl: data.imageUrl,
            category: data.category,
            tags: data.tags,
            urlId,
            date: new Date(),
            active: true,
            views: 0,
            likes: 0,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002' &&
          error.meta?.target instanceof Array &&
          error.meta.target.includes('urlId')
        ) {
          attempt++;
          urlId = generateUrlId(data.title, attempt);
        } else {
          throw error;
        }
      }
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Failed to generate unique URL for the post" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (e) {
    console.error("Error creating post:", e);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create post. Please try again or contact support if the issue persists." 
      },
      { status: 500 }
    );
  }
}