"use client";
/**
 * Shared "pinned sideways journey" (the 07 Tribe pattern), used by Sensei, Tribe, Proof and Plans.
 * Desktop (≥1024px, motion OK): the pin element pins at the top of the screen and the track moves left
 * as you scroll, by exactly its overflow. Everything else gets plain native layout (CSS decides; see
 * .hp-* in tail-motion.css, which uses the same media query so the layout is final before the pin
 * measures).
 *
 * Also:
 *  - pinSpacing is explicit: desktop sections are display:flex, and GSAP drops pin spacing for a flex
 *    parent, which let the next section slide over the pin
 *  - keyboard focus inside the track scrolls the page so the focused item is on screen
 *  - `scrollToItem(el)` scrolls the page to the point where `el` is centred in the viewport
 *  - `setup(ctx)` lets a section add its own scrubbed extras (containerAnimation triggers etc.)
 */
import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, getLenis } from "@/lib/motion";

export const HPIN_MQ = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export type HPinCtx = {
  tween: gsap.core.Tween;
  st: ScrollTrigger;
  pin: HTMLElement;
  viewport: HTMLElement;
  track: HTMLElement;
  scrollToItem: (el: Element) => void;
};

type Opts = {
  pin: RefObject<HTMLElement | null>;
  viewport: RefObject<HTMLElement | null>;
  track: RefObject<HTMLElement | null>;
  /** 0 → 1 while pinned (e.g. a trail bar) */
  onProgress?: (p: number) => void;
  setup?: (ctx: HPinCtx) => void | (() => void);
};

export function useHorizontalPin({ pin, viewport, track, onProgress, setup }: Opts) {
  const [pinned, setPinned] = useState(false);
  const progressCb = useRef(onProgress);
  useEffect(() => {
    progressCb.current = onProgress;
  });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(HPIN_MQ, () => {
        const el = pin.current;
        const vp = viewport.current;
        const tr = track.current;
        if (!el || !vp || !tr) return;
        setPinned(true);
        const dist = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
        const span = () => Math.max(dist(), window.innerHeight * 0.6);
        const tween = gsap.to(tr, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${span()}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (s) => progressCb.current?.(s.progress),
          },
        });
        const st = tween.scrollTrigger!;

        const scrollToItem = (item: Element) => {
          const d = dist();
          const r = item.getBoundingClientRect();
          const left = r.left - tr.getBoundingClientRect().left; // position inside the track (both move with x)
          const want = gsap.utils.clamp(0, d, left - (vp.clientWidth - r.width) / 2);
          const y = st.start + (d > 0 ? (want / d) * (st.end - st.start) : 0);
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { duration: 1.2 });
          else window.scrollTo({ top: y, behavior: "smooth" });
        };

        // keyboard: bring a focused item (link, input…) into view
        const onFocus = (e: FocusEvent) => {
          // the card holding the focus (Plans' cards sit in display:contents wrappers, so not ".hp-track > *")
          const item = (e.target as Element).closest("li, article, .hp-item, #book") ?? (e.target as Element);
          const r = item.getBoundingClientRect();
          const v = vp.getBoundingClientRect();
          if (r.left < v.left || r.right > v.right) scrollToItem(item);
        };
        tr.addEventListener("focusin", onFocus);

        const extra = setup?.({ tween, st, pin: el, viewport: vp, track: tr, scrollToItem });
        return () => {
          tr.removeEventListener("focusin", onFocus);
          if (typeof extra === "function") extra();
          setPinned(false);
          st.kill();
          tween.kill();
          gsap.set(tr, { clearProps: "transform" });
        };
      });
      return () => mm.revert();
    },
    { scope: pin },
  );

  return pinned;
}

/**
 * Scrubbed entrance for items inside a horizontal track: items already on screen when the pin starts
 * animate on the vertical approach; the rest animate as the track carries them in from the right.
 */
export function enterInTrack(ctx: HPinCtx, items: HTMLElement[], from: gsap.TweenVars | ((el: HTMLElement, i: number) => gsap.TweenVars), extraVars?: (el: HTMLElement) => ScrollTrigger.Vars | undefined) {
  const vpW = ctx.viewport.clientWidth;
  const trLeft = ctx.track.getBoundingClientRect().left;
  let onScreenCount = 0;
  const tweens = items.map((el, i) => {
    const r = el.getBoundingClientRect();
    const onScreen = r.left - trLeft + r.width * 0.3 < vpW;
    const k = onScreen ? onScreenCount++ : 0;
    const vars: gsap.TweenVars = { x: 0, y: 0, rotate: 0, rotationX: 0, rotationY: 0, opacity: 1, ease: "power2.out" };
    const scrollTrigger: ScrollTrigger.Vars = onScreen
      ? { trigger: ctx.pin, start: `top ${95 - k * 8}%`, end: `top ${35 - k * 8}%`, scrub: 0.6 }
      : { trigger: el, containerAnimation: ctx.tween, start: "left 100%", end: "left 62%", scrub: 0.6 };
    const t = gsap.fromTo(el, typeof from === "function" ? from(el, i) : { ...from }, { ...vars, scrollTrigger: { ...scrollTrigger, ...extraVars?.(el) } });
    return t;
  });
  return () =>
    tweens.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
      gsap.set(t.targets(), { clearProps: "transform,opacity" });
    });
}
