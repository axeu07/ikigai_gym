"use client";
/**
 * 03 Find your circle. Left: goal chips (ripple on click). Right (≥50%): a large Venn of the four
 * circles, floating and slowly orbiting. Hovering a chip or a circle grows that circle and pushes the
 * others away. Choosing fills the circle with ember, then it morphs (clip-path from the circle's
 * centre) into the result card with a large photo; the booking form is pre-filled (lib/booking.ts).
 * Suggestions are SAMPLE. Transform/opacity (+ one clip-path morph); reduced motion: no orbit/morph.
 */
import { useRef, useState, type MouseEvent } from "react";
import { finder, pillars, pillarById, type GoalId, type PillarId } from "@/lib/content";
import { setGoalPrefill } from "@/lib/booking";
import { scrollToTarget } from "@/lib/motion";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";
import { Tag } from "./ui";
import Button from "./Button";

/** Each circle's centre (as % of the Venn box) and its outward direction. */
const GEO: Record<PillarId, { cx: number; cy: number; dx: number; dy: number }> = {
  joy: { cx: 35, cy: 35, dx: -1, dy: -1 },
  power: { cx: 65, cy: 35, dx: 1, dy: -1 },
  tribe: { cx: 35, cy: 65, dx: -1, dy: 1 },
  restore: { cx: 65, cy: 65, dx: 1, dy: 1 },
};

export default function FindCircle() {
  const [hot, setHot] = useState<PillarId | null>(null);
  const [chosen, setChosen] = useState<GoalId | null>(null);
  const [open, setOpen] = useState(false);
  const [ripple, setRipple] = useState<{ key: number; id: GoalId; x: number; y: number } | null>(null);
  const rippleKey = useRef(0);

  const goal = finder.goals.find((g) => g.id === chosen) ?? null;
  const pillar = goal ? pillarById(goal.pillar) : null;
  const focus = hot ?? (open ? null : goal?.pillar ?? null);

  const choose = (id: GoalId) => {
    const g = finder.goals.find((x) => x.id === id)!;
    setChosen(id);
    setGoalPrefill(g.label);
    setOpen(true);
  };

  const onChip = (e: MouseEvent<HTMLButtonElement>, id: GoalId) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRipple({ key: ++rippleKey.current, id, x: e.clientX - r.left, y: e.clientY - r.top });
    choose(id);
  };

  const circleStyle = (p: PillarId) => {
    const g = GEO[p];
    if (!focus) return {};
    if (focus === p) return { ["--s" as string]: 1.14, ["--tx" as string]: "0%", ["--ty" as string]: "0%" };
    return { ["--s" as string]: 0.92, ["--tx" as string]: `${g.dx * 7}%`, ["--ty" as string]: `${g.dy * 7}%` };
  };

  const geo = goal ? GEO[goal.pillar] : GEO.joy;

  return (
    <Section id="circle" className="finder" tone="paper">
      <div className="wrap fc-grid">
        <div className="fc-left">
          <SectionHead id="circle" title={finder.heading} sub={finder.sub} mega />
          <div role="group" aria-label="Your goal" className="fc-goals reveal">
            {finder.goals.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={g.id === chosen}
                className={`fc-goal ${g.id === chosen ? "is-on" : ""}`}
                onPointerEnter={() => setHot(g.pillar)}
                onPointerLeave={() => setHot(null)}
                onFocus={() => setHot(g.pillar)}
                onBlur={() => setHot(null)}
                onClick={(e) => onChip(e, g.id)}
              >
                <span className={`dot dot-${g.pillar}`} aria-hidden />
                {g.label}
                {ripple?.id === g.id && <span key={ripple.key} className="ripple" style={{ left: ripple.x, top: ripple.y }} aria-hidden />}
              </button>
            ))}
          </div>
        </div>

        <div className="fc-stage reveal" data-cursor={open ? "" : "Choose"}>
          <div className={`fv ${open ? "is-open" : ""}`}>
            <div className="fv-orbit">
              {pillars.map((p) => {
                const g = GEO[p.id];
                const filled = goal?.pillar === p.id;
                return (
                  <div key={p.id} className="fv-slot" style={{ left: `${g.cx}%`, top: `${g.cy}%` }}>
                    <button
                      type="button"
                      className={`fv-circle fv-${p.id} ${filled ? "is-filled" : ""} ${focus === p.id ? "is-hot" : ""}`}
                      style={circleStyle(p.id)}
                      onPointerEnter={() => setHot(p.id)}
                      onPointerLeave={() => setHot(null)}
                      onClick={() => choose(finder.goals.find((x) => x.pillar === p.id)!.id)}
                      aria-label={`${p.word}: ${p.circle}`}
                      tabIndex={open ? -1 : 0}
                    >
                      <span className="fv-float">
                        <span className="fv-label">
                          <strong>{p.word}</strong>
                          <small>{p.circle}</small>
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
              <span className="fv-core" aria-hidden />
            </div>

            {/* the chosen circle morphs into the result card */}
            <div className="fv-card" style={{ ["--cx" as string]: `${geo.cx}%`, ["--cy" as string]: `${geo.cy}%` }} aria-live="polite" aria-hidden={!open}>
              {goal && pillar && (
                <>
                  <div className="fv-card-media" key={goal.id}>
                    {goal.media.video ? <LoopVideo id={goal.media.video} play={open} /> : <Picture id={goal.media.photo!} alt={goal.media.alt ?? ""} sizes="(min-width: 1024px) 24vw, 80vw" />}
                  </div>
                  <div className="fv-card-body">
                    <p className="fc-circle">
                      Your circle: <strong>{pillar.word}</strong> · {pillar.circle}
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
                    <div className="fv-card-actions">
                      <Button onClick={() => scrollToTarget("#book")}>{finder.cta}</Button>
                      <button type="button" className="fv-back" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                        ← All circles
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
