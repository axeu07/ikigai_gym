"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setLenis } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { scrollVelocity, startVelocityFx } from "@/lib/velocity";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. Off under reduced motion.
 * Also publishes Lenis' velocity to the shared scrollVelocity (skew / swing in lib/velocity.ts).
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, wheelMultiplier: 1, anchors: false });
    setLenis(lenis);
    lenis.on("scroll", (l: Lenis) => {
      scrollVelocity.v = l.velocity;
      ScrollTrigger.update();
    });
    const stopFx = startVelocityFx();
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      stopFx();
      scrollVelocity.v = 0;
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return null;
}
