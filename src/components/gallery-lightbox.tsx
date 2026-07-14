"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  section: string;
};

export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const current = index !== null ? images[index] : null;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setIndex((i) => (i === null ? i : (i + 1) % images.length));
      } else if (e.key === "ArrowLeft") {
        setIndex((i) =>
          i === null ? i : (i - 1 + images.length) % images.length,
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <>
      <div className="gallery-grid">
        {images.map((photo, i) => (
          <button
            type="button"
            key={photo.id}
            className="gallery-item gallery-item-button"
            onClick={() => setIndex(i)}
            aria-label={`View ${photo.caption}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 900px) 50vw, 25vw"
            />
            <span className="gallery-caption">{photo.caption}</span>
          </button>
        ))}
      </div>

      <DialogPrimitive.Root
        open={open}
        onOpenChange={(next) => {
          if (!next) setIndex(null);
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="lightbox-backdrop" />
          <DialogPrimitive.Popup
            className="lightbox-popup"
            aria-label="Photo preview"
          >
            {current && (
              <>
                <DialogPrimitive.Close
                  className="lightbox-close"
                  aria-label="Close preview"
                >
                  <X size={20} />
                </DialogPrimitive.Close>
                {images.length > 1 && (
                  <button
                    type="button"
                    className="lightbox-nav lightbox-nav-prev"
                    onClick={() =>
                      setIndex((i) =>
                        i === null
                          ? i
                          : (i - 1 + images.length) % images.length,
                      )
                    }
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={26} />
                  </button>
                )}
                <div className="lightbox-image-wrap">
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="90vw"
                    className="lightbox-image"
                    priority
                  />
                </div>
                {images.length > 1 && (
                  <button
                    type="button"
                    className="lightbox-nav lightbox-nav-next"
                    onClick={() =>
                      setIndex((i) =>
                        i === null ? i : (i + 1) % images.length,
                      )
                    }
                    aria-label="Next photo"
                  >
                    <ChevronRight size={26} />
                  </button>
                )}
                <div className="lightbox-caption">
                  <span>{current.caption}</span>
                  <small>
                    {index !== null ? index + 1 : 0} / {images.length}
                  </small>
                </div>
              </>
            )}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
