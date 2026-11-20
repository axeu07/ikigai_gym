"use client";
/**
 * Media elements fed by the manifest.
 * LoopVideo: muted, inline, looping; plays only while on screen (and when `play` is true);
 * shows only the poster when Save-Data is on.
 * Picture: AVIF/WebP srcset from the manifest widths.
 */
import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";
import { videos, images, backgrounds, srcSet, BG_WIDE } from "@/lib/media";
import { Tag } from "./ui";

/** Tasteful stand-in where we have no footage yet: an ink wash with a brush circle and a tag. */
export function InkPlaceholder({ className = "", label, tag = "PHOTO COMING" }: { className?: string; label?: string; tag?: string }) {
  return (
    <div className={`ink-ph ${className}`} role={label ? "img" : undefined} aria-label={label ? `${label} (photo coming)` : undefined} aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 100 100" className="ink-ph-enso" aria-hidden>
        <path d="M70 15.4 A40 40 0 1 1 60.4 11.4" />
      </svg>
      <Tag>{tag}</Tag>
    </div>
  );
}

const noSubscribe = () => () => {};
/** Save-Data on, or a 2G-class connection: show posters only. */
const readSaveData = () => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(c?.saveData || c?.effectiveType === "2g" || c?.effectiveType === "slow-2g");
};

type VideoProps = {
  id: string;
  className?: string;
  style?: CSSProperties;
  /** gate playback (e.g. hero waits for the intro) */
  play?: boolean;
  eager?: boolean;
};

export function LoopVideo({ id, className = "", style, play = true, eager = false }: VideoProps) {
  const v = videos[id];
  const ref = useRef<HTMLVideoElement>(null);
  const saveData = useSyncExternalStore(noSubscribe, readSaveData, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || saveData) return;
    let visible = false;
    const sync = () => {
      if (visible && play) {
        if (el.preload !== "auto") el.preload = "auto";
        void el.play().catch(() => {});
      } else el.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    sync();
    return () => io.disconnect();
  }, [play, saveData]);

  if (!v) return <InkPlaceholder className={className} />;
  return (
    <video
      ref={ref}
      className={`media-el ${className}`}
      style={style}
      poster={v.poster}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      onPlaying={(e) => e.currentTarget.classList.add("is-playing")}
      aria-hidden
      tabIndex={-1}
      disablePictureInPicture
    >
      {!saveData && (
        <>
          {/* H.264 first: hardware-decoded on virtually every device (VP9 often falls back to the CPU) and smaller here */}
          <source src={v.mp4} type="video/mp4" />
          <source src={v.webm} type="video/webm" />
        </>
      )}
    </video>
  );
}

/**
 * Art-directed background picture: the 16:9 pano at ≥768px, the portrait below, AVIF then WebP.
 * Lazy unless `priority` (hero only). Decorative, so alt="".
 */
export function BgPicture({ id, priority = false, imgClassName = "" }: { id: string; priority?: boolean; imgClassName?: string }) {
  const b = backgrounds[id];
  if (!b) return null;
  return (
    <picture>
      <source media={BG_WIDE} type="image/avif" srcSet={srcSet(b.pano, "avif")} sizes="100vw" />
      <source media={BG_WIDE} type="image/webp" srcSet={srcSet(b.pano, "webp")} sizes="100vw" />
      <source type="image/avif" srcSet={srcSet(b.portrait, "avif")} sizes="100vw" />
      <source type="image/webp" srcSet={srcSet(b.portrait, "webp")} sizes="100vw" />
      <img
        src={`${b.pano.base}-${b.pano.widths[0]}.webp`}
        alt=""
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={`media-el ${imgClassName}`}
        style={{ backgroundImage: `url(${b.placeholder})`, backgroundSize: "cover" }}
      />
    </picture>
  );
}

/**
 * Full-bleed section background behind a section's content, under a 60–75% black gradient.
 * `parallax` marks it for the shared transform-only parallax in <Effects /> (≥768px, motion OK).
 */
export function BgLayer({ id, className = "", parallax = true }: { id: string; className?: string; parallax?: boolean }) {
  if (!backgrounds[id]) return null;
  return (
    <div className={`sbg ${className}`} aria-hidden>
      <div className="sbg-img" data-parallax={parallax ? "" : undefined}>
        <BgPicture id={id} />
      </div>
    </div>
  );
}

type PictureProps = {
  id: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  sizes?: string;
  eager?: boolean;
};

export function Picture({ id, alt, className = "", imgClassName = "", style, sizes = "100vw", eager = false }: PictureProps) {
  const img = images[id];
  if (!img) return <InkPlaceholder className={className} label={alt} />;
  const largest = img.widths[img.widths.length - 1];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(img, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(img, "webp")} sizes={sizes} />
      <img
        src={`${img.base}-${largest}.webp`}
        alt={alt}
        width={img.width}
        height={img.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`media-el ${imgClassName}`}
        style={{ backgroundImage: `url(${img.placeholder})`, backgroundSize: "cover", ...style }}
      />
    </picture>
  );
}
