import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import {
  addGalleryImage,
  deleteGalleryImage,
  getGalleryImages,
  updateGalleryImage,
} from "@/lib/gallery";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
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
  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "");
  const caption = String(formData.get("caption") ?? "");
  const section = String(formData.get("section") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WEBP or GIF." },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Max size is 8MB." },
      { status: 400 },
    );
  }

  try {
    const image = await addGalleryImage(file, alt, caption, section);
    return NextResponse.json({ image }, { status: 201 });
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
        { error: "File too large. Max size is 8MB." },
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
