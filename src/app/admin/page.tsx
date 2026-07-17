"use client";

import {
  GraduationCap,
  Loader2,
  Lock,
  LogOut,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  section: string;
  uploadedAt: string;
};

const SECTIONS = [
  "Graduation",
  "Classroom",
  "Events",
  "Training",
  "Campus",
  "Other",
];

const MAX_IMAGES = 20;
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const CREDENTIALS_KEY = "imti-admin-credentials";

// The server always responds with JSON, but the platform itself can reject
// a request before our code runs (e.g. "Request Entity Too Large" as plain
// text). Parse defensively so that never crashes the UI with a raw
// "Unexpected token" error.
async function parseJsonResponse(
  res: Response,
): Promise<{ error?: string; [key: string]: unknown }> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    if (!res.ok) {
      const label =
        res.status === 413
          ? "File too large for the server to accept."
          : `Request failed (HTTP ${res.status}).`;
      return { error: label };
    }
    return {};
  }
}

export default function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadSection, setUploadSection] = useState(SECTIONS[0]);
  const [uploading, setUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [busyId, setBusyId] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await parseJsonResponse(res);
      setImages((data.images as GalleryImage[]) ?? []);
    } catch {
      setMessage({ type: "error", text: "Could not load the gallery." });
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyLogin = useCallback(
    async (
      username: string,
      password: string,
      opts: { silent?: boolean } = {},
    ) => {
      if (!opts.silent) {
        setLoggingIn(true);
        setLoginError("");
      }
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
          if (!opts.silent) setLoginError("Incorrect username or password.");
          window.sessionStorage.removeItem(CREDENTIALS_KEY);
          return;
        }
        setCredentials({ username, password });
        window.sessionStorage.setItem(
          CREDENTIALS_KEY,
          JSON.stringify({ username, password }),
        );
        setAuthed(true);
        loadImages();
      } catch {
        if (!opts.silent)
          setLoginError("Could not reach the server. Try again.");
      } finally {
        setLoggingIn(false);
        setCheckingSession(false);
      }
    },
    [loadImages],
  );

  // Attempt to restore a previous session from this browser tab only.
  useEffect(() => {
    const stored = window.sessionStorage.getItem(CREDENTIALS_KEY);
    if (!stored) {
      setCheckingSession(false);
      return;
    }
    const parsed = JSON.parse(stored) as {
      username: string;
      password: string;
    };
    verifyLogin(parsed.username, parsed.password, { silent: true });
  }, [verifyLogin]);

  function handleLogout() {
    window.sessionStorage.removeItem(CREDENTIALS_KEY);
    setAuthed(false);
    setCredentials({ username: "", password: "" });
    setLoginForm({ username: "", password: "" });
  }

  function authHeaders(): HeadersInit {
    return {
      "x-admin-username": credentials.username,
      "x-admin-password": credentials.password,
    };
  }

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    if (uploadFiles.length === 0) {
      setMessage({
        type: "error",
        text: "Choose one or more images to upload first.",
      });
      return;
    }
    setUploading(true);
    setMessage(null);

    // Upload one file per request. Bundling many files into a single
    // request can exceed Vercel's serverless request-body limit (~4.5MB),
    // which gets rejected before our code even runs — this sidesteps that.
    const added: GalleryImage[] = [];
    let skipped = 0;
    let failure: string | null = null;

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      const suffix = uploadFiles.length > 1 ? ` ${i + 1}` : "";
      try {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("alt", uploadAlt ? `${uploadAlt}${suffix}` : "");
        formData.append(
          "caption",
          uploadCaption ? `${uploadCaption}${suffix}` : "",
        );
        formData.append("section", uploadSection);

        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: authHeaders(),
          body: formData,
        });
        const data = await parseJsonResponse(res);
        if (!res.ok) throw new Error(data.error ?? "Upload failed");

        const batchImages = (data.images as GalleryImage[]) ?? [];
        const batchSkipped = (data.skipped as number) ?? 0;
        added.push(...batchImages);
        skipped += batchSkipped;
        if (batchSkipped > 0) break; // gallery is full; stop early
      } catch (err) {
        failure = `"${file.name}": ${err instanceof Error ? err.message : "Upload failed"}`;
        break;
      }
    }

    if (added.length > 0) {
      setImages((prev) => [...added, ...prev]);
    }
    setUploadFiles([]);
    setUploadAlt("");
    setUploadCaption("");
    if (uploadInputRef.current) uploadInputRef.current.value = "";

    if (failure) {
      setMessage({
        type: "error",
        text:
          added.length > 0
            ? `Added ${added.length} photo${added.length === 1 ? "" : "s"}, then failed on ${failure}`
            : `Upload failed on ${failure}`,
      });
    } else if (skipped > 0) {
      setMessage({
        type: "error",
        text: `Added ${added.length} photo${added.length === 1 ? "" : "s"}. Skipped ${skipped} — gallery is full (max ${MAX_IMAGES}).`,
      });
    } else {
      setMessage({
        type: "success",
        text: `Added ${added.length} photo${added.length === 1 ? "" : "s"} to the gallery.`,
      });
    }
    setUploading(false);
  }

  async function handleUpdate(
    id: string,
    updates: { alt?: string; caption?: string; section?: string; file?: File },
  ) {
    setBusyId(id);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("id", id);
      if (updates.alt !== undefined) formData.append("alt", updates.alt);
      if (updates.caption !== undefined)
        formData.append("caption", updates.caption);
      if (updates.section !== undefined)
        formData.append("section", updates.section);
      if (updates.file) formData.append("file", updates.file);

      const res = await fetch("/api/gallery", {
        method: "PATCH",
        headers: authHeaders(),
        body: formData,
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) throw new Error(data.error ?? "Update failed");

      const updatedImage = data.image as GalleryImage;
      setImages((prev) =>
        prev.map((img) => (img.id === id ? updatedImage : img)),
      );
      setMessage({ type: "success", text: "Photo updated." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Update failed",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this photo from the gallery?")) return;
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) throw new Error(data.error ?? "Delete failed");

      setImages((prev) => prev.filter((img) => img.id !== id));
      setMessage({ type: "success", text: "Photo removed." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Delete failed",
      });
    } finally {
      setBusyId(null);
    }
  }

  if (checkingSession) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <Loader2 className="animate-spin text-muted-foreground" size={22} />
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="mb-3 grid size-11 place-items-center rounded-full bg-[#f2ad32] text-[#142b52]">
              <Lock size={18} />
            </span>
            <h1 className="font-semibold text-lg">IMTI Gallery Admin</h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Sign in to manage gallery photos.
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              verifyLogin(loginForm.username, loginForm.password);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="login-username">Username</Label>
              <Input
                id="login-username"
                autoComplete="username"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, username: e.target.value }))
                }
                className="border-border bg-background"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, password: e.target.value }))
                }
                className="border-border bg-background"
                required
              />
            </div>
            {loginError && (
              <p className="text-destructive text-sm">{loginError}</p>
            )}
            <Button type="submit" className="w-full" disabled={loggingIn}>
              {loggingIn ? (
                <Loader2 className="animate-spin" size={16} />
              ) : null}
              {loggingIn ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  const atCapacity = images.length >= MAX_IMAGES;
  const grouped = SECTIONS.map((section) => ({
    section,
    items: images.filter((img) => (img.section || "Other") === section),
  })).filter((group) => group.items.length > 0);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#f2ad32] text-[#142b52]">
            <GraduationCap size={18} />
          </span>
          <div>
            <h1 className="font-semibold text-xl">IMTI Gallery Admin</h1>
            <p className="text-muted-foreground text-sm">
              Add, edit, or remove photos shown on the homepage gallery.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut size={14} /> Log out
        </Button>
      </div>

      {message && (
        <div
          className={`mb-8 rounded-2xl px-4 py-3 text-sm ${
            message.type === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-emerald-500/10 text-emerald-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="mb-12 rounded-3xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-base">Add a new photo</h2>
          <span className="text-muted-foreground text-xs">
            {images.length} / {MAX_IMAGES} used
          </span>
        </div>
        {atCapacity && (
          <p className="mb-4 rounded-2xl bg-amber-500/10 px-4 py-3 text-amber-700 text-sm">
            Gallery is full. Delete a photo before adding a new one.
          </p>
        )}
        <form onSubmit={handleUpload} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="upload-file">
              Image files{" "}
              <span className="font-normal text-muted-foreground">
                (select multiple to bulk upload)
              </span>
            </Label>
            <input
              ref={uploadInputRef}
              id="upload-file"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                const tooBig = files.filter((f) => f.size > MAX_FILE_SIZE);
                setUploadFiles(files.filter((f) => f.size <= MAX_FILE_SIZE));
                if (tooBig.length > 0) {
                  setMessage({
                    type: "error",
                    text: `Skipped ${tooBig.length} file${tooBig.length === 1 ? "" : "s"} over 4MB: ${tooBig.map((f) => f.name).join(", ")}`,
                  });
                } else {
                  setMessage(null);
                }
              }}
              className="block w-full rounded-3xl border border-border bg-background px-3.5 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm file:font-medium"
              disabled={atCapacity}
            />
            {uploadFiles.length > 0 && (
              <p className="text-muted-foreground text-xs">
                {uploadFiles.length} file
                {uploadFiles.length === 1 ? "" : "s"} selected
                {uploadFiles.length > MAX_IMAGES - images.length
                  ? ` — only ${Math.max(MAX_IMAGES - images.length, 0)} will fit (gallery limit is ${MAX_IMAGES})`
                  : ""}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="upload-caption">
              Caption{" "}
              <span className="font-normal text-muted-foreground">
                (applied to all, numbered if several)
              </span>
            </Label>
            <Input
              id="upload-caption"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="e.g. Classroom Activities"
              className="border-border bg-background"
              disabled={atCapacity}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="upload-alt">
              Alt text (for accessibility &amp; SEO)
            </Label>
            <Input
              id="upload-alt"
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              placeholder="Describe what's in the photo"
              className="border-border bg-background"
              disabled={atCapacity}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="upload-section">Section</Label>
            <Select
              value={uploadSection}
              onValueChange={(value) => setUploadSection(value ?? SECTIONS[0])}
              disabled={atCapacity}
            >
              <SelectTrigger
                id="upload-section"
                className="w-full border-border bg-background"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {SECTIONS.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={uploading || atCapacity || uploadFiles.length === 0}
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Upload size={16} />
              )}
              {uploading
                ? "Uploading..."
                : uploadFiles.length > 1
                  ? `Upload ${uploadFiles.length} photos`
                  : "Upload photo"}
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base">
            Current gallery ({images.length})
          </h2>
        </div>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : images.length === 0 ? (
          <p className="text-muted-foreground text-sm">No photos yet.</p>
        ) : (
          grouped.map((group) => (
            <div key={group.section}>
              <h3 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                {group.section} ({group.items.length})
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((image) => (
                  <GalleryCard
                    key={image.id}
                    image={image}
                    busy={busyId === image.id}
                    onUpdate={(updates) => handleUpdate(image.id, updates)}
                    onDelete={() => handleDelete(image.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

function GalleryCard({
  image,
  busy,
  onUpdate,
  onDelete,
}: {
  image: GalleryImage;
  busy: boolean;
  onUpdate: (updates: {
    alt?: string;
    caption?: string;
    section?: string;
    file?: File;
  }) => void;
  onDelete: () => void;
}) {
  const [caption, setCaption] = useState(image.caption);
  const [alt, setAlt] = useState(image.alt);
  const [section, setSection] = useState(image.section || "Other");
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dirty =
    caption !== image.caption ||
    alt !== image.alt ||
    section !== image.section ||
    Boolean(replaceFile);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-square w-full bg-muted">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="320px"
          className="object-cover"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="space-y-1.5">
          <Label htmlFor={`caption-${image.id}`} className="text-xs">
            Caption
          </Label>
          <Input
            id={`caption-${image.id}`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border-border bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`alt-${image.id}`} className="text-xs">
            Alt text
          </Label>
          <Input
            id={`alt-${image.id}`}
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="border-border bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`section-${image.id}`} className="text-xs">
            Section
          </Label>
          <Select
            value={section}
            onValueChange={(value) => setSection(value ?? section)}
          >
            <SelectTrigger
              id={`section-${image.id}`}
              className="w-full border-border bg-background"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {SECTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`replace-${image.id}`} className="text-xs">
            Replace image
          </Label>
          <input
            ref={fileInputRef}
            id={`replace-${image.id}`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setReplaceFile(e.target.files?.[0] ?? null)}
            className="block w-full rounded-3xl border border-border bg-background px-3 py-1.5 text-xs file:mr-2 file:rounded-full file:border-0 file:bg-secondary file:px-2.5 file:py-1 file:text-xs file:font-medium"
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            disabled={!dirty || busy}
            onClick={() => {
              onUpdate({
                caption: caption !== image.caption ? caption : undefined,
                alt: alt !== image.alt ? alt : undefined,
                section: section !== image.section ? section : undefined,
                file: replaceFile ?? undefined,
              });
              setReplaceFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            {busy ? <Loader2 className="animate-spin" size={14} /> : "Save"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={busy}
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
