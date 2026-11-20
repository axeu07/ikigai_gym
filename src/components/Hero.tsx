"use client";
/**
 * 01 始め Hajime. Vertical kanji, "Find your reason to move.", the four circles drifting together
 * around a red rising sun over the Mussoorie hills. Waits for the intro (INTRO_DONE) before animating.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { whenIntroDone } from "@/lib/intro";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { hero, pillars, waLink } from "@/lib/content";
import { backdropBlur } from "@/lib/media";
import Button, { WhatsAppIcon } from "./Button";
import Hills from "./Hills";
import { StatusChip } from "./ui";

// where each circle starts (far apart) before drifting into the overlap
const DRIFT: Record<string, [number, number]> = { joy: [-90, -70], power: [90, -70], tribe: [-90, 70], restore: [90, 70] };

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reduced) {
        gsap.set(q(".hero-in"), { opacity: 1, y: 0 });
        root.current?.classList.add("is-lit");
        return;
      }
      gsap.set(q(".hero-in"), { opacity: 0, y: 24 });
      q(".hc-ring").forEach((r) => {
        const [x, y] = DRIFT[(r as HTMLElement).dataset.p ?? "joy"];
        gsap.set(r, { xPercent: x, yPercent: y, opacity: 0 });
      });
      gsap.set(q(".hills-sun"), { y: 120 });
      return whenIntroDone(() => {
        const tl = gsap.timeline();
        tl.to(q(".hills-sun"), { y: 0, duration: 1.8, ease: "power2.out" }, 0)
          .to(q(".hero-in"), { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09 }, 0.15)
          .to(q(".hc-ring"), { xPercent: 0, yPercent: 0, opacity: 1, duration: 2, ease: "power3.inOut", stagger: 0.08 }, 0.3)
          .add(() => root.current?.classList.add("is-lit"), "-=0.3");
        // a slow breathing drift afterwards
        tl.to(q(".hc-rings"), { rotate: 8, duration: 14, ease: "sine.inOut", yoyo: true, repeat: -1 }, ">");
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} id="top" className="hero" aria-labelledby="top-title">
      {backdropBlur && (
        <picture className="hero-bg">
          <source type="image/avif" srcSet={backdropBlur.avif} />
          <img src={backdropBlur.webp} alt="" />
        </picture>
      )}
      <div className="hex-texture" aria-hidden />

      <p className="hero-kanji" lang="ja" aria-hidden>
        生き甲斐
      </p>

      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker hero-in">{hero.kicker}</p>
          <h1 id="top-title" className="hero-title">
            {hero.headline.map((w, i) => (
              <span key={w} className={`hero-in hero-line ${i === 1 ? "is-red" : ""}`}>
                {w}
              </span>
            ))}
          </h1>
          <p className="hero-sub hero-in">{hero.sub}</p>
          <div className="hero-ctas hero-in">
            <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
            <Button href={waLink(hero.ctaWhatsApp.text)} external variant="ghost" icon={<WhatsAppIcon />}>
              {hero.ctaWhatsApp.label}
            </Button>
          </div>
          <div className="hero-meta hero-in">
            <StatusChip />
            <p className="hero-wall">
              “{hero.wallLine}” <span>{hero.wallNote}</span>
            </p>
          </div>
        </div>

        <div className="hero-circles" aria-hidden>
          <div className="hc-rings">
            {pillars.map((p) => (
              <div key={p.id} className={`hc-ring hc-${p.id}`} data-p={p.id}>
                <span className="hc-word">{p.word}</span>
              </div>
            ))}
          </div>
          <div className="hc-centre">
            <span>IKIGAI</span>
          </div>
        </div>
      </div>

      <Hills className="hero-hills" />
      <a href="#philosophy" className="hero-scroll" aria-label="Scroll to the four circles">
        <span aria-hidden />
      </a>
    </section>
  );
}
