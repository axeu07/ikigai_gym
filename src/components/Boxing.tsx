"use client";
/**
 * 05 拳 Ken: the Ikigai Boxing Club spotlight. The headline lands with a punch (shake + red flash)
 * when the section enters, and the "Throw a jab" button repeats it. Reduced motion: flash only.
 */
import { useRef } from "react";
import { ScrollTrigger, punch, useGSAP } from "@/lib/motion";
import { boxing } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";
import { Confirm } from "./ui";
import Button from "./Button";

export default function Boxing() {
  const ring = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);

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
                <span className="is-red">{boxing.heading[1]}</span>
              </>
            }
            sub={boxing.sub}
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
          <figure className="ken-main reveal">
            <Picture id={boxing.media.main.photo} alt={boxing.media.main.alt} sizes="(min-width: 1024px) 26vw, 60vw" />
          </figure>
          <figure className="ken-bag reveal" style={{ ["--d" as string]: "120ms" }}>
            <Picture id={boxing.media.bag.photo} alt={boxing.media.bag.alt} sizes="(min-width: 1024px) 18vw, 40vw" />
          </figure>
          <figure className="ken-clip reveal" style={{ ["--d" as string]: "220ms" }}>
            <LoopVideo id={boxing.media.clip.video} />
          </figure>
        </div>
      </div>
    </Section>
  );
}
