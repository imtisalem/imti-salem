import { promises as fs } from "node:fs";
import path from "node:path";

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

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_IMAGES, null, 2));
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_IMAGES;
    return parsed.map((image) => ({
      section: "Other",
      ...image,
    })) as GalleryImage[];
  } catch {
    return DEFAULT_IMAGES;
  }
}

async function saveGalleryImages(images: GalleryImage[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(images, null, 2));
}

export async function addGalleryImage(
  file: File,
  alt: string,
  caption: string,
  section: string,
): Promise<GalleryImage> {
  const images = await getGalleryImages();
  if (images.length >= MAX_GALLERY_IMAGES) {
    throw new Error(
      `Gallery is full (max ${MAX_GALLERY_IMAGES} images). Delete a photo before adding a new one.`,
    );
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const id = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${id}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  const image: GalleryImage = {
    id,
    src: `${UPLOAD_URL_PREFIX}/${filename}`,
    alt: alt.trim() || caption.trim() || "IMTI gallery photo",
    caption: caption.trim() || "IMTI",
    section: section.trim() || "Other",
    uploadedAt: new Date().toISOString(),
  };

  images.unshift(image);
  await saveGalleryImages(images);
  return image;
}

export async function updateGalleryImage(
  id: string,
  updates: { alt?: string; caption?: string; section?: string; file?: File },
): Promise<GalleryImage | null> {
  const images = await getGalleryImages();
  const index = images.findIndex((image) => image.id === id);
  if (index === -1) return null;

  const current = images[index];
  let src = current.src;

  if (updates.file) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const ext = path.extname(updates.file.name).toLowerCase() || ".jpg";
    const filename = `${id}-${Date.now()}${ext}`;
    const buffer = Buffer.from(await updates.file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    if (current.src.startsWith(UPLOAD_URL_PREFIX)) {
      const oldPath = path.join(process.cwd(), "public", current.src);
      await fs.unlink(oldPath).catch(() => {});
    }
    src = `${UPLOAD_URL_PREFIX}/${filename}`;
  }

  const updated: GalleryImage = {
    ...current,
    src,
    alt: updates.alt?.trim() || current.alt,
    caption: updates.caption?.trim() || current.caption,
    section: updates.section?.trim() || current.section,
  };
  images[index] = updated;
  await saveGalleryImages(images);
  return updated;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const images = await getGalleryImages();
  const target = images.find((image) => image.id === id);
  const remaining = images.filter((image) => image.id !== id);
  await saveGalleryImages(remaining);

  if (target?.src.startsWith(UPLOAD_URL_PREFIX)) {
    const filePath = path.join(process.cwd(), "public", target.src);
    await fs.unlink(filePath).catch(() => {});
  }
}
