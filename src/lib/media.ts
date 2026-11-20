/**
 * Media registry. Asset data comes from media-manifest.json, which `npm run media` regenerates.
 * Which asset goes in which section is set in content.ts (see media-map.md for the reasoning).
 */
import manifest from "./media-manifest.json";

export type VideoAsset = {
  id: string;
  label: string;
  width: number;
  height: number;
  duration: number;
  mp4: string;
  webm: string;
  poster: string;
  posterAvif: string;
  /** tiny blurred webp data URI */
  placeholder: string;
};

export type ImageAsset = {
  id: string;
  label: string;
  width: number;
  height: number;
  widths: number[];
  /** base path; files are `${base}-${w}.avif|webp` */
  base: string;
  placeholder: string;
};

type Manifest = { videos?: Record<string, VideoAsset>; images?: Record<string, ImageAsset>; backdropBlur?: { id: string; webp: string; avif: string } | null };
const m = manifest as Manifest;

export const videos: Record<string, VideoAsset> = m.videos ?? {};
export const images: Record<string, ImageAsset> = m.images ?? {};
/** Hero backdrop with its blur/darken baked in (see backdropBlur in scripts/media.config.mjs). */
export const backdropBlur = m.backdropBlur ?? null;

export const srcSet = (img: ImageAsset, ext: "avif" | "webp") => img.widths.map((w) => `${img.base}-${w}.${ext} ${w}w`).join(", ");
