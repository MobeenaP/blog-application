import { NextRequest, NextResponse } from "next/server";
import { client } from "@repo/db/client";

const prisma = client.db;

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ urlId: string }> }
) {
  const { urlId } = await context.params;
  const data = await request.json();

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

    const updated = await prisma.post.update({
      where: { id: post.id },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        tags: data.tags,
        active: data.active,
      },
    });
    return NextResponse.json({ success: true, post: updated });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 400 });
  }
}