import { client } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = client.db;
const POSTS_PER_PAGE = 6;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const skip = (page - 1) * POSTS_PER_PAGE;

  try {
    const posts = await prisma.post.findMany({
      where: { active: true },
      orderBy: { date: 'desc' },
      skip,
      take: POSTS_PER_PAGE,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
} 