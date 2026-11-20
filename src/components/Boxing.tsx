"use client";
/**
 * 05 拳 Ken: the Ikigai Boxing Club, on the shared pinned sideways journey (06 Sensei / 07 Tribe pattern).
 * Full-bleed boxing-mural background (BgLayer, shared parallax). Left: heading + CTAs. Track: the three
 * points as cards, then the one shadow-boxing clip (the only media in the track, on request).
 * Desktop (≥1024px, motion OK): pinned; the track travels sideways and each card rises in as it arrives;
 * the 拳 kanji drifts the other way. Mobile / reduced motion: native swipe row.
 * The section opens with a thud (jolt + shake + ember flash + phone vibration) on enter; clicking anywhere throws an ember impact
 * ring at the pointer. Cursor reads PUNCH. Reduced motion: no shake; the flash and ring fade only.
 */
import { useRef, useState, type MouseEvent } from "react";
import {
  gsap,
  ScrollTrigger,
  punch,
  prefersReducedMotion,
  useGSAP,
} from "@/lib/motion";
import { boxing } from "@/lib/content";
import { enterInTrack, useHorizontalPin } from "@/lib/useHorizontalPin";
import Section, { SectionHead } from "./Section";
import { LoopVideo } from "./Media";
import "./boxing-solo.css";
import { Confirm } from "./ui";
import Button from "./Button";

type Ring = { id: number; x: number; y: number };

export default function Boxing() {
  const pin = useRef<HTMLDivElement>(null);
  const side = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const trail = useRef<HTMLSpanElement>(null);
  const kanji = useRef<HTMLParagraphElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const [rings, setRings] = useState<Ring[]>([]);
  const ringKey = useRef(0);

  const hit = () => side.current && punch(side.current, flash.current);

  // the section opens with a thud: a heavy jolt + shake + ember flash, and a phone vibration where the
  // browser allows it (Vibration API; needs a prior tap on the page, ignored elsewhere e.g. iOS).
  // Plays every time you scroll down into the section. Reduced motion: flash only, no buzz.
  useGSAP(
    () => {
      const box = pin.current;
      if (!box) return;
      const thud = () => {
        const targets = [side.current, viewport.current].filter(Boolean);
        const reduced = prefersReducedMotion();
        const tl = gsap.timeline();
        if (flash.current)
          tl.fromTo(
            flash.current,
            { opacity: reduced ? 0.3 : 0.75 },
            { opacity: 0, duration: reduced ? 0.6 : 0.7, ease: "power2.out" },
            0,
          );
        if (!reduced) {
          tl.fromTo(
            targets,
            { x: 0, y: 0, scale: 1 },
            {
              keyframes: [
                { y: 22, scale: 0.975, duration: 0.07, ease: "power4.in" },
                { x: -12, y: -9, scale: 1.01, duration: 0.06 },
                { x: 10, y: 6, scale: 1, duration: 0.06 },
                { x: -7, y: -4, duration: 0.06 },
                { x: 5, y: 2, duration: 0.06 },
                { x: -2, y: -1, duration: 0.05 },
                { x: 0, y: 0, duration: 0.08, ease: "power2.out" },
              ],
              clearProps: "transform",
            },
            0,
          );
          try {
            navigator.vibrate?.([70, 40, 140]);
          } catch {
            /* not supported / blocked */
          }
        }
      };
      ScrollTrigger.create({ trigger: box, start: "top 55%", onEnter: thud });
    },
    { scope: pin },
  );

  useHorizontalPin({
    pin,
    viewport,
    track,
    onProgress: (p) => {
      if (trail.current) gsap.set(trail.current, { scaleX: p });
      if (kanji.current) gsap.set(kanji.current, { xPercent: p * -18 });
    },
    setup: (ctx) => {
      const undo = enterInTrack(
        ctx,
        gsap.utils.toArray<HTMLElement>(".hp-item", ctx.track),
        { y: 70, rotate: 2.5, opacity: 0 },
      );
      return () => {
        undo();
        if (kanji.current) gsap.set(kanji.current, { clearProps: "transform" });
      };
    },
  });

  const impact = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("a, button")) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++ringKey.current;
    setRings((v) => [
      ...v.slice(-3),
      { id, x: e.clientX - r.left, y: e.clientY - r.top },
    ]);
    window.setTimeout(() => setRings((v) => v.filter((x) => x.id !== id)), 700);
    hit();
  };

  return (
    <Section id="boxing" className="boxing hp-section" bg={boxing.media.banner}>
      {/* click target for impact rings; content inside stays fully interactive */}
      <div
        ref={pin}
        className="hp-pin fx-pin ken-pin"
        onClick={impact}
        data-cursor="Punch"
      >
        <div ref={flash} className="ken-flash" aria-hidden />
        <p ref={kanji} className="ken-kanji" lang="ja" aria-hidden>
          拳
        </p>
        {rings.map((r) => (
          <span
            key={r.id}
            className="ken-ring"
            style={{ left: r.x, top: r.y }}
            aria-hidden
          />
        ))}

        <div ref={side} className="wrap hp-side ken-copy">
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
            slam
          />
          <div className="ken-actions reveal">
            <Button href="#book">Book a boxing trial</Button>
            <button type="button" className="ken-jab" onClick={hit}>
              {boxing.punch} <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        <div ref={viewport} className="hp-viewport">
          <ol
            ref={track}
            className="hp-track ken-track"
            aria-label="Ikigai Boxing Club"
          >
            {boxing.points.map((p, i) => (
              <li key={p.title} className="hp-item ken-card">
                <span className="ken-card-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>
                  {p.title} <Confirm confirmed={p.confirmed} />
                </h3>
                <p>{p.line}</p>
              </li>
            ))}
            <li className="hp-item ken-shot ken-shot-clip">
              <figure className="ken-clip" data-cursor="Play">
                <LoopVideo id={boxing.media.clip.video} />
              </figure>
            </li>
          </ol>
        </div>

        <div className="hp-trail" aria-hidden>
          <span>Boxing club</span>
          <i>
            <span ref={trail} className="hp-trail-fill" />
          </i>
          <span>{String(boxing.points.length + 1).padStart(2, "0")}</span>
        </div>
      </div>
    </Section>
  );
}
