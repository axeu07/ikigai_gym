"use client";
/**
 * Pointer effects, mouse/trackpad only and off under reduced motion. One pointermove listener;
 * the work runs on GSAP's ticker (the same single rAF as Lenis and the scroll-velocity skew), and
 * only on frames after the pointer moved. Transforms and CSS variables only:
 *  - ensō cursor ring that swells over interactive elements and shows a context label:
 *    [data-cursor="…"] wins (Drag / Play / Punch), otherwise [data-tilt] cards read "View"
 *  - ember spotlight that follows the cursor and reveals the hexagon texture (outer layer moves with
 *    the cursor, inner hex layer counter-moves, so the hexes stay fixed to the viewport, no repaint)
 *  - 3D tilt + edge glow on [data-tilt] cards (--rx/--ry/--gx/--gy, technique from the Viva cards)
 *  - magnetic hover on [data-magnetic] buttons
 */
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";
import { ENSO_PATH } from "./Enso";

const INTERACTIVE = "a, button, summary, label, input, select, textarea, [role='tab']";

export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ring = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const hex = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const r = ring.current;
    const s = spot.current;
    const h = hex.current;
    if (!r || !s || !h || !fine || reduced) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const rx = gsap.quickTo(r, "x", { duration: 0.35, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.35, ease: "power3.out" });
    const sx = gsap.quickTo(s, "x", { duration: 0.6, ease: "power3.out" });
    const sy = gsap.quickTo(s, "y", { duration: 0.6, ease: "power3.out" });
    const hx = gsap.quickTo(h, "x", { duration: 0.6, ease: "power3.out" });
    const hy = gsap.quickTo(h, "y", { duration: 0.6, ease: "power3.out" });

    let tiltEl: HTMLElement | null = null;
    let magEl: HTMLElement | null = null;
    const mags = new WeakMap<HTMLElement, { x: (v: number) => void; y: (v: number) => void }>();
    let last: PointerEvent | null = null;
    let dirty = false;
    let lastLabel = "";

    const resetTilt = (el: HTMLElement) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.classList.remove("is-tilting");
    };
    const magFor = (el: HTMLElement) => {
      let m = mags.get(el);
      if (!m) {
        m = { x: gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" }) };
        mags.set(el, m);
      }
      return m;
    };

    const frame = () => {
      if (!dirty) return;
      dirty = false;
      const e = last;
      if (!e) return;
      const { clientX: x, clientY: y } = e;
      rx(x);
      ry(y);
      sx(x);
      sy(y);
      hx(-x);
      hy(-y);
      const t = e.target as Element | null;
      r.dataset.hover = t?.closest(INTERACTIVE) ? "1" : "";
      const ctx = t?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? (t?.closest("[data-tilt]") ? "View" : "");
      if (ctx !== lastLabel) {
        lastLabel = ctx;
        if (label.current) label.current.textContent = ctx;
        r.dataset.label = ctx ? "1" : "";
      }

      // tilt
      const card = t?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (card !== tiltEl) {
        if (tiltEl) resetTilt(tiltEl);
        tiltEl = card;
        card?.classList.add("is-tilting");
      }
      if (card) {
        const b = card.getBoundingClientRect();
        const px = (x - b.left) / b.width;
        const py = (y - b.top) / b.height;
        card.style.setProperty("--rx", `${((0.5 - py) * 8).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${((px - 0.5) * 10).toFixed(2)}deg`);
        card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      }

      // magnetic
      const mag = t?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (mag !== magEl) {
        if (magEl) {
          const m = magFor(magEl);
          m.x(0);
          m.y(0);
        }
        magEl = mag;
      }
      if (mag) {
        const b = mag.getBoundingClientRect();
        const m = magFor(mag);
        m.x((x - (b.left + b.width / 2)) * 0.25);
        m.y((y - (b.top + b.height / 2)) * 0.35);
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      dirty = true;
    };
    gsap.ticker.add(frame);
    const leave = () => html.classList.add("cursor-out");
    const enter = () => html.classList.remove("cursor-out");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      gsap.ticker.remove(frame);
      if (tiltEl) resetTilt(tiltEl);
      html.classList.remove("has-cursor", "cursor-out");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <>
      <div ref={spot} className="spotlight" aria-hidden>
        <div ref={hex} className="spotlight-hex" />
      </div>
      <div ref={ring} className="cursor" aria-hidden>
        <svg viewBox="0 0 100 100">
          <path d={ENSO_PATH} />
        </svg>
        <span ref={label} className="cursor-label" />
      </div>
    </>
  );
}
