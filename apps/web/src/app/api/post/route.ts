import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

const prisma = client.db;

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(posts);
}