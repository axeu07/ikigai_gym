"use client";
/**
 * Section-change transition for the header links: a full-screen veil with the four-ring IKIGAI logo
 * spinning in the centre (rings rotate, ember core pulses) while the page jumps to the chosen section
 * underneath, then the veil lifts. Driven by the Web Animations API with inline styles, so it does not
 * depend on any stylesheet. Reduced motion: no veil, a plain jump.
 */
import { forwardRef, useImperativeHandle, useRef } from "react";
import { getLenis, prefersReducedMotion } from "@/lib/motion";

export type NavLoaderHandle = { go: (href: string) => void };

// 2x2 overlapping rings, same layout as the four-circle logo (CircleProgress)
const RINGS: [number, number][] = [
  [24, 24],
  [40, 24],
  [24, 40],
  [40, 40],
];

const NavLoader = forwardRef<NavLoaderHandle>(function NavLoader(_, ref) {
  const veil = useRef<HTMLDivElement>(null);
  const busy = useRef<number[]>([]);

  const jump = (href: string) => {
    const el = href === "#top" ? document.body : document.querySelector<HTMLElement>(href);
    if (!el) return;
    const lenis = getLenis();
    if (href === "#top") {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    } else if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
    else el.scrollIntoView({ behavior: "auto", block: "start" });
  };

  useImperativeHandle(ref, () => ({
    go(href) {
      const v = veil.current;
      if (!v || prefersReducedMotion()) {
        jump(href);
        return;
      }
      busy.current.forEach((t) => window.clearTimeout(t));
      v.getAnimations({ subtree: true }).forEach((a) => a.cancel());

      v.style.visibility = "visible";
      v.style.pointerEvents = "auto";
      v.animate([{ opacity: 0 }, { opacity: 1, offset: 0.16 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 1300, easing: "ease-in-out", fill: "forwards" });
      v.querySelector("svg")?.animate(
        [
          { transform: "rotate(0deg) scale(0.6)" },
          { transform: "rotate(240deg) scale(1)", offset: 0.25 },
          { transform: "rotate(560deg) scale(1)", offset: 0.8 },
          { transform: "rotate(720deg) scale(1.15)" },
        ],
        { duration: 1300, easing: "cubic-bezier(0.45, 0, 0.25, 1)" },
      );
      v.querySelectorAll<SVGGElement>("[data-ring]").forEach((g, i) => {
        const [cx, cy] = RINGS[i];
        const dx = (cx - 32) * 0.6;
        const dy = (cy - 32) * 0.6;
        // rings start pulled apart, snap together into the logo, then breathe
        g.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: "translate(0, 0)", offset: 0.3 },
            { transform: `translate(${dx * 0.25}px, ${dy * 0.25}px)`, offset: 0.55 },
            { transform: "translate(0, 0)" },
          ],
          { duration: 1300, easing: "ease-in-out" },
        );
      });
      v.querySelector("[data-core]")?.animate(
        [
          { transform: "scale(0)", opacity: 0 },
          { transform: "scale(1.6)", opacity: 1, offset: 0.35 },
          { transform: "scale(1)", opacity: 1, offset: 0.6 },
          { transform: "scale(1.4)", opacity: 1 },
        ],
        { duration: 1300, easing: "ease-out" },
      );

      busy.current = [
        window.setTimeout(() => jump(href), 260), // jump while the veil covers the page
        window.setTimeout(() => {
          v.style.visibility = "hidden";
          v.style.pointerEvents = "none";
        }, 1320),
      ];
    },
  }));

  return (
    <div
      ref={veil}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99,
        display: "grid",
        placeItems: "center",
        // see-through, heavily blurred page behind the spinner
        background: "rgb(10 10 10 / 0.45)",
        backdropFilter: "blur(18px) saturate(1.1)",
        WebkitBackdropFilter: "blur(18px) saturate(1.1)",
        visibility: "hidden",
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      <svg viewBox="0 0 64 64" style={{ width: "min(46vmin, 340px)", height: "min(46vmin, 340px)", overflow: "visible", transformOrigin: "50% 50%" }}>
        {RINGS.map(([cx, cy], i) => (
          <g key={i} data-ring style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}>
            <circle cx={cx} cy={cy} r={13} fill="none" stroke="#f2eee6" strokeWidth={1.6} />
          </g>
        ))}
        <circle data-core cx={32} cy={32} r={4} fill="#ff5a1f" style={{ transformBox: "fill-box", transformOrigin: "50% 50%", filter: "drop-shadow(0 0 6px rgb(255 90 31 / 0.9))" }} />
      </svg>
    </div>
  );
});

export default NavLoader;
