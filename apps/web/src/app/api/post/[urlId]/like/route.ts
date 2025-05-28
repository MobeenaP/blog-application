import { NextRequest, NextResponse } from "next/server";
import { client } from "@repo/db/client";

const prisma = client.db;

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ urlId: string }> }
) {
  const { urlId } = await context.params;
  const { userIP } = await request.json();

  try {
    // Get the post first to get its ID
    const post = await prisma.post.findUnique({
      where: { urlId }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Check if the user has already liked this post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: post.id,
        userIP: userIP,
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { success: false, message: "Already liked" },
        { status: 400 }
      );
    }

    // Create a new like
    await prisma.like.create({
      data: {
        postId: post.id,
        userIP: userIP,
      },
    });

    // Update the post's like count
    const likeCount = await prisma.like.count({
      where: { postId: post.id },
    });

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { likes: likeCount },
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}