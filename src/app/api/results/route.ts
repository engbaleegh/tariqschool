import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const results = await db.schoolResult.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
