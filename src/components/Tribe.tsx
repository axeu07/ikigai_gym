"use client";
/**
 * 07 仲間 Nakama: community events (TO CONFIRM), a photo strip and the Instagram CTA, on light washi
 * paper so it breaks the run of dark sections.
 * Desktop (≥1024px, motion OK): the section pins and the photo strip travels sideways as you scroll,
 * like a trek, with a trail line from Rajpur Road to the hills filling underneath.
 * Smaller fine-pointer screens: drag the strip with inertia (transform only, soft edges).
 * Touch: native swipe. Click / tap opens a lightbox.
 */
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { useHorizontalPin } from "@/lib/useHorizontalPin";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";
import { contact, tribe } from "@/lib/content";
import Lightbox from "./Lightbox";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";
import { Confirm } from "./ui";
import Button from "./Button";

export default function Tribe() {
  const ig = contact.instagram;
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const pin = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const trail = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<number | null>(null);
  const n = tribe.strip.length;

  // pinned sideways journey (desktop), shared with Sensei / Proof / Plans
  const pinned = useHorizontalPin({ pin, viewport, track, onProgress: (p) => trail.current && gsap.set(trail.current, { scaleX: p }) });
  const drag = fine && !reduced && !pinned;

  // drag with inertia (fine pointer, not pinned)
  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!drag || !vp || !tr) return;
    let x = 0;
    let startX = 0;
    let startPos = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let moved = 0;
    let down = false;
    const setX = gsap.quickSetter(tr, "x", "px") as (v: number) => void;
    const min = () => Math.min(0, vp.clientWidth - tr.scrollWidth);
    const soft = (v: number) => (v > 0 ? v * 0.3 : v < min() ? min() + (v - min()) * 0.3 : v);

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      down = true;
      moved = 0;
      startX = lastX = e.clientX;
      lastT = performance.now();
      startPos = x;
      vel = 0;
      gsap.killTweensOf(tr);
      vp.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const now = performance.now();
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6 && !vp.hasPointerCapture(e.pointerId)) vp.setPointerCapture(e.pointerId);
      vel = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      x = soft(startPos + dx);
      setX(x);
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      vp.classList.remove("is-dragging");
      const target = gsap.utils.clamp(min(), 0, x + vel * 380);
      gsap.to(tr, { x: target, duration: 0.9, ease: "power3.out", onUpdate: () => (x = Number(gsap.getProperty(tr, "x"))) });
    };
    // a real drag shouldn't count as a click on the photo underneath
    const onClickCapture = (e: MouseEvent) => {
      if (moved > 6) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    vp.addEventListener("click", onClickCapture, true);
    return () => {
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      vp.removeEventListener("click", onClickCapture, true);
      gsap.set(tr, { clearProps: "transform" });
    };
  }, [drag]);

  const item = box !== null ? tribe.strip[box] : null;
  return (
    // the journey layout comes from a CSS media query (tail-motion.css), not from `pinned`, so it is in
    // place before the pin measures
    <Section id="tribe" className="tribe tribe-light">
      <div ref={pin} className="tb-pin hp-pin fx-pin">
        <div className="wrap tb-top hp-side">
          <SectionHead id="tribe" title={tribe.heading} sub={tribe.sub} />
          <ul className="tb-events">
            {tribe.events.map((e, i) => (
              <li key={e.name} className="reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
                <h3>
                  {e.name} <Confirm confirmed={e.confirmed} />
                </h3>
                <p>{e.line}</p>
              </li>
            ))}
          </ul>
          <div className="tb-follow reveal">
            <Button href={ig.value.url} external variant="ghost">
              {tribe.follow} · {ig.value.handle}
            </Button>
            <Confirm confirmed={ig.confirmed} />
          </div>
        </div>

        <div ref={viewport} className={`tb-viewport hp-viewport ${drag ? "is-draggable" : ""}`} data-cursor={drag ? "Drag" : undefined}>
          <ul ref={track} className="tb-strip hp-track" aria-label="Life at IKIGAI">
            {tribe.strip.map((m, i) => (
              <li key={m.caption} className="tb-frame reveal" style={{ ["--d" as string]: `${i * 70}ms`, ["--r" as string]: `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg` }}>
                <button type="button" className="tb-open" onClick={() => setBox(i)} aria-label={`Open photo: ${m.caption}`}>
                  <div className="tb-media" data-skew>
                    {m.video ? <LoopVideo id={m.video} /> : <Picture id={m.photo!} alt={m.alt ?? ""} sizes="(min-width: 1024px) 22vw, 70vw" />}
                  </div>
                  <p>{m.caption}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* trek trail: fills as the strip travels (desktop pin only) */}
        <div className="tb-trail" aria-hidden>
          <span>Rajpur Road</span>
          <i>
            <span ref={trail} className="tb-trail-fill" />
          </i>
          <span>The hills</span>
        </div>
      </div>

      <Lightbox
        open={item !== null}
        onClose={() => setBox(null)}
        onPrev={() => setBox((b) => (b === null ? b : (b - 1 + n) % n))}
        onNext={() => setBox((b) => (b === null ? b : (b + 1) % n))}
        caption={item?.caption ?? ""}
        counter={box !== null ? `${box + 1} / ${n}` : ""}
      >
        {item && (item.video ? <LoopVideo id={item.video} eager /> : <Picture id={item.photo!} alt={item.alt ?? ""} sizes="90vw" eager />)}
      </Lightbox>
    </Section>
  );
}
