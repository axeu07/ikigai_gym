"use client";
/**
 * 04 道 Michi: the seven ways to train as large cards. Desktop (≥1024px, motion OK): the row pins and
 * scrolls horizontally. Mobile: a native swipe carousel (scroll-snap). Video cards play a muted preview
 * on hover or tap. A HUD shows the active card (01 / 07) and a progress bar; on desktop the card nearest
 * the centre zooms its image in (transform only). Then a SAMPLE weekly timetable with NOW / NEXT UP (IST).
 */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { programs, timetable, pillarById } from "@/lib/content";
import { istNow, toMinutes, to12h } from "@/lib/hours";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder, LoopVideo, Picture } from "./Media";
import { Tag } from "./ui";

export default function Programs() {
  const [picked, setDay] = useState<number | null>(null);
  const [now, setNow] = useState<{ day: number; mins: number } | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [cur, setCur] = useState(0);
  const total = programs.list.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  // mobile / reduced motion: native carousel → counter + bar from its scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = track.scrollWidth - track.clientWidth;
        if (max <= 0) return;
        const p = track.scrollLeft / max;
        barRef.current?.style.setProperty("transform", `scaleX(${p.toFixed(3)})`);
        setCur(Math.round(p * (total - 1)));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const cards = Array.from(track.children) as HTMLElement[];
        const zoomers = cards.map((c) => c.querySelector<HTMLElement>(".pg-media > *"));
        const setZoom = zoomers.map((z) => (z ? (gsap.quickSetter(z, "scale") as (v: number) => void) : () => {}));
        let centres: number[] = [];
        const measure = () => (centres = cards.map((c) => c.offsetLeft + c.offsetWidth / 2));
        measure();
        let last = -1;
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (st) => track.style.setProperty("will-change", st.isActive ? "transform" : "auto"),
            onRefresh: measure,
            onUpdate: (st) => {
              if (barRef.current) gsap.set(barRef.current, { scaleX: st.progress });
              const x = Number(gsap.getProperty(track, "x"));
              const mid = window.innerWidth / 2;
              let best = 0;
              let bestD = Infinity;
              centres.forEach((c, i) => {
                const d = Math.abs(c + x - mid);
                if (d < bestD) {
                  bestD = d;
                  best = i;
                }
                setZoom[i](1 + 0.14 * Math.max(0, 1 - d / mid));
              });
              if (best !== last) {
                last = best;
                setCur(best);
              }
            },
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { clearProps: "transform,willChange" });
          zoomers.forEach((z) => z && gsap.set(z, { clearProps: "transform" }));
        };
      });
      return () => mm.revert();
    },
    { scope: pinRef },
  );

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
  const nowIdx = isToday ? slots.findIndex((s) => now.mins >= toMinutes(s.time) && now.mins < toMinutes(s.time) + s.mins) : -1;
  const nextIdx = isToday ? slots.findIndex((s) => toMinutes(s.time) > now.mins) : -1;

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
    <Section id="programs" className="programs">
      <div className="pg-band pg-band-head">
        <div className="wrap">
          <SectionHead id="programs" title={programs.heading} sub={programs.sub} mega />
        </div>
      </div>

      <div ref={pinRef} className="pg-pin">
        <div className="pg-hud" aria-hidden>
          <span className="pg-count">
            <b>{pad(cur + 1)}</b> / {pad(total)}
          </span>
          <span className="pg-name">{programs.list[cur]?.name}</span>
          <span className="pg-bar">
            <span ref={barRef} />
          </span>
        </div>
        <ul ref={trackRef} className="pg-list" aria-label="Programs" data-cursor="Drag">
          {programs.list.map((p, i) => (
            <li
              key={p.name}
              className={`pg-card reveal tilt-card ${p.media?.video ? "has-video" : ""} ${preview === i ? "is-preview" : ""}`}
              style={{ ["--d" as string]: `${i * 60}ms` }}
              data-tilt
              data-cursor={p.media?.video ? "Play" : "View"}
              onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(i)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setPreview((v) => (v === i ? null : v))}
              onClick={() => p.media?.video && setPreview((v) => (v === i ? null : i))}
            >
              <div className="pg-media" data-skew>
                {p.media?.video ? (
                  <LoopVideo id={p.media.video} play={preview === i} />
                ) : p.media?.photo ? (
                  <Picture id={p.media.photo} alt={p.media.alt ?? ""} sizes="(min-width: 1024px) 22vw, 45vw" />
                ) : (
                  <InkPlaceholder label={`${p.name} photo`} />
                )}
              </div>
              <h3>
                <span className={`dot dot-${p.pillar}`} aria-hidden />
                {p.name}
              </h3>
              <p>{p.line}</p>
              <span className="pg-pillar">{pillarById(p.pillar).word}</span>
              {p.media?.video && <span className="pg-play" aria-hidden>{preview === i ? "Playing" : "Preview"}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="pg-band pg-band-tt">
      <div className="wrap">
        <div className="tt reveal">
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
                {now && now.day - 1 === i && <span className="tt-today">today</span>}
              </button>
            ))}
          </div>
          <ol id="tt-panel" role="tabpanel" aria-labelledby={`tt-tab-${day}`} className="tt-rows">
            {slots.map((s, i) => (
              <li key={`${s.time}-${s.name}`} className={`tt-row ${i === nowIdx ? "is-now" : ""} ${i === nextIdx && nowIdx === -1 ? "is-next" : ""}`}>
                <span className="tt-time">{to12h(s.time)}</span>
                <span className="tt-name">
                  <span className={`dot dot-${s.pillar}`} aria-hidden />
                  {s.name}
                </span>
                <span className="tt-mins">{s.mins} min</span>
                {i === nowIdx && <span className="tt-flag">Now</span>}
                {i === nextIdx && nowIdx === -1 && <span className="tt-flag tt-flag-next">Next up</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
      </div>
    </Section>
  );
}
