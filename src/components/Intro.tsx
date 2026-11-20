"use client";
/**
 * Intro (~2.1 s, once per session, skippable with the button, Esc or a click):
 *   0–0.9s   four rings fly in from the corners, spinning
 *   0.9–1.2s they lock into the Venn
 *   1.2–1.5s the core ignites (ember flash), "IKIGAI" punches in, the page lights (`.lit` + IGNITE)
 *   1.5–2.1s FLIP: the Venn moves/scales onto the hero's Venn (measured with getBoundingClientRect)
 *            while the black backdrop fades and the page comes up around it.
 * Transform/opacity only. Reduced motion: skips straight to the final state.
 */
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { IGNITE, INTRO_DONE, INTRO_KEY } from "@/lib/intro";
import Venn from "./Venn";

const CORNERS: Record<string, [number, number, number]> = { joy: [-1, -1, -320], power: [1, -1, 320], tribe: [-1, 1, 320], restore: [1, 1, -320] };

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (html.dataset.intro !== "pending" || !el) {
      html.classList.add("lit");
      setActive(false);
      return;
    }
    html.dataset.intro = "running";
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let finished = false;
    const ignite = () => {
      if (html.classList.contains("lit")) return;
      html.classList.add("lit");
      window.dispatchEvent(new Event(IGNITE));
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        /* private mode: the intro may replay, which is fine */
      }
      ignite();
      delete html.dataset.intro;
      window.dispatchEvent(new Event(INTRO_DONE));
      setActive(false);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const q = gsap.utils.selector(el);
    const venn = q(".venn")[0] as HTMLElement;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // FLIP target: the hero's Venn, measured at the moment the move starts (so resizes are respected)
    const flip = () => {
      const target = document.querySelector<HTMLElement>(".hero-venn");
      const from = venn.getBoundingClientRect();
      const to = target?.getBoundingClientRect();
      if (!to || to.width === 0 || to.bottom < 0 || to.top > window.innerHeight) return { x: 0, y: 0, scale: 0.6, opacity: 0 };
      return {
        x: to.left + to.width / 2 - (from.left + from.width / 2),
        y: to.top + to.height / 2 - (from.top + from.height / 2),
        scale: to.width / from.width,
        opacity: 1,
      };
    };

    const tl = gsap.timeline({ onComplete: finish, defaults: { force3D: true } });
    q(".v-ring").forEach((r) => {
      const [sx, sy, rot] = CORNERS[(r as HTMLElement).dataset.p ?? "joy"];
      tl.fromTo(r, { x: sx * vw * 0.6, y: sy * vh * 0.6, rotate: rot, opacity: 0 }, { x: 0, y: 0, rotate: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0);
    });
    tl.fromTo(venn, { scale: 1.08 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 0.9)
      .fromTo(q(".v-core"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.4)" }, 1.2)
      .fromTo(q(".v-flash"), { scale: 0.3, opacity: 0.95 }, { scale: 2.6, opacity: 0, duration: 0.45, ease: "power2.out" }, 1.2)
      .fromTo(q(".v-name"), { scale: 1.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: "power4.out" }, 1.26)
      .call(ignite, [], 1.3)
      .add(() => {
        const f = flip();
        gsap.to(venn, { x: f.x, y: f.y, scale: f.scale, opacity: f.opacity, duration: 0.6, ease: "power3.inOut" });
      }, 1.5)
      .to(q(".intro-bg"), { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 1.5)
      .to(q(".intro-skip"), { opacity: 0, duration: 0.2 }, 1.5)
      .to({}, { duration: 0.6 }, 1.5);

    const skip = () => {
      tl.kill();
      gsap.killTweensOf(venn);
      gsap.to(el, { opacity: 0, duration: 0.25, onComplete: finish });
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    const onResize = () => skip();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    el.addEventListener("click", skip);
    return () => {
      tl.kill();
      gsap.killTweensOf([venn, el]);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("click", skip);
      // Don't finish here. React StrictMode (dev) mounts, cleans up and mounts again: finishing in this
      // cleanup marked the intro seen, removed data-intro and fired INTRO_DONE before anything played,
      // so the second mount bailed out. Hand the state back instead so the next mount replays it.
      if (!finished) html.dataset.intro = "pending";
    };
  }, []);

  if (!active) return null;
  return (
    <div ref={root} className="intro" role="presentation">
      <div className="intro-bg" />
      <div className="intro-stage">
        <Venn />
      </div>
      <button type="button" className="intro-skip">
        Skip intro
      </button>
    </div>
  );
}
