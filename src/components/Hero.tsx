"use client";
/**
 * 01 始め Hajime: full-screen cinematic hero. The enhanced gym-floor still paints first (preloaded,
 * pano ≥768px / portrait below); the treadmill reel fades in over it once it plays. Dark gradient + fine grain hide the low-res footage.
 * The intro's Venn lands exactly on `.hero-venn`. At ignite, an ember glow spreads and
 * "FIND YOUR IKIGAI" catches letter by letter.
 */
import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/motion";
import { whenIgnited } from "@/lib/intro";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { hero, waLink } from "@/lib/content";
import { backgrounds, srcSet, BG_WIDE } from "@/lib/media";
import Button, { WhatsAppIcon } from "./Button";
import Venn from "./Venn";
import { BgPicture, LoopVideo } from "./Media";
import { StatusChip } from "./ui";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(false);
  const bg = backgrounds[hero.bg];

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
      {/* the only preloaded background (React hoists these into <head>); AVIF-capable browsers only */}
      {bg && (
        <>
          <link rel="preload" as="image" type="image/avif" media={BG_WIDE} imageSrcSet={srcSet(bg.pano, "avif")} imageSizes="100vw" fetchPriority="high" />
          <link rel="preload" as="image" type="image/avif" media={`not all and ${BG_WIDE}`} imageSrcSet={srcSet(bg.portrait, "avif")} imageSizes="100vw" fetchPriority="high" />
        </>
      )}
      <div className="hero-media" aria-hidden>
        <div className="hero-par" data-parallax>
          <BgPicture id={hero.bg} priority imgClassName="hero-poster" />
        </div>
      </div>
      <div className="hero-shade" aria-hidden />
      {/* background.mp4 (hero-reel): a clearly visible panel on the left, behind the headline, fading into
          the photo on the right and into the page at the bottom */}
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
