"use client";
/**
 * 02 生き甲斐 Four circles. Desktop (≥1024px, motion OK): the section pins and each circle
 * (Joy → Power → Tribe → Restore) highlights in turn with its footage and one line, then the
 * ember centre lights. Mobile / reduced motion: no pin, all four shown as a list.
 */
import { useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { philosophy, pillars } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";
import Venn from "./Venn";
import "./venn-travel.css";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const noSubscribe = () => () => {};

export default function Philosophy() {
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [met, setMet] = useState(false);
  const [pinned, setPinned] = useState(false);
  const travel = useRef<HTMLDivElement>(null);
  // true on the client only (portal target), without a setState-in-effect
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);

  useGSAP(
    () => {
      const el = pin.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        setPinned(true);
        let last = -1;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "+=260%",
          pin: true,
          anticipatePin: 1,
          onUpdate: (s) => {
            const i = Math.min(pillars.length - 1, Math.floor(s.progress * (pillars.length + 0.6)));
            if (i !== last) {
              last = i;
              setActive(i);
            }
            setMet(s.progress > 0.9);
          },
        });
        return () => {
          st.kill();
          setPinned(false);
        };
      });
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        const st = ScrollTrigger.create({ trigger: el, start: "top 60%", once: true, onEnter: () => setMet(true) });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: pin },
  );

  // Hero Venn → stage: a fixed copy flies from the hero ring to the four photo circles, shrinking
  // mid-way ("minimise"), rolling once, then growing onto the stage ("maximise").
  // Kept SEPARATE from the pin above: it waits for the portal (mounted), and re-creating the pin
  // after the other sections' triggers would break every scroll position below this section.
  useGSAP(
    () => {
      const el = pin.current;
      const ov = travel.current;
      if (!el || !ov) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const src = document.querySelector<HTMLElement>(".hero .hero-venn");
        const stage = el.querySelector<HTMLElement>(".ph-stage");
        if (!src || !stage) return;
        {
          const ease = gsap.parseEase("power2.inOut");
          const render = (p: number) => {
            if (p <= 0.001 || p >= 0.999) {
              ov.style.visibility = "hidden";
              src.style.visibility = "";
              stage.style.setProperty("--arrive", p >= 0.999 ? "1" : "0");
              return;
            }
            const a = src.getBoundingClientRect();
            const b = stage.getBoundingClientRect();
            const e = ease(p);
            const w = a.width;
            const scale = (1 + (b.width / w - 1) * e) * (1 - 0.55 * Math.sin(Math.PI * p));
            const cx = a.left + w / 2 + (b.left + b.width / 2 - (a.left + w / 2)) * e;
            const cy = a.top + a.height / 2 + (b.top + b.height / 2 - (a.top + a.height / 2)) * e;
            ov.style.width = `${w}px`;
            ov.style.visibility = "visible";
            src.style.visibility = "hidden";
            gsap.set(ov, { x: cx - w / 2, y: cy - w / 2, scale, rotation: 360 * e, opacity: 1 - clamp01((p - 0.86) / 0.13) });
            stage.style.setProperty("--arrive", String(clamp01((p - 0.72) / 0.24)));
          };
          const fly = ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            end: "top top",
            onUpdate: (s) => render(s.progress),
            onRefresh: (s) => render(s.progress),
          });
          return () => {
            fly.kill();
            src.style.visibility = "";
            ov.style.visibility = "hidden";
            stage.style.removeProperty("--arrive");
          };
        }
      });
      return () => mm.revert();
    },
    { dependencies: [mounted], revertOnUpdate: true },
  );

  const p = pillars[active];

  return (
    <Section id="philosophy" className={`philosophy ${pinned ? "is-pinned" : ""}`}>
      <div ref={pin} className="ph-pin">
        <div className="wrap ph-grid">
          <div className="ph-left">
            <SectionHead id="philosophy" title={philosophy.heading} sub={philosophy.intro} mega />
            {/* pinned: one pillar at a time */}
            <div className="ph-focus" aria-live="polite">
              <p className="ph-step">
                <span className="ph-count">0{active + 1}</span> / 04 · {p.circle}
              </p>
              <p className="ph-word" key={p.id}>
                {p.word} <span lang="ja" className="jp">{p.jp}</span>
              </p>
              <p className="ph-line">{p.line}</p>
              <ol className="ph-dots" aria-hidden>
                {pillars.map((x, i) => (
                  <li key={x.id} className={i === active ? "is-on" : ""} />
                ))}
              </ol>
            </div>
          </div>

          <div className={`ph-stage ${met ? "is-met" : ""}`}>
            {pillars.map((x, i) => (
              <figure key={x.id} className={`pc pc-${x.id} ${pinned ? (i === active ? "is-on" : "is-off") : ""}`}>
                <div className="pc-media">
                  {x.media.video ? <LoopVideo id={x.media.video} play={!pinned || i === active} /> : <Picture id={x.media.photo!} alt={x.media.alt ?? ""} sizes="320px" />}
                </div>
                <figcaption className="pc-label">
                  <span className="pc-word">{x.word}</span>
                  <span className="pc-circle">{x.circle}</span>
                </figcaption>
              </figure>
            ))}
            <div className="ph-centre" aria-hidden>
              <span>{philosophy.centre.word}</span>
            </div>
          </div>
        </div>
      </div>

      {/* unpinned (mobile / reduced motion): every pillar listed */}
      <div className="wrap">
        <ol className="ph-list">
          {pillars.map((x, i) => (
            <li key={x.id} className="reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <p className="ph-li-head">
                <span className={`dot dot-${x.id}`} aria-hidden />
                <strong>{x.word}</strong>
                <span className="ph-li-circle">{x.circle}</span>
                <span lang="ja" className="jp ph-li-jp">
                  {x.jp}
                </span>
              </p>
              <p className="ph-li-line">{x.line}</p>
            </li>
          ))}
          <li className="ph-centre-line reveal">
            <span className="dot dot-sun" aria-hidden />
            <p>
              <strong>Ikigai.</strong> {philosophy.centre.line}
            </p>
          </li>
        </ol>
        <p className="ph-sign-note reveal">{philosophy.signNote}</p>
      </div>

      {/* the hero Venn in flight (desktop + motion OK); hidden unless the hand-off is mid-scroll */}
      {mounted &&
        createPortal(
          <div ref={travel} className="venn-travel" aria-hidden>
            <Venn className="hero-venn" />
          </div>,
          document.body,
        )}
    </Section>
  );
}
