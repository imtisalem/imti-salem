import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import {
  addGalleryImages,
  deleteGalleryImage,
  getGalleryImages,
  updateGalleryImage,
} from "@/lib/gallery";

// Vercel's serverless functions reject request bodies over ~4.5MB before
// our code even runs, so we stay well under that per request.
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function GET() {
  const images = await getGalleryImages();
  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const alt = String(formData.get("alt") ?? "");
  const caption = String(formData.get("caption") ?? "");
  const section = String(formData.get("section") ?? "");

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `"${file.name}" is not a supported type. Use JPG, PNG, WEBP or GIF.`,
        },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `"${file.name}" is too large. Max size is 4MB.` },
        { status: 400 },
      );
    }
  }

  try {
    const { added, skipped } = await addGalleryImages(
      files,
      section,
      caption,
      alt,
    );
    return NextResponse.json({ images: added, skipped }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const id = String(formData.get("id") ?? "");
  const alt = formData.get("alt");
  const caption = formData.get("caption");
  const section = formData.get("section");
  const file = formData.get("file");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const updates: {
    alt?: string;
    caption?: string;
    section?: string;
    file?: File;
  } = {};
  if (typeof alt === "string" && alt.trim()) updates.alt = alt;
  if (typeof caption === "string" && caption.trim()) updates.caption = caption;
  if (typeof section === "string" && section.trim()) updates.section = section;

  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPG, PNG, WEBP or GIF." },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max size is 4MB." },
        { status: 400 },
      );
    }
    updates.file = file;
  }

  const image = await updateGalleryImage(id, updates);
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
  return NextResponse.json({ image });
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteGalleryImage(id);
  return NextResponse.json({ ok: true });
}
