"use client";
/**
 * 05 拳 Ken: the Ikigai Boxing Club spotlight. A big parallax image (lighter on mobile), and the
 * section lands with a punch (shake + ember flash)
 * when the section enters, and the "Throw a jab" button repeats it. Reduced motion: flash only.
 */
import { useRef } from "react";
import { gsap, ScrollTrigger, punch, useGSAP } from "@/lib/motion";
import { boxing } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";
import { Confirm } from "./ui";
import Button from "./Button";

export default function Boxing() {
  const ring = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLDivElement>(null);

  // parallax: transform only, scrubbed; smaller range on mobile, none with reduced motion
  useGSAP(() => {
    const el = big.current?.querySelector(".ken-big-inner");
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
      if (reduce) return;
      const r = desktop ? 14 : 6;
      gsap.fromTo(el, { yPercent: -r }, { yPercent: r, ease: "none", scrollTrigger: { trigger: big.current, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  });

  useGSAP(
    () => {
      const el = ring.current;
      if (!el) return;
      ScrollTrigger.create({ trigger: el, start: "top 60%", once: true, onEnter: () => punch(el, flash.current) });
    },
    { scope: ring },
  );

  return (
    <Section id="boxing" className="boxing">
      <div ref={flash} className="ken-flash" aria-hidden />
      <div ref={big} className="ken-big">
        <div className="ken-big-inner">
          <Picture id={boxing.media.main.photo} alt={boxing.media.main.alt} sizes="100vw" />
        </div>
        <div className="grain" aria-hidden />
        <p className="ken-big-word" aria-hidden>
          <span className="outline">Ikigai</span> Boxing Club
        </p>
      </div>
      <p className="ken-kanji" lang="ja" aria-hidden>
        拳
      </p>
      <div ref={ring} className="wrap ken-grid">
        <div className="ken-copy">
          <SectionHead
            id="boxing"
            title={
              <>
                {boxing.heading[0]}
                <br />
                <span className="outline">{boxing.heading[1]}</span>
              </>
            }
            sub={boxing.sub}
            mega
          />
          <ul className="ken-points">
            {boxing.points.map((p, i) => (
              <li key={p.title} className="reveal" style={{ ["--d" as string]: `${200 + i * 80}ms` }}>
                <h3>
                  {p.title} <Confirm confirmed={p.confirmed} />
                </h3>
                <p>{p.line}</p>
              </li>
            ))}
          </ul>
          <div className="ken-actions reveal">
            <Button href="#book">Book a boxing trial</Button>
            <button type="button" className="ken-jab" onClick={() => ring.current && punch(ring.current, flash.current)}>
              {boxing.punch} <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        <div className="ken-media">
          <figure className="ken-bag reveal tilt-card" data-tilt style={{ ["--d" as string]: "120ms" }}>
            <Picture id={boxing.media.bag.photo} alt={boxing.media.bag.alt} sizes="(min-width: 1024px) 18vw, 40vw" />
          </figure>
          <figure className="ken-clip reveal tilt-card" data-tilt style={{ ["--d" as string]: "220ms" }}>
            <LoopVideo id={boxing.media.clip.video} />
          </figure>
        </div>
      </div>
    </Section>
  );
}
