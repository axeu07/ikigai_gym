"use client";
/**
 * 05 癒し Iyashi: Restore, themed as a Japanese bathhouse (sento) locker room. The facilities live in
 * a wooden locker cabinet: each door carries a brass number plate, the facility's name in kanji and a
 * wooden key tag (fuda). The cafeteria is a hanging wooden menu board (oshinagaki) whose items and
 * prices are TO CONFIRM. Slow steam drifts behind everything.
 *
 * Desktop (≥1024px, motion OK): the section pins for about one screen of scroll. As you scroll, the
 * locker doors swing open one after another (scrubbed via a --p custom property per door), the steam
 * thickens and the menu board swings in on its cord. Clicking a door still shuts / reopens it.
 * Mobile / reduced motion: no pin; doors open in sequence on enter (CSS, restore-lockers.css).
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { restore } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder, Picture } from "./Media";
import { Tag } from "./ui";
import LockerDoor from "./LockerDoor";
import "./restore-lockers.css";

const NUMERALS = ["一", "二", "三", "四", "五", "六"];

export default function Restore() {
  const pin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = pin.current;
        const section = el?.closest("section");
        if (!el || !section) return;
        const doors = gsap.utils.toArray<HTMLElement>(".lk-door", el);
        const steam = el.querySelector(".steam");
        const menu = el.querySelector(".lk-menu");
        section.classList.add("rs-scrub");
        gsap.set(doors, { "--p": 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          // pinSpacing must be explicit: GSAP turns it off when the pin's parent is a flex container
          // (sections are display:flex on desktop), which let the next section slide over the pin
          scrollTrigger: { trigger: el, start: "top top", end: "+=110%", pin: true, pinSpacing: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
        });
        // doors: one after another, each with a soft swing
        doors.forEach((d, i) => tl.to(d, { "--p": 1, duration: 1, ease: "power2.inOut" }, 0.15 + i * 0.55));
        const end = 0.15 + (doors.length - 1) * 0.55 + 1;
        if (steam) tl.fromTo(steam, { opacity: 0.25, scale: 0.92 }, { opacity: 1, scale: 1.12, duration: end }, 0);
        if (menu) tl.fromTo(menu, { opacity: 0, y: -90, rotate: -16, transformOrigin: "50% -32px" }, { opacity: 1, y: 0, rotate: 0, duration: 1.1, ease: "back.out(2.2)" }, end - 1.2);
        // a short hold at the end so the open lockers can be read before the pin releases
        tl.to({}, { duration: 0.35 });

        return () => {
          section.classList.remove("rs-scrub");
          gsap.set(doors, { clearProps: "--p" });
          gsap.set([steam, menu].filter(Boolean), { clearProps: "all" });
        };
      });
      return () => mm.revert();
    },
    { scope: pin },
  );

  return (
    <Section id="restore" className="restore">
      <div ref={pin} className="rs-pin fx-pin">
        <div className="rs-warm" aria-hidden />
        <div className="steam" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="wrap rs-layout">
          <div className="rs-left">
            <SectionHead id="restore" title={restore.heading} sub={restore.sub} mega />
            <p className="rs-hygiene reveal">{restore.hygiene}</p>

            <div className="lk-menu reveal" style={{ ["--d" as string]: "240ms" }}>
              <svg className="lk-menu-cord" viewBox="0 0 200 34" aria-hidden>
                <path d="M10 34 100 4 190 34" />
                <circle cx="100" cy="4" r="4" />
              </svg>
              <p className="lk-menu-kicker">
                <span className="jp">お品書き</span> Menu · {restore.cafe.name}
              </p>
              <p className="lk-menu-line">{restore.cafe.line}</p>
              <ul className="lk-menu-rows" aria-label="Menu (to be confirmed)">
                {["Shakes", "Snacks", "Coffee"].map((r) => (
                  <li key={r} aria-hidden>
                    <span className="lk-menu-blank" />
                    <span className="lk-menu-dots" />
                    <span className="lk-menu-price">₹ —</span>
                  </li>
                ))}
              </ul>
              <p className="lk-menu-note">
                <Tag>TO CONFIRM</Tag> {restore.cafe.menuNote}
              </p>
            </div>
          </div>

          <div className="lk-cabinet reveal" style={{ ["--d" as string]: "120ms" }}>
            <p className="lk-sign" aria-hidden>
              <span className="jp">更衣室</span>
              <span>Locker room</span>
            </p>
            <ul className="lk-grid">
              {restore.items.map((it, i) => {
                const no = String(i + 1).padStart(2, "0");
                const inside = `locker-${it.id}`;
                return (
                  <li key={it.id} className="lk-cell" style={{ ["--i" as string]: i }}>
                    <div className="lk-inside" id={inside}>
                      <div className="lk-media">
                        {it.media?.photo ? <Picture id={it.media.photo} alt={it.media.alt ?? ""} sizes="(min-width: 1024px) 24vw, 90vw" /> : <InkPlaceholder label={`${it.name} photo`} />}
                      </div>
                      <h3>
                        {it.name} <span className="jp">{it.jp}</span>
                      </h3>
                      <p>{it.line}</p>
                    </div>
                    <LockerDoor numeral={NUMERALS[i] ?? no} no={no} jp={it.jp} name={it.name} controls={inside} side={i % 2 === 0 ? "l" : "r"} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
