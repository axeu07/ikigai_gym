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

type BgVariant = { width: number; height: number; widths: number[]; base: string };
/** Full-bleed section background: `pano` is served ≥768px, `portrait` below (see backgrounds in media.config.mjs). */
export type BgAsset = { id: string; label: string; pano: BgVariant; portrait: BgVariant; placeholder: string };

type Manifest = { videos?: Record<string, VideoAsset>; images?: Record<string, ImageAsset>; backgrounds?: Record<string, BgAsset> };
const m = manifest as Manifest;

export const videos: Record<string, VideoAsset> = m.videos ?? {};
export const images: Record<string, ImageAsset> = m.images ?? {};
export const backgrounds: Record<string, BgAsset> = m.backgrounds ?? {};

export const srcSet = (img: { widths: number[]; base: string }, ext: "avif" | "webp") => img.widths.map((w) => `${img.base}-${w}.${ext} ${w}w`).join(", ");
/** Media query that switches a background from portrait to pano. */
export const BG_WIDE = "(min-width: 768px)";
