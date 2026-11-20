"use client";
/**
 * 07 先生 Sensei: a large list of coach names. Desktop (fine pointer, motion OK): hovering a name
 * shows a portrait card that follows the cursor (quickTo, transform only). Touch / keyboard: each
 * name is a button that expands an inline card. Names and portraits are TO CONFIRM placeholders.
 */
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { sensei } from "@/lib/content";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder } from "./Media";
import { Tag } from "./ui";

export default function Sensei() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const follow = fine && !reduced;
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    const c = card.current;
    if (!follow || !el || !c) return;
    const x = gsap.quickTo(c, "x", { duration: 0.5, ease: "power3.out" });
    const y = gsap.quickTo(c, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x(e.clientX - r.left);
      y(e.clientY - r.top);
    };
    el.addEventListener("pointermove", move, { passive: true });
    return () => el.removeEventListener("pointermove", move);
  }, [follow]);

  const shown = hover !== null ? sensei.people[hover] : null;

  return (
    <Section id="sensei" tone="paper" className="sensei">
      <div className="wrap ss-layout">
        <SectionHead id="sensei" title={sensei.heading} sub={sensei.sub} mega />

        <div ref={stage} className="ss-stage" onPointerLeave={() => setHover(null)}>
          <ol className="ss-names">
            {sensei.people.map((p, i) => (
              <li key={i} className={`ss-row reveal ${open === i ? "is-open" : ""}`} style={{ ["--d" as string]: `${i * 90}ms` }}>
                <button
                  type="button"
                  className="ss-name"
                  aria-expanded={open === i}
                  aria-controls={`ss-card-${i}`}
                  data-cursor="View"
                  onPointerEnter={() => follow && setHover(i)}
                  onClick={() => setOpen((v) => (v === i ? null : i))}
                >
                  <span className="ss-idx">0{i + 1}</span>
                  <span className="ss-text">{p.name}</span>
                  <span className="ss-role">
                    {p.role} {!p.confirmed && <Tag>TO CONFIRM</Tag>}
                  </span>
                  <span className="ss-arrow" aria-hidden>
                    →
                  </span>
                </button>
                {/* inline card: tap / keyboard */}
                <div id={`ss-card-${i}`} className="ss-inline" hidden={open !== i}>
                  <InkPlaceholder className="ss-photo" label={`${p.name} portrait`} tag="PORTRAIT COMING" />
                  <p>Profile, specialties and certifications coming soon.</p>
                </div>
              </li>
            ))}
          </ol>

          {/* desktop: portrait card follows the cursor */}
          {follow && (
            <div ref={card} className={`ss-follow ${shown ? "is-shown" : ""}`} aria-hidden>
              <div className="ss-follow-inner">
                <InkPlaceholder className="ss-photo" tag="PORTRAIT COMING" />
                {shown && (
                  <p>
                    <strong>{shown.name}</strong> · {shown.role}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
