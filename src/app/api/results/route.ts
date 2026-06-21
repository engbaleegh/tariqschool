import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getLocalPublishedResults } from "@/lib/local-results";

export async function GET() {
  try {
    const results = await db.schoolResult.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    if (results.length) {
      return NextResponse.json({ results });
    }
  } catch {
    // fall through
  }

  const localResults = await getLocalPublishedResults();
  return NextResponse.json({ results: localResults });
}
