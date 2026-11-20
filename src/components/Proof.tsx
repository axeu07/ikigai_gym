"use client";
/**
 * 08 改善 Kaizen: reviews + progress in one section, on a pinned sideways journey (07 Tribe pattern).
 * Left: heading and the four numbers, which count up inside ember rings that draw as they count
 * (<Effects /> drives both from [data-count] and [data-ring]); unconfirmed numbers are tagged.
 * Track: review themes (paraphrased from public reviews, never quoted), then before/after compare
 * sliders, which stay placeholders until consented member photos arrive (nothing invented).
 * Desktop (≥1024px, motion OK): pinned, the track travels sideways and each card rises in as it
 * arrives. Mobile: native swipe row.
 */
import { useRef } from "react";
import { gsap } from "@/lib/motion";
import { proof } from "@/lib/content";
import { enterInTrack, useHorizontalPin } from "@/lib/useHorizontalPin";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder } from "./Media";
import CompareSlider from "./CompareSlider";
import { Confirm } from "./ui";
import "./results.css";

const R = 46;

export default function Proof() {
  const pin = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const trail = useRef<HTMLSpanElement>(null);

  useHorizontalPin({
    pin,
    viewport,
    track,
    onProgress: (p) => trail.current && gsap.set(trail.current, { scaleX: p }),
    setup: (ctx) => enterInTrack(ctx, gsap.utils.toArray<HTMLElement>(".hp-item", ctx.track), { y: 70, rotate: 2.5, opacity: 0 }),
  });

  return (
    <Section id="proof" className="proof results hp-section">
      <div ref={pin} className="hp-pin fx-pin">
        <div className="wrap hp-side">
          <SectionHead id="proof" title={proof.heading} sub={proof.sub} mega />
          <dl className="pf-numbers rs-numbers">
            {proof.numbers.map((n, i) => {
              // the rating ring fills to its share of 5 stars; counts fill the whole ring
              const frac = n.suffix === "★" ? parseFloat(n.value) / 5 : 1;
              return (
                <div key={n.label} className="pf-num reveal" style={{ ["--d" as string]: `${i * 100}ms` }}>
                  <dt>
                    {n.label} <Confirm confirmed={n.confirmed} />
                  </dt>
                  <dd>
                    <svg viewBox="0 0 100 100" className="pf-ring" aria-hidden>
                      <circle cx="50" cy="50" r={R} className="pf-ring-track" />
                      <circle cx="50" cy="50" r={R} className="pf-ring-fill" pathLength={1} data-ring={frac} transform="rotate(-90 50 50)" />
                    </svg>
                    <span className="pf-val">
                      <span data-count={n.value}>{n.value}</span>
                      <span className="pf-suf">{n.suffix}</span>
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div ref={viewport} className="hp-viewport">
          <ul ref={track} className="hp-track pf-track">
            <li className="hp-item pf-label">
              <h3 className="rs-sub">{proof.reviews.title}</h3>
              <p className="pf-note">{proof.note}</p>
            </li>
            {proof.themes.map((t) => (
              <li key={t.title} className="hp-item pf-theme">
                <span className="pf-quote" aria-hidden>
                  “
                </span>
                <h4>{t.title}</h4>
                <p>{t.line}</p>
              </li>
            ))}
            <li className="hp-item pf-label">
              <h3 className="rs-sub">{proof.progress.title}</h3>
              <p className="pf-note">{proof.progress.line}</p>
            </li>
            {Array.from({ length: proof.progress.slots }, (_, i) => (
              <li key={i} className="hp-item kz-card">
                <CompareSlider label={`Member story ${i + 1}`} before={<InkPlaceholder tag="BEFORE · COMING" />} after={<InkPlaceholder className="ink-ph-warm" tag="AFTER · COMING" />} />
                <p className="kz-cap">Story {i + 1} · photos coming</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="hp-trail" aria-hidden>
          <span>Reviews</span>
          <i>
            <span ref={trail} className="hp-trail-fill" />
          </i>
          <span>Progress</span>
        </div>
      </div>
    </Section>
  );
}
