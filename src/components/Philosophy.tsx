"use client";
/**
 * 02 生き甲斐 Ikigai: four circles, each holding a piece of the gym, converge as you scroll
 * until they overlap and the red centre lights up. Reduced motion: shown already overlapped.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { philosophy, pillars } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";

const APART: Record<string, [number, number]> = { joy: [-38, -30], power: [38, -30], tribe: [-38, 30], restore: [38, 30] };

export default function Philosophy() {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      if (reduced) {
        el.classList.add("is-met");
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "center 45%",
          scrub: 0.8,
          onUpdate: (st) => el.classList.toggle("is-met", st.progress > 0.92),
        },
      });
      q(".pc").forEach((c) => {
        const [x, y] = APART[(c as HTMLElement).dataset.p ?? "joy"];
        tl.fromTo(c, { xPercent: x, yPercent: y, scale: 0.86 }, { xPercent: 0, yPercent: 0, scale: 1, ease: "none" }, 0);
      });
    },
    { scope: stage, dependencies: [reduced] },
  );

  return (
    <Section id="philosophy" className="philosophy">
      <div className="wrap">
        <SectionHead id="philosophy" title={philosophy.heading} sub={philosophy.intro} />

        <div className="ph-grid">
          <div ref={stage} className="ph-stage">
            {pillars.map((p) => (
              <figure key={p.id} className={`pc pc-${p.id}`} data-p={p.id}>
                <div className="pc-media">
                  {p.media.video ? <LoopVideo id={p.media.video} /> : <Picture id={p.media.photo!} alt={p.media.alt ?? ""} sizes="320px" />}
                </div>
                <figcaption className="pc-label">
                  <span className="pc-word">{p.word}</span>
                  <span className="pc-circle">{p.circle}</span>
                </figcaption>
              </figure>
            ))}
            <div className="ph-centre" aria-hidden>
              <span>{philosophy.centre.word}</span>
            </div>
          </div>

          <ol className="ph-list">
            {pillars.map((p, i) => (
              <li key={p.id} className="reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
                <p className="ph-li-head">
                  <span className={`dot dot-${p.id}`} aria-hidden />
                  <strong>{p.word}</strong>
                  <span className="ph-li-circle">{p.circle}</span>
                  <span lang="ja" className="jp ph-li-jp">
                    {p.jp}
                  </span>
                </p>
                <p className="ph-li-line">{p.line}</p>
              </li>
            ))}
            <li className="ph-centre-line reveal" style={{ ["--d" as string]: "380ms" }}>
              <span className="dot dot-sun" aria-hidden />
              <p>
                <strong>Ikigai.</strong> {philosophy.centre.line}
              </p>
            </li>
          </ol>
        </div>

        <figure className="ph-sign reveal">
          <Picture id={philosophy.sign.photo} alt={philosophy.sign.alt} sizes="200px" />
          <figcaption>{philosophy.signNote}</figcaption>
        </figure>
      </div>
    </Section>
  );
}
