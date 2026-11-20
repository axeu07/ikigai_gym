/**
 * One shared scroll velocity (written by <SmoothScroll /> from Lenis) and one ticker callback on
 * GSAP's ticker (the same rAF as Lenis and the cursor) that turns it into motion:
 *  - [data-skew]  : skewY with scroll speed, max ±4°, eases back to 0
 *  - [data-swing] : rotate (pivot set in CSS, e.g. the punchbag hangs from the top), max ±7°
 * Transform only, and it only writes when the value actually changes. Off under reduced motion.
 */
import { gsap, ScrollTrigger } from "./motion";

export const scrollVelocity = { v: 0 };

const MAX_SKEW = 4;
let started = false;

export function startVelocityFx(): () => void {
  if (started || typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  started = true;

  let skewEls: HTMLElement[] = [];
  let swingEls: HTMLElement[] = [];
  let skewSet: ((v: number) => void)[] = [];
  let swingSet: ((v: number) => void)[] = [];
  const collect = () => {
    skewEls = gsap.utils.toArray<HTMLElement>("[data-skew]");
    swingEls = gsap.utils.toArray<HTMLElement>("[data-swing]");
    skewSet = skewEls.map((el) => gsap.quickSetter(el, "skewY", "deg") as (v: number) => void);
    swingSet = swingEls.map((el) => gsap.quickSetter(el, "rotate", "deg") as (v: number) => void);
  };
  collect();
  ScrollTrigger.addEventListener("refresh", collect);

  let cur = 0;
  let last = 0;
  const tick = () => {
    const target = gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, scrollVelocity.v * 0.18);
    cur += (target - cur) * 0.12;
    if (Math.abs(cur) < 0.005) cur = 0;
    if (Math.abs(cur - last) < 0.01) return;
    last = cur;
    for (const s of skewSet) s(cur);
    for (const s of swingSet) s(gsap.utils.clamp(-7, 7, -cur * 1.8));
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    ScrollTrigger.removeEventListener("refresh", collect);
    for (const s of skewSet) s(0);
    for (const s of swingSet) s(0);
    started = false;
  };
}
