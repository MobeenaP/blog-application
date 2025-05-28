import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

const prisma = client.db;

export async function GET() {
  try {
    const recentPosts = await prisma.post.findMany({
      where: { active: true },
      orderBy: { date: 'desc' },
      take: 5,
      select: {
        title: true,
        urlId: true,
      }
    });

    return NextResponse.json(recentPosts);
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { urlId } = await request.json();

    // Get the post to verify it exists and is active
    const post = await prisma.post.findFirst({
      where: {
        urlId,
        active: true,
      },
      select: {
        id: true,
        date: true,
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found or inactive' }, { status: 404 });
    }

    // Update the post's date to move it to the top of the history
    await prisma.post.update({
      where: { id: post.id },
      data: { date: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update history:', error);
    return NextResponse.json({ error: 'Failed to update history' }, { status: 500 });
  }
} 