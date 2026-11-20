/**
 * Shared motion setup: GSAP plugin registration, the Lenis instance and small motion helpers.
 * Every helper has a reduced-motion path.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const ease = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  brush: "power4.out",
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ── Lenis singleton (set by <SmoothScroll />) ───────────────────────────────
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

/** Scroll to a section id or element, through Lenis when it's running. */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target.startsWith("#") ? target : `#${target}`) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

/** Punch impact: a short shake plus a red flash on `flash`. Reduced motion: flash only. */
export function punch(target: Element, flash?: Element | null) {
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline();
  if (flash) tl.fromTo(flash, { opacity: reduced ? 0.25 : 0.55 }, { opacity: 0, duration: reduced ? 0.5 : 0.45, ease: "power2.out" }, 0);
  if (!reduced) {
    tl.fromTo(
      target,
      { x: 0, y: 0 },
      { keyframes: [{ x: -10, y: 4 }, { x: 8, y: -3 }, { x: -5, y: 2 }, { x: 3, y: -1 }, { x: 0, y: 0 }], duration: 0.36, ease: "none" },
      0,
    );
  }
  return tl;
}
