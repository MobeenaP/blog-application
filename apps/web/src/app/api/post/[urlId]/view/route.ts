import { NextResponse } from "next/server";
import { client } from "@repo/db/client";

const prisma = client.db;

export async function POST(request: Request, { params }: { params: Promise<{ urlId: string }> }) {
  const { urlId } = await params;
  try {
    const post = await prisma.post.update({
      where: { urlId: urlId },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json({ views: post.views });
  } catch (error) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}