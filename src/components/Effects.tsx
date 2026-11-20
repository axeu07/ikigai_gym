"use client";
/**
 * One shared scroll-effects setup for the whole page (mounted once in layout.tsx):
 *  - ScrollTrigger.batch over every [data-section]: adds `.is-in` once, which un-dims the section,
 *    draws the ember rule and staggers `.reveal` children in (CSS, transform/opacity only)
 *  - section headings (.h-split) ignite word by word, char by char (SplitText)
 *  - [data-count] numbers count up
 *  - [data-parallax] backgrounds drift ±5% (transform only, ≥768px, not with reduced motion)
 *  - [data-ghost] giant section numbers drift slowly (lighter on mobile)
 *  - stacked cards (≥1024px): each [data-stack] section from 03 on slides over the previous one, which
 *    eases back (scale) and darkens (.stack-shade opacity) — transform/opacity, scrubbed
 *  - .h-slam headings slam in with overshoot; [data-ring] rings draw while their numbers count
 *  - footer: the giant "IKIGAI" fills with ember from the bottom; hills drift up
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
  section.querySelectorAll<HTMLElement>(".h-slam").forEach((h) => {
    gsap.fromTo(h, { scale: 1.9, opacity: 0, rotate: -4 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.65, ease: "back.out(2.6)", clearProps: "transform" });
  });
  section.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
  section.querySelectorAll<SVGElement>("[data-ring]").forEach((r) => {
    const frac = parseFloat(r.dataset.ring ?? "1");
    gsap.fromTo(r, { strokeDashoffset: 1 }, { strokeDashoffset: 1 - frac, duration: 1.4, ease: "power2.out" });
  });
}

export default function Effects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let triggers: ScrollTrigger[] = [];
    let cancelled = false;
    // background parallax: transform only, ≥768px with motion allowed (none on mobile / reduced motion)
    const mm = gsap.matchMedia();

    const setup = () => {
      if (cancelled) return;
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const host = el.closest(".sbg, .hero") ?? el;
          gsap.fromTo(el, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: host, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
      // ghost numbers: slow parallax, lighter on small screens
      mm.add({ wide: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean };
        if (!motion) return;
        const r = wide ? 30 : 10;
        gsap.utils.toArray<HTMLElement>("[data-ghost]").forEach((g) => {
          gsap.fromTo(g, { yPercent: -r }, { yPercent: r, ease: "none", scrollTrigger: { trigger: g.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
        // footer: hills rise, the outline word fills with ember from the bottom
        const footer = document.querySelector<HTMLElement>(".footer");
        const fill = footer?.querySelector("[data-ft-fill]");
        const inner = footer?.querySelector("[data-ft-fill-inner]");
        const hills = footer?.querySelector("[data-ft-hills]");
        if (footer && fill && inner) {
          const st = { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true };
          gsap.fromTo(fill, { yPercent: 100 }, { yPercent: 0, ease: "none", scrollTrigger: st });
          gsap.fromTo(inner, { yPercent: -100 }, { yPercent: 0, ease: "none", scrollTrigger: st });
          if (hills) gsap.fromTo(hills, { yPercent: wide ? 30 : 12 }, { yPercent: 0, ease: "none", scrollTrigger: st });
        }
      });
      // stacked cards: desktop only, plain flow on mobile
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        document.documentElement.classList.add("is-stacked");
        const stack = gsap.utils.toArray<HTMLElement>("[data-stack]");
        const from = stack.findIndex((el) => el.id === "circle");
        stack.slice(Math.max(1, from)).forEach((next) => {
          const i = stack.indexOf(next);
          const prev = stack[i - 1];
          if (!prev || prev.id === "philosophy" || prev.id === "top") return;
          // never transform a section that contains a GSAP pin (Programs): a transformed ancestor turns
          // the pin's position:fixed into "relative to the section", so the pinned row scrolled away and
          // left empty black screens
          if (prev.querySelector(".pin-spacer, .pg-pin, .ph-pin")) return;
          const shade = prev.querySelector(":scope > .stack-shade");
          const tl = gsap.timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
          tl.fromTo(prev, { scale: 1 }, { scale: 0.97, transformOrigin: "50% 100%", ease: "none" }, 0);
          // light touch: a heavy shade read as "greyed-out / broken" sections
          if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 0.3, ease: "power2.in" }, 0);
        });
        return () => document.documentElement.classList.remove("is-stacked");
      });
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
      mm.revert();
    };
  }, []);

  return null;
}
