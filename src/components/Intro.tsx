"use client";
/**
 * Ensō intro: the brush circle paints itself, the red sun fills its centre, then "IKIGAI" + 生き甲斐 fade in.
 * Plays once per session (see lib/intro.ts), skippable (button, Esc, click), instant under reduced motion.
 * Always dispatches INTRO_DONE so the hero can start.
 */
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { INTRO_DONE, INTRO_KEY } from "@/lib/intro";
import Enso from "./Enso";

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (html.dataset.intro !== "pending" || !el) {
      setActive(false);
      return;
    }
    html.dataset.intro = "running";
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        /* private mode: the intro may replay, which is fine */
      }
      delete html.dataset.intro;
      window.dispatchEvent(new Event(INTRO_DONE));
      setActive(false);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      finish();
      return;
    }

    const main = el.querySelector(".enso-main");
    const dry = el.querySelector(".enso-dry");
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo([main, dry], { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.12 })
      .fromTo(".intro-sun", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }, "-=0.35")
      .fromTo(".intro-word", { opacity: 0, y: 18, letterSpacing: "0.5em" }, { opacity: 1, y: 0, letterSpacing: "0.18em", duration: 0.8, ease: "power3.out" }, "-=0.2")
      .fromTo(".intro-jp", { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.5")
      .to(el, { opacity: 0, duration: 0.6, ease: "power2.in", delay: 0.5 });

    const skip = () => {
      tl.kill();
      gsap.to(el, { opacity: 0, duration: 0.3, onComplete: finish });
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    el.addEventListener("click", skip);
    return () => {
      tl.kill();
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("click", skip);
      finish();
    };
  }, []);

  if (!active) return null;
  return (
    <div ref={root} className="intro" role="presentation">
      <div className="intro-mark">
        <Enso strokeWidth={6} />
        <span className="intro-sun" aria-hidden />
      </div>
      <p className="intro-word">IKIGAI</p>
      <p className="intro-jp" lang="ja">
        生き甲斐 <span lang="en">· a reason for being</span>
      </p>
      <button type="button" className="intro-skip">
        Skip intro
      </button>
    </div>
  );
}
