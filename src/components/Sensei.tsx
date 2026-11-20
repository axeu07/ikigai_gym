"use client";
/**
 * 06 先生 Sensei: coach cards on a pinned sideways journey (same pattern as 07 Tribe).
 * Desktop (≥1024px, motion OK): heading on the left; the row of coach cards travels sideways as you
 * scroll; the lead coach's name runs in giant type behind, drifting the other way; each portrait
 * bleeds in through an ink-blot mask (a noisy clip-path polygon that grows with scroll) as its card
 * arrives. Mobile: native swipe row, portraits shown as-is. Names and portraits are TO CONFIRM.
 * The SAMPLE weekly timetable (Timetable.tsx) shares the pinned screen: under the heading on desktop.
 */
import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { sensei } from "@/lib/content";
import { useHorizontalPin } from "@/lib/useHorizontalPin";
import Section, { SectionHead } from "./Section";
import { Picture } from "./Media";
import { Tag } from "./ui";
import Timetable from "./Timetable";

// ink-blot outline: fixed "noise" per point so the edge looks like ink soaking into paper
const POINTS = 44;
const NOISE = Array.from({ length: POINTS }, (_, i) => 0.13 * Math.sin(i * 2.3) + 0.08 * Math.sin(i * 5.7 + 1) + 0.05 * Math.sin(i * 11.1 + 2));
function inkPolygon(p: number) {
  if (p >= 0.999) return "none";
  const r = p * 82; // % of the box; >71% covers the corners
  const pts = NOISE.map((n, i) => {
    const a = (i / POINTS) * Math.PI * 2;
    // the edge is ragged while it spreads and settles as it fills
    const rr = Math.max(0, r * (1 + n * (1.2 - p)));
    return `${(46 + rr * Math.cos(a)).toFixed(2)}% ${(54 + rr * Math.sin(a)).toFixed(2)}%`;
  });
  return `polygon(${pts.join(",")})`;
}

export default function Sensei() {
  const pin = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const trail = useRef<HTMLSpanElement>(null);
  const giant = useRef<HTMLSpanElement>(null);
  const lead = sensei.people[0];

  useHorizontalPin({
    pin,
    viewport,
    track,
    onProgress: (p) => {
      if (trail.current) gsap.set(trail.current, { scaleX: p });
      if (giant.current) gsap.set(giant.current, { xPercent: -6 - p * 30 });
    },
    setup: ({ tween, pin: el, viewport: vp, track: tr }) => {
      const inks = gsap.utils.toArray<HTMLElement>(".ss-ink", tr);
      const trLeft = tr.getBoundingClientRect().left;
      const triggers = inks.map((ink, i) => {
        ink.style.clipPath = inkPolygon(0);
        const card = ink.closest("li")!;
        const r = card.getBoundingClientRect();
        const onScreen = r.left - trLeft + r.width * 0.4 < vp.clientWidth;
        const update = (st: ScrollTrigger) => (ink.style.clipPath = inkPolygon(st.progress));
        return onScreen
          ? ScrollTrigger.create({ trigger: el, start: `top ${85 - i * 10}%`, end: `top ${15 - i * 10}%`, scrub: true, onUpdate: update })
          : ScrollTrigger.create({ trigger: card, containerAnimation: tween, start: "left 95%", end: "left 45%", scrub: true, onUpdate: update });
      });
      return () => {
        triggers.forEach((t) => t.kill());
        inks.forEach((ink) => (ink.style.clipPath = ""));
        if (giant.current) gsap.set(giant.current, { clearProps: "transform" });
      };
    },
  });

  return (
    <Section id="sensei" tone="paper" className="sensei hp-section">
      <div ref={pin} className="hp-pin fx-pin ss-pin">
        {/* giant name behind everything, drifting while the cards travel */}
        <p className="ss-giant" aria-hidden>
          <span ref={giant} className="ss-giant-track">
            {[0, 1, 2].map((k) => (
              <span key={k}>
                {lead.name} <i className="jp">先生</i>
              </span>
            ))}
          </span>
        </p>

        <div className="wrap hp-side">
          <SectionHead id="sensei" title={sensei.heading} sub={sensei.sub} mega />
        </div>

        <Timetable className="ss-tt" />

        <div ref={viewport} className="hp-viewport">
          <ol ref={track} className="hp-track ss-track" aria-label="Coaches">
            {sensei.people.map((p, i) => (
              <li key={i} className={`ss-card ${i === 0 ? "is-lead" : ""}`}>
                <div className="ss-ink">
                  <Picture id={p.photo} className="ss-photo" alt={`${p.name}: sample portrait, real photo coming`} sizes="(min-width: 1024px) 22vw, 70vw" />
                  <Tag className="ss-sample">SAMPLE PHOTO</Tag>
                </div>
                <p className="ss-idx">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="ss-card-name">{p.name}</h3>
                <p className="ss-role">
                  {p.role} {!p.confirmed && <Tag>TO CONFIRM</Tag>}
                </p>
                <p className="ss-bio">Profile, specialties and certifications coming soon.</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="hp-trail" aria-hidden>
          <span>Coaches</span>
          <i>
            <span ref={trail} className="hp-trail-fill" />
          </i>
          <span>{String(sensei.people.length).padStart(2, "0")}</span>
        </div>
      </div>
    </Section>
  );
}
