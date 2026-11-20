"use client";
/**
 * 05 拳 Ken: the Ikigai Boxing Club. Full-bleed boxing-mural background (BgLayer, shared parallax).
 * The heading slams in with overshoot and the section takes a punch (shake + ember flash) on enter.
 * The heavy bag hangs from its top edge and swings with scroll velocity ([data-swing], lib/velocity.ts).
 * Clicking anywhere in the section throws an ember impact ring at the pointer. Cursor reads PUNCH.
 * Reduced motion: no shake, no swing; the flash and ring fade only.
 */
import { useRef, useState, type MouseEvent } from "react";
import { ScrollTrigger, punch, useGSAP } from "@/lib/motion";
import { boxing } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";
import { Confirm } from "./ui";
import Button from "./Button";

type Ring = { id: number; x: number; y: number };

export default function Boxing() {
  const ring = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const [rings, setRings] = useState<Ring[]>([]);
  const ringKey = useRef(0);

  useGSAP(
    () => {
      const el = ring.current;
      if (!el) return;
      ScrollTrigger.create({ trigger: el, start: "top 60%", once: true, onEnter: () => punch(el, flash.current) });
    },
    { scope: ring },
  );

  const impact = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("a, button")) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++ringKey.current;
    setRings((v) => [...v.slice(-3), { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    window.setTimeout(() => setRings((v) => v.filter((x) => x.id !== id)), 700);
    if (ring.current) punch(ring.current, flash.current);
  };

  return (
    <Section id="boxing" className="boxing" bg={boxing.media.banner}>
      <div ref={flash} className="ken-flash" aria-hidden />
      <p className="ken-kanji" lang="ja" aria-hidden>
        拳
      </p>
      {/* click target for impact rings; content inside stays fully interactive */}
      <div className="ken-hit" onClick={impact} data-cursor="Punch">
        {rings.map((r) => (
          <span key={r.id} className="ken-ring" style={{ left: r.x, top: r.y }} aria-hidden />
        ))}
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
              slam
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
            <div className="ken-bag-hang reveal">
              <span className="ken-chain" aria-hidden />
              <figure className="ken-bag" data-swing>
                <Picture id="punchbag" alt="Heavy punching bag hanging in the IKIGAI studio" sizes="(min-width: 1024px) 26vw, 60vw" />
              </figure>
            </div>
            <figure className="ken-clip reveal tilt-card" data-tilt data-cursor="Play" style={{ ["--d" as string]: "220ms" }}>
              <LoopVideo id={boxing.media.clip.video} />
            </figure>
          </div>
        </div>
      </div>
    </Section>
  );
}
