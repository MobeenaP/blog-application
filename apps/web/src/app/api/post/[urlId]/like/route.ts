import { NextRequest, NextResponse } from "next/server";
import { client } from "@repo/db/client";

const prisma = client.db;

export async function POST(
  request: NextRequest,
  { params }: { params: { urlId: string } }
) {
  const { urlId } = params;

  try {
    const userIP = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   '127.0.0.1';

    const post = await prisma.post.findUnique({
      where: { urlId }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId: post.id,
        userIP: userIP,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userIP: {
            postId: post.id,
            userIP: userIP,
          }
        }
      });

      const likeCount = await prisma.like.count({
        where: { postId: post.id }
      });

      const updatedPost = await prisma.post.update({
        where: { id: post.id },
        data: { likes: likeCount }
      });

      return NextResponse.json({
        success: true,
        message: "Like removed",
        post: updatedPost,
        liked: false
      });
    } else {
      await prisma.like.create({
        data: {
          postId: post.id,
          userIP: userIP,
        }
      });

      const likeCount = await prisma.like.count({
        where: { postId: post.id }
      });

      const updatedPost = await prisma.post.update({
        where: { id: post.id },
        data: { likes: likeCount }
      });

      return NextResponse.json({
        success: true,
        message: "Post liked",
        post: updatedPost,
        liked: true
      });
    }
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}