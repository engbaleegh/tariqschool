import { storeFileDetailed, StorageError, resolveMimeType, isAllowedImage, isAllowedResultFile } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdminRole } from "@/lib/permissions";
import { UserRole } from "@/generated/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { db } from "@/lib/prisma";
import { getAdminLastActivityMs, isAdminIdleExpired, touchAdminActivity } from "@/lib/admin-session";

const MAX_SIZE = 25 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminRole(session.user.role as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lastActivity = await getAdminLastActivityMs();
  if (lastActivity !== null && isAdminIdleExpired(lastActivity)) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
  await touchAdminActivity();

  const ip = getClientIp(request);
  const { success } = rateLimit(`upload:${ip}`, 30, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = String(formData.get("folder") ?? "media").replace(/[^a-z-]/gi, "") || "media";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mime = resolveMimeType(file);
    if (!isAllowedImage(mime) && !isAllowedResultFile(mime)) {
      return NextResponse.json(
        { error: "File type not allowed. Use JPG, JPEG, PNG, WEBP, or PDF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 400 });
    }

    const stored = await storeFileDetailed(file, folder);

    try {
      const media = await db.media.create({
        data: {
          filename: file.name,
          url: stored.url,
          mimeType: stored.mimeType,
          size: stored.size,
          uploadedBy: session.user.id !== "bootstrap-admin" ? session.user.id : null,
        },
      });
      return NextResponse.json({
        url: stored.url,
        id: media.id,
        responsiveUrls: stored.responsiveUrls,
        storage: "vercel-blob",
      });
    } catch {
      return NextResponse.json({
        url: stored.url,
        id: null,
        responsiveUrls: stored.responsiveUrls,
        storage: "vercel-blob",
        warning: "File uploaded but media record could not be saved",
      });
    }
  } catch (error) {
    const message =
      error instanceof StorageError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Upload failed";
    console.error("Upload API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
