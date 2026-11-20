"use client";
/**
 * SAMPLE weekly timetable with NOW / NEXT UP (IST). Rendered inside the pinned 06 先生 Sensei screen,
 * next to the coach cards (left column on desktop, after the cards on mobile).
 */
import { useEffect, useState, type KeyboardEvent } from "react";
import { timetable } from "@/lib/content";
import { istNow, toMinutes, to12h } from "@/lib/hours";
import { Tag } from "./ui";

export default function Timetable({ className = "" }: { className?: string }) {
  const [picked, setDay] = useState<number | null>(null);
  const [now, setNow] = useState<{ day: number; mins: number } | null>(null);

  useEffect(() => {
    const tick = () => setNow(istNow());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // default tab: today in IST (Sunday → Monday) until the visitor picks a day
  const day = picked ?? (now && now.day !== 0 ? now.day - 1 : 0);
  const slots = timetable.schedule[day];
  const isToday = now !== null && now.day !== 0 && now.day - 1 === day;
  const nowIdx = isToday
    ? slots.findIndex(
        (s) =>
          now.mins >= toMinutes(s.time) &&
          now.mins < toMinutes(s.time) + s.mins,
      )
    : -1;
  const nextIdx = isToday
    ? slots.findIndex((s) => toMinutes(s.time) > now.mins)
    : -1;

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = timetable.days.length;
    let to = -1;
    if (e.key === "ArrowRight") to = (day + 1) % n;
    if (e.key === "ArrowLeft") to = (day - 1 + n) % n;
    if (e.key === "Home") to = 0;
    if (e.key === "End") to = n - 1;
    if (to < 0) return;
    e.preventDefault();
    setDay(to);
    document.getElementById(`tt-tab-${to}`)?.focus();
  };

  return (
    <div className={`tt ${className}`}>
      <div className="tt-head">
        <h3 className="h-sub">This week</h3>
        <p className="tt-note">
          <Tag>SAMPLE</Tag> {timetable.note}
        </p>
      </div>
      <div role="tablist" aria-label="Day" className="tt-tabs">
        {timetable.days.map((d, i) => (
          <button
            key={d}
            id={`tt-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === day}
            aria-controls="tt-panel"
            tabIndex={i === day ? 0 : -1}
            className={`tt-tab ${i === day ? "is-on" : ""}`}
            onClick={() => setDay(i)}
            onKeyDown={onTabKey}
          >
            {d}
            {now && now.day - 1 === i && (
              <span className="tt-today">today</span>
            )}
          </button>
        ))}
      </div>
      <ol
        id="tt-panel"
        role="tabpanel"
        aria-labelledby={`tt-tab-${day}`}
        className="tt-rows"
      >
        {slots.map((s, i) => (
          <li
            key={`${s.time}-${s.name}`}
            className={`tt-row ${i === nowIdx ? "is-now" : ""} ${i === nextIdx && nowIdx === -1 ? "is-next" : ""}`}
          >
            <span className="tt-time">{to12h(s.time)}</span>
            <span className="tt-name">
              <span className={`dot dot-${s.pillar}`} aria-hidden />
              {s.name}
            </span>
            <span className="tt-mins">{s.mins} min</span>
            {i === nowIdx && <span className="tt-flag">Now</span>}
            {i === nextIdx && nowIdx === -1 && (
              <span className="tt-flag tt-flag-next">Next up</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
