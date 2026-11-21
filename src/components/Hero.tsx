"use client";
/**
 * 01 始め Hajime: full-screen hero. Two full portrait loops frame a dark centre: the treadmill promo
 * (background.mp4) on the left, the Zumba class (zumba.mp4) on the right; the Venn + headline sit between.
 * The intro's Venn lands exactly on `.hero-venn`. At ignite, an ember glow spreads and
 * "FIND YOUR IKIGAI" catches letter by letter.
 */
import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/motion";
import { whenIgnited } from "@/lib/intro";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { hero, waLink } from "@/lib/content";
import Button, { WhatsAppIcon } from "./Button";
import Venn from "./Venn";
import { LoopVideo } from "./Media";
import { StatusChip } from "./ui";
import "./hero-center-bg.css";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      return whenIgnited(() => {
        setLit(true);
        el.classList.add("is-ignited");
        if (reduced) return;
        const split = SplitText.create(el.querySelectorAll(".hero-line"), { type: "chars", charsClass: "hero-char" });
        gsap.from(split.chars, {
          opacity: 0,
          yPercent: 18,
          scale: 1.25,
          duration: 0.5,
          ease: "power3.out",
          stagger: { each: 0.035, from: "random" },
          clearProps: "transform,opacity,willChange",
          onStart: () => gsap.set(split.chars, { willChange: "transform, opacity" }),
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} id="top" className="hero" aria-labelledby="top-title">
      {/* faint ember-lit gym floor behind the Venn + headline, in the dark centre between the videos */}
      <picture className="hero-center-bg" aria-hidden>
        <source srcSet="/media/img/bg-ember-floor-1130.avif" type="image/avif" />
        <img src="/media/img/bg-ember-floor-1130.webp" alt="" decoding="async" fetchPriority="low" />
      </picture>
      {/* background.mp4 (hero-reel): the full promo loops in a portrait panel on the left; the rest of
          the hero stays on the plain dark background */}
      <div className="hero-vid" aria-hidden>
        <LoopVideo id={hero.video} className="hero-vid-el" play={lit} eager />
      </div>
      {/* zumba.mp4 (hero-zumba): the mirror panel on the right (desktop only); the centre stays dark */}
      <div className="hero-vid is-right" aria-hidden>
        <LoopVideo id={hero.videoRight} className="hero-vid-el" play={lit} />
      </div>
      <div className="grain" aria-hidden />
      <div className="hero-glow" aria-hidden />

      <p className="hero-kanji" lang="ja" aria-hidden>
        生き甲斐
      </p>

      <div className="hero-inner">
        <div className="hero-venn-wrap">
          <Venn className="hero-venn" />
        </div>

        {/* right column (desktop): headline + intro sit under the Venn */}
        <div className="hero-copy">
          <p className="hero-kicker hero-in">{hero.kicker}</p>
          <h1 id="top-title" className="hero-title" aria-label={hero.headline.join(" ")}>
            <span className="hero-glowtext" aria-hidden>
              {hero.headline.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </span>
            {hero.headline.map((w, i) => (
              <span key={w} aria-hidden className={`hero-line ${i === 0 ? "outline" : "is-ember"}`}>
                {w}
              </span>
            ))}
          </h1>
          <p className="hero-sub hero-in" style={{ ["--d" as string]: "350ms" }}>
            <strong>{hero.tagline}</strong> {hero.sub}
          </p>
        </div>

        {/* left column (desktop): buttons + open chip, over the video */}
        <div className="hero-actions">
          <div className="hero-ctas hero-in" style={{ ["--d" as string]: "450ms" }}>
            <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
            <Button href={waLink(hero.ctaWhatsApp.text)} external variant="ghost" icon={<WhatsAppIcon />}>
              {hero.ctaWhatsApp.label}
            </Button>
          </div>
          <div className="hero-meta hero-in" style={{ ["--d" as string]: "550ms" }}>
            <StatusChip />
            <p className="hero-wall">
              “{hero.wallLine}” <span>{hero.wallNote}</span>
            </p>
          </div>
        </div>
      </div>

      <a href="#philosophy" className="hero-scroll" aria-label="Scroll to the four circles">
        <span aria-hidden />
      </a>
    </section>
  );
}
