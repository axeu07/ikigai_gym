"use client";
/**
 * Four-circle progress indicator (bottom-left): JOY / POWER / RESTORE / TRIBE fill as you scroll
 * through their sections, and the red centre lights up once you reach the booking section.
 * Each circle is a button that jumps to its first section.
 */
import { useEffect, useRef } from "react";
import { ScrollTrigger, scrollToTarget } from "@/lib/motion";
import { pillarById, progressMap } from "@/lib/content";

// 2x2 overlapping layout inside a 64x64 box
const POS: Record<string, [number, number]> = { joy: [24, 24], power: [40, 24], tribe: [24, 40], restore: [40, 40] };
const R = 13;
const C = 2 * Math.PI * R;

export default function CircleProgress() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const triggers: ScrollTrigger[] = [];
    for (const m of progressMap) {
      const from = document.getElementById(m.from);
      const to = document.getElementById(m.to);
      const ring = el.querySelector<SVGCircleElement>(`[data-ring="${m.pillar}"]`);
      if (!from || !to || !ring) continue;
      triggers.push(
        ScrollTrigger.create({
          trigger: from,
          start: "top 60%",
          endTrigger: to,
          end: "bottom 60%",
          onUpdate: (st) => ring.style.setProperty("--p", st.progress.toFixed(3)),
          onToggle: (st) => ring.closest("g")?.classList.toggle("is-active", st.isActive),
        }),
      );
    }
    const book = document.getElementById("book");
    if (book) triggers.push(ScrollTrigger.create({ trigger: book, start: "top 70%", onToggle: () => {}, onEnter: () => el.classList.add("is-centre"), onLeaveBack: () => el.classList.remove("is-centre") }));
    const hero = document.getElementById("philosophy");
    if (hero) triggers.push(ScrollTrigger.create({ trigger: hero, start: "top 90%", onEnter: () => el.classList.add("is-shown"), onLeaveBack: () => el.classList.remove("is-shown") }));
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div ref={root} className="circle-progress" role="navigation" aria-label="Section progress">
      <svg viewBox="0 0 64 64" aria-hidden>
        {progressMap.map((m) => {
          const [cx, cy] = POS[m.pillar];
          return (
            <g key={m.pillar}>
              <circle cx={cx} cy={cy} r={R} className="cp-track" />
              <circle cx={cx} cy={cy} r={R} className="cp-fill" data-ring={m.pillar} strokeDasharray={C} transform={`rotate(-90 ${cx} ${cy})`} />
            </g>
          );
        })}
        <circle cx="32" cy="32" r="4" className="cp-centre" />
      </svg>
      <ul>
        {progressMap.map((m) => (
          <li key={m.pillar}>
            <button type="button" onClick={() => scrollToTarget(`#${m.from}`)}>
              {pillarById(m.pillar).word}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
