"use client";
/**
 * One shared scroll-effects setup for the whole page (mounted once in layout.tsx):
 *  - ScrollTrigger.batch over every [data-section]: adds `.is-in` once, which un-dims the section,
 *    draws the ember rule and staggers `.reveal` children in (CSS, transform/opacity only)
 *  - section headings (.h-split) ignite word by word, char by char (SplitText)
 *  - [data-count] numbers count up
 * Waits for the intro so trigger positions are measured on the final layout. Cleans up on unmount.
 * Reduced motion: sections are marked in immediately, no split, numbers shown as-is.
 */
import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/motion";
import { whenIntroDone } from "@/lib/intro";

function countUp(el: HTMLElement) {
  const raw = el.dataset.count ?? "";
  const target = parseFloat(raw);
  if (Number.isNaN(target)) return;
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const o = { v: 0 };
  gsap.to(o, { v: target, duration: 1.4, ease: "power2.out", onUpdate: () => (el.textContent = o.v.toFixed(decimals)) });
}

function ignite(section: Element, reduced: boolean) {
  section.classList.add("is-in");
  if (reduced) return;
  section.querySelectorAll<HTMLElement>(".h-split").forEach((h) => {
    if (h.dataset.split) return;
    h.dataset.split = "1";
    const split = SplitText.create(h, { type: "words,chars", charsClass: "split-char" });
    gsap.fromTo(
      split.chars,
      { opacity: 0.08, yPercent: 35 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.018,
        onStart: () => gsap.set(split.chars, { willChange: "transform, opacity" }),
        onComplete: () => gsap.set(split.chars, { clearProps: "willChange" }),
      },
    );
  });
  section.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
}

export default function Effects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let triggers: ScrollTrigger[] = [];
    let cancelled = false;

    const setup = () => {
      if (cancelled) return;
      const sections = gsap.utils.toArray<HTMLElement>("[data-section]");
      if (reduced) {
        sections.forEach((s) => ignite(s, true));
        return;
      }
      // hide headings until they ignite (avoids a flash of the unsplit text)
      document.documentElement.classList.add("fx-ready");
      triggers = ScrollTrigger.batch(sections, {
        start: "top 78%",
        once: true,
        onEnter: (els) => els.forEach((s) => ignite(s, false)),
      });
      // anything already above the fold (e.g. after a reload mid-page)
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.78) ignite(s, false);
      });
      ScrollTrigger.refresh();
    };

    const stop = whenIntroDone(() => requestAnimationFrame(setup));
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      cancelled = true;
      stop();
      window.removeEventListener("load", onLoad);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
