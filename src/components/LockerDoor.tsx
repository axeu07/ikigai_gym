"use client";
/**
 * One wooden sento-style locker door (Restore section). Doors swing open by themselves when the
 * section comes into view (CSS, staggered); clicking a door closes / reopens it. The locker's contents
 * stay in the DOM the whole time, so screen readers and no-JS visitors always get them.
 */
import { useState } from "react";

type Props = { numeral: string; no: string; jp: string; name: string; controls: string; side: "l" | "r" };

export default function LockerDoor({ numeral, no, jp, name, controls, side }: Props) {
  const [shut, setShut] = useState(false);
  const [touched, setTouched] = useState(false);
  return (
    <button
      type="button"
      className={`lk-door lk-hinge-${side}`}
      data-shut={shut ? "true" : "false"}
      data-touched={touched || undefined}
      aria-expanded={!shut}
      aria-controls={controls}
      aria-label={`${shut ? "Open" : "Close"} locker ${no}: ${name}`}
      onClick={() => {
        setTouched(true);
        setShut((v) => !v);
      }}
    >
      <span className="lk-face" aria-hidden>
        <span className="lk-plate">
          <span className="jp">{numeral}</span>
          <span className="lk-plate-no">No. {no}</span>
        </span>
        <span className="lk-vent" />
        <span className="lk-kanji jp">{jp}</span>
        <span className="lk-name">{name}</span>
        <span className="lk-lock">
          <span className="lk-fuda">
            <span className="jp">{numeral}</span>
          </span>
        </span>
      </span>
      <span className="lk-back" aria-hidden />
    </button>
  );
}
