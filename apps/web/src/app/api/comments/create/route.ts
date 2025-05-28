import { NextResponse } from "next/server";
import { client } from "@repo/db/client";

const prisma = client.db;

export async function POST(request: Request) {
  try {
    const { postId, parentId, authorName, content } = await request.json();

    // Validate input
    if (!postId || !authorName || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the post first to verify it exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // If parentId is provided, verify the parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        postId,
        parentId: parentId || null,
        authorName,
        content,
        createdAt: new Date(),
      },
      include: {
        replies: true,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
} 