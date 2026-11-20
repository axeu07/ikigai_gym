"use client";
/**
 * 03 Find your circle: pick a goal → the circle it belongs to, a suggested starting point (SAMPLE)
 * and what to try. "Start here" pre-fills the booking form (lib/booking.ts) and scrolls to it.
 */
import { useState } from "react";
import { finder, pillarById } from "@/lib/content";
import { setGoalPrefill } from "@/lib/booking";
import { scrollToTarget } from "@/lib/motion";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";
import { Tag } from "./ui";
import Button from "./Button";

export default function FindCircle() {
  const [id, setId] = useState(finder.goals[0].id);
  const goal = finder.goals.find((g) => g.id === id)!;
  const pillar = pillarById(goal.pillar);

  const start = () => {
    setGoalPrefill(goal.label);
    scrollToTarget("#book");
  };

  return (
    <Section id="circle" tone="paper" className="finder">
      <div className="wrap">
        <SectionHead id="circle" title={finder.heading} sub={finder.sub} />
        <div className="fc-grid reveal">
          <div role="group" aria-label="Your goal" className="fc-goals">
            {finder.goals.map((g) => (
              <button key={g.id} type="button" aria-pressed={g.id === id} className={`fc-goal ${g.id === id ? "is-on" : ""}`} onClick={() => setId(g.id)}>
                <span className={`dot dot-${g.pillar}`} aria-hidden />
                {g.label}
              </button>
            ))}
          </div>

          <div className="fc-result" aria-live="polite">
            <div className="fc-media" key={goal.id}>
              {goal.media.video ? <LoopVideo id={goal.media.video} /> : <Picture id={goal.media.photo!} alt={goal.media.alt ?? ""} sizes="320px" />}
            </div>
            <div className="fc-text">
              <p className="fc-circle">
                Your circle: <strong className={`txt-${pillar.id}`}>{pillar.word}</strong> <span>· {pillar.circle}</span>
              </p>
              <h3 className="fc-program">
                {goal.program} <Tag>SAMPLE</Tag>
              </h3>
              <p className="fc-line">{pillar.line}</p>
              <ul className="fc-try" aria-label="Try">
                {goal.try.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Button onClick={start}>{finder.cta}</Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
