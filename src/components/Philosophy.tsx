"use client";
/**
 * 02 生き甲斐 Four circles. Desktop (≥1024px, motion OK): the section pins and each circle
 * (Joy → Power → Tribe → Restore) highlights in turn with its footage and one line, then the
 * ember centre lights. Mobile / reduced motion: no pin, all four shown as a list.
 */
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { philosophy, pillars } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";

export default function Philosophy() {
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [met, setMet] = useState(false);
  const [pinned, setPinned] = useState(false);

  useGSAP(
    () => {
      const el = pin.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        setPinned(true);
        let last = -1;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "+=260%",
          pin: true,
          anticipatePin: 1,
          onUpdate: (s) => {
            const i = Math.min(pillars.length - 1, Math.floor(s.progress * (pillars.length + 0.6)));
            if (i !== last) {
              last = i;
              setActive(i);
            }
            setMet(s.progress > 0.9);
          },
        });
        return () => {
          st.kill();
          setPinned(false);
        };
      });
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        const st = ScrollTrigger.create({ trigger: el, start: "top 60%", once: true, onEnter: () => setMet(true) });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: pin },
  );

  const p = pillars[active];

  return (
    <Section id="philosophy" className={`philosophy ${pinned ? "is-pinned" : ""}`}>
      <div ref={pin} className="ph-pin">
        <div className="wrap ph-grid">
          <div className="ph-left">
            <SectionHead id="philosophy" title={philosophy.heading} sub={philosophy.intro} mega />
            {/* pinned: one pillar at a time */}
            <div className="ph-focus" aria-live="polite">
              <p className="ph-step">
                <span className="ph-count">0{active + 1}</span> / 04 · {p.circle}
              </p>
              <p className="ph-word" key={p.id}>
                {p.word} <span lang="ja" className="jp">{p.jp}</span>
              </p>
              <p className="ph-line">{p.line}</p>
              <ol className="ph-dots" aria-hidden>
                {pillars.map((x, i) => (
                  <li key={x.id} className={i === active ? "is-on" : ""} />
                ))}
              </ol>
            </div>
          </div>

          <div className={`ph-stage ${met ? "is-met" : ""}`}>
            {pillars.map((x, i) => (
              <figure key={x.id} className={`pc pc-${x.id} ${pinned ? (i === active ? "is-on" : "is-off") : ""}`}>
                <div className="pc-media">
                  {x.media.video ? <LoopVideo id={x.media.video} play={!pinned || i === active} /> : <Picture id={x.media.photo!} alt={x.media.alt ?? ""} sizes="320px" />}
                </div>
                <figcaption className="pc-label">
                  <span className="pc-word">{x.word}</span>
                  <span className="pc-circle">{x.circle}</span>
                </figcaption>
              </figure>
            ))}
            <div className="ph-centre" aria-hidden>
              <span>{philosophy.centre.word}</span>
            </div>
          </div>
        </div>
      </div>

      {/* unpinned (mobile / reduced motion): every pillar listed */}
      <div className="wrap">
        <ol className="ph-list">
          {pillars.map((x, i) => (
            <li key={x.id} className="reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <p className="ph-li-head">
                <span className={`dot dot-${x.id}`} aria-hidden />
                <strong>{x.word}</strong>
                <span className="ph-li-circle">{x.circle}</span>
                <span lang="ja" className="jp ph-li-jp">
                  {x.jp}
                </span>
              </p>
              <p className="ph-li-line">{x.line}</p>
            </li>
          ))}
          <li className="ph-centre-line reveal">
            <span className="dot dot-sun" aria-hidden />
            <p>
              <strong>Ikigai.</strong> {philosophy.centre.line}
            </p>
          </li>
        </ol>
        <figure className="ph-sign reveal">
          <Picture id={philosophy.sign.photo} alt={philosophy.sign.alt} sizes="200px" />
          <figcaption>{philosophy.signNote}</figcaption>
        </figure>
      </div>
    </Section>
  );
}
