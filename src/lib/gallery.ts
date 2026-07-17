import { promises as fs } from "node:fs";
import path from "node:path";
import { del, list, put } from "@vercel/blob";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  section: string;
  uploadedAt: string;
};

export const GALLERY_SECTIONS = [
  "Graduation",
  "Classroom",
  "Events",
  "Training",
  "Campus",
  "Other",
] as const;

export const MAX_GALLERY_IMAGES = 20;

// Vercel's serverless functions run on a read-only filesystem, so writing to
// public/uploads only works in local dev. In production (or whenever a Blob
// store is connected) we persist everything — the manifest JSON and the
// image files — in Vercel Blob instead.
const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const MANIFEST_PATHNAME = "gallery/manifest.json";
const BLOB_UPLOAD_PREFIX = "gallery/uploads";

const DATA_FILE = path.join(process.cwd(), "data", "gallery.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const UPLOAD_URL_PREFIX = "/uploads";

const DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: "default-1",
    src: "/1.jpg",
    alt: "IMTI graduation batch with dual certificates",
    caption: "Graduation Day",
    section: "Graduation",
    uploadedAt: "",
  },
  {
    id: "default-4",
    src: "/4.jpg",
    alt: "Children in a Montessori activity circle",
    caption: "Classroom Activities",
    section: "Classroom",
    uploadedAt: "",
  },
  {
    id: "default-3",
    src: "/3.jpg",
    alt: "Mrs. P. Rooba addressing an IMTI batch celebration",
    caption: "Institute Events",
    section: "Events",
    uploadedAt: "",
  },
  {
    id: "default-2",
    src: "/2.jpg",
    alt: "Trainee teachers in a hands-on IMTI session",
    caption: "Trainee Sessions",
    section: "Training",
    uploadedAt: "",
  },
];

function parseImages(raw: string): GalleryImage[] {
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return DEFAULT_IMAGES;
  return parsed.map((image) => ({
    section: "Other",
    ...image,
  })) as GalleryImage[];
}

async function readManifest(): Promise<GalleryImage[]> {
  if (USE_BLOB) {
    const { blobs } = await list({ prefix: MANIFEST_PATHNAME, limit: 1 });
    const match = blobs.find((b) => b.pathname === MANIFEST_PATHNAME);
    if (!match) return DEFAULT_IMAGES;
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return DEFAULT_IMAGES;
    try {
      return parseImages(await res.text());
    } catch {
      return DEFAULT_IMAGES;
    }
  }

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_IMAGES, null, 2));
  }
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  try {
    return parseImages(raw);
  } catch {
    return DEFAULT_IMAGES;
  }
}

async function writeManifest(images: GalleryImage[]): Promise<void> {
  const body = JSON.stringify(images, null, 2);
  if (USE_BLOB) {
    await put(MANIFEST_PATHNAME, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, body);
}

async function saveFile(filename: string, file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (USE_BLOB) {
    const blob = await put(`${BLOB_UPLOAD_PREFIX}/${filename}`, buffer, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return blob.url;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `${UPLOAD_URL_PREFIX}/${filename}`;
}

async function deleteFile(src: string): Promise<void> {
  if (USE_BLOB) {
    if (src.includes(".blob.vercel-storage.com/")) {
      await del(src).catch(() => {});
    }
    return;
  }
  if (src.startsWith(UPLOAD_URL_PREFIX)) {
    const filePath = path.join(process.cwd(), "public", src);
    await fs.unlink(filePath).catch(() => {});
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return readManifest();
}

export async function addGalleryImages(
  files: File[],
  section: string,
  captionBase: string,
  altBase: string,
): Promise<{ added: GalleryImage[]; skipped: number }> {
  const images = await readManifest();
  const capacity = Math.max(MAX_GALLERY_IMAGES - images.length, 0);
  const toAdd = files.slice(0, capacity);
  const skipped = files.length - toAdd.length;

  const added: GalleryImage[] = [];
  const resolvedSection = section.trim() || "Other";

  for (const [i, file] of toAdd.entries()) {
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const id = `img-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`;
    const filename = `${id}${ext}`;
    const src = await saveFile(filename, file);

    const suffix = toAdd.length > 1 ? ` ${i + 1}` : "";
    const fileBaseName = path
      .basename(file.name, path.extname(file.name))
      .replace(/[-_]+/g, " ")
      .trim();

    added.push({
      id,
      src,
      alt:
        (altBase.trim() || fileBaseName || `IMTI ${resolvedSection} photo`) +
        suffix,
      caption: (captionBase.trim() || resolvedSection) + suffix,
      section: resolvedSection,
      uploadedAt: new Date().toISOString(),
    });
  }

  if (added.length > 0) {
    images.unshift(...added);
    await writeManifest(images);
  }

  return { added, skipped };
}

export async function updateGalleryImage(
  id: string,
  updates: { alt?: string; caption?: string; section?: string; file?: File },
): Promise<GalleryImage | null> {
  const images = await readManifest();
  const index = images.findIndex((image) => image.id === id);
  if (index === -1) return null;

  const current = images[index];
  let src = current.src;

  if (updates.file) {
    const ext = path.extname(updates.file.name).toLowerCase() || ".jpg";
    const filename = `${id}-${Date.now()}${ext}`;
    const newSrc = await saveFile(filename, updates.file);
    await deleteFile(current.src);
    src = newSrc;
  }

  const updated: GalleryImage = {
    ...current,
    src,
    alt: updates.alt?.trim() || current.alt,
    caption: updates.caption?.trim() || current.caption,
    section: updates.section?.trim() || current.section,
  };
  images[index] = updated;
  await writeManifest(images);
  return updated;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const images = await readManifest();
  const target = images.find((image) => image.id === id);
  const remaining = images.filter((image) => image.id !== id);
  await writeManifest(remaining);

  if (target) {
    await deleteFile(target.src);
  }
}
