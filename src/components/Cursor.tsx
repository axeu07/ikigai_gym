"use client";
/** A small ensō ring that trails the pointer and swells over links. Mouse/trackpad only, off under reduced motion. */
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";
import { ENSO_PATH } from "./Enso";

export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;
    document.documentElement.classList.add("has-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.dataset.hover = (e.target as Element | null)?.closest("a, button, summary, label, input, select, textarea, [role='tab']") ? "1" : "";
    };
    const leave = () => (el.style.opacity = "0");
    const enter = () => (el.style.opacity = "");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div ref={ref} className="cursor" aria-hidden>
      <svg viewBox="0 0 100 100">
        <path d={ENSO_PATH} />
      </svg>
    </div>
  );
}
