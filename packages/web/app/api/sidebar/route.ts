import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [categories, tags, history] = await Promise.all([
      client.getActiveCategories(),
      client.getActiveTags(),
      client.getActiveHistory(),
    ]);

    return NextResponse.json({
      categories,
      tags,
      history,
    });
  } catch (error) {
    console.error("Error fetching sidebar data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sidebar data" },
      { status: 500 }
    );
  }
} 