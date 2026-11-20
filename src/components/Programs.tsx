"use client";
/**
 * 03 道 Michi: the seven ways to train as hanging-scroll (kakejiku) cards: wooden rods top and bottom,
 * a pasted paper strip (tanzaku) with the program in vertical kanji, and a daiji numeral. Desktop (≥1024px,
 * motion OK): heading on the left, the card rail on the right; the stage pins and the rail scrolls
 * horizontally inside its own window. Mobile: a native swipe carousel (scroll-snap). Video cards play a muted preview
 * on hover or tap. A HUD shows the active card (01 / 07) and a progress bar; on desktop the card nearest
 * the centre zooms its image in (transform only). The weekly timetable lives in 06 Sensei.
 */
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { programs, pillarById } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder, LoopVideo, Picture } from "./Media";
import "./programs-stage.css";

/** formal (daiji-style) numerals, as on old signboards */
const NUM = ["壱", "弐", "参", "肆", "伍", "陸", "漆", "捌", "玖"];

export default function Programs() {
  const [preview, setPreview] = useState<number | null>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
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
        barRef.current?.style.setProperty(
          "transform",
          `scaleX(${p.toFixed(3)})`,
        );
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
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          const pin = pinRef.current;
          const view = viewRef.current;
          if (!track || !pin || !view) return;
          const dist = () => Math.max(0, track.scrollWidth - view.clientWidth);
          const cards = Array.from(track.children) as HTMLElement[];
          const zoomers = cards.map((c) =>
            c.querySelector<HTMLElement>(".pg-media > *"),
          );
          const setZoom = zoomers.map((z) =>
            z
              ? (gsap.quickSetter(z, "scale") as (v: number) => void)
              : () => {},
          );
          let centres: number[] = [];
          const measure = () =>
            (centres = cards.map((c) => c.offsetLeft + c.offsetWidth / 2));
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
              onToggle: (st) =>
                track.style.setProperty(
                  "will-change",
                  st.isActive ? "transform" : "auto",
                ),
              onRefresh: measure,
              onUpdate: (st) => {
                if (barRef.current)
                  gsap.set(barRef.current, { scaleX: st.progress });
                const x = Number(gsap.getProperty(track, "x"));
                const mid = view.clientWidth / 2;
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
            zoomers.forEach(
              (z) => z && gsap.set(z, { clearProps: "transform" }),
            );
          };
        },
      );
      return () => mm.revert();
    },
    { scope: pinRef },
  );

  return (
    <Section id="programs" className="programs">
      <div ref={pinRef} className="pg-pin pg-stage">
        <div className="pg-intro">
          <SectionHead
            id="programs"
            title={programs.heading}
            sub={programs.sub}
            mega
          />
          <div className="pg-hud" aria-hidden>
            <span className="pg-count">
              <b>{pad(cur + 1)}</b> / {pad(total)}
            </span>
            <span className="pg-name">{programs.list[cur]?.name}</span>
            <span className="pg-bar">
              <span ref={barRef} />
            </span>
          </div>
        </div>
        <div ref={viewRef} className="pg-view">
          <ul
            ref={trackRef}
            className="pg-list"
            aria-label="Programs"
            data-cursor="Drag"
          >
            {programs.list.map((p, i) => (
              <li
                key={p.name}
                className={`pg-card reveal tilt-card ${p.media?.video ? "has-video" : ""} ${preview === i ? "is-preview" : ""}`}
                style={{ ["--d" as string]: `${i * 60}ms` }}
                data-tilt
                data-cursor={p.media?.video ? "Play" : "View"}
                onPointerEnter={(e) =>
                  e.pointerType === "mouse" && setPreview(i)
                }
                onPointerLeave={(e) =>
                  e.pointerType === "mouse" &&
                  setPreview((v) => (v === i ? null : v))
                }
                onClick={() =>
                  p.media?.video && setPreview((v) => (v === i ? null : i))
                }
              >
                <span className="pg-rod pg-rod-t" aria-hidden />
                <div className="pg-media" data-skew>
                  {p.media?.video ? (
                    <LoopVideo id={p.media.video} play={preview === i} />
                  ) : p.media?.photo ? (
                    <Picture
                      id={p.media.photo}
                      alt={p.media.alt ?? ""}
                      sizes="(min-width: 1024px) 22vw, 45vw"
                    />
                  ) : (
                    <InkPlaceholder label={`${p.name} photo`} />
                  )}
                  <span className="pg-tanzaku jp" aria-hidden>
                    {p.jp}
                  </span>
                </div>
                <p className="pg-no" aria-hidden>
                  <span className="jp">{NUM[i]}</span> {pad(i + 1)}
                </p>
                <h3>
                  <span className={`dot dot-${p.pillar}`} aria-hidden />
                  {p.name}
                </h3>
                <p>{p.line}</p>
                <span className="pg-pillar">{pillarById(p.pillar).word}</span>
                {p.media?.video && (
                  <span className="pg-play" aria-hidden>
                    {preview === i ? "Playing" : "Preview"}
                  </span>
                )}
                <span className="pg-rod pg-rod-b" aria-hidden />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
