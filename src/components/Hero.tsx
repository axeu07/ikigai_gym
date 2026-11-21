"use client";
/**
 * 01 始め Hajime: full-screen hero. The treadmill promo (background.mp4) loops on the left behind the
 * kicker, headline and intro; the Venn sits alone on the dark right side. No buttons here: Book /
 * WhatsApp / open-now are in the header.
 * The intro's Venn lands exactly on `.hero-venn`. At ignite, an ember glow spreads and
 * "FIND YOUR IKIGAI" catches letter by letter.
 */
import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/motion";
import { whenIgnited } from "@/lib/intro";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { hero } from "@/lib/content";
import Venn from "./Venn";
import { LoopVideo } from "./Media";
import "./hero-center-bg.css";
import "./hero-caps.css";

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
      <div className="grain" aria-hidden />
      <div className="hero-glow" aria-hidden />

      <p className="hero-kanji" lang="ja" aria-hidden>
        生き甲斐
      </p>

      <div className="hero-inner">
        <div className="hero-venn-wrap">
          <Venn className="hero-venn" />
        </div>

        {/* left column (desktop): kicker + headline, low on the screen, partly over the video.
            Book / WhatsApp / open-now live in the header (and the floating WhatsApp button). */}
        <div className="hero-copy">
          <p className="hero-kicker hero-in">{hero.kicker}</p>
          <h1 id="top-title" className="hero-title" aria-label={hero.headline.join(" ")}>
            <span className="hero-glowtext" aria-hidden>
              {hero.headline.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </span>
            {hero.headline.map((w, i) =>
              i === 0 ? (
                <span key={w} aria-hidden className="hero-line outline">
                  {w}
                </span>
              ) : (
                // "IKIGAI" + the programme capsules (each ringed like its Venn circle) on one row
                <span key={w} className="hero-row" aria-hidden>
                  <span className="hero-line is-ember">{w}</span>
                  <span className="hero-caps">
                    {hero.capsules.map((c, j) => (
                      <span key={c.label} className={`cap cap-${c.p} hero-in`} style={{ ["--d" as string]: `${900 + j * 90}ms` }}>
                        <i className="cap-ring" />
                        {c.label}
                      </span>
                    ))}
                  </span>
                </span>
              ),
            )}
          </h1>
          <p className="sr-only">{hero.sub}</p>
        </div>
      </div>

      <a href="#philosophy" className="hero-scroll" aria-label="Scroll to the four circles">
        <span aria-hidden />
      </a>
    </section>
  );
}
