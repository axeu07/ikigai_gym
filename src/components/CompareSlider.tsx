"use client";
/**
 * Before/after drag-compare. A native range input drives it (keyboard and screen readers work);
 * the "after" layer is clipped and the handle moves with transform. Both sides are placeholders
 * until consented member photos arrive.
 */
import { useId, useState, type ReactNode } from "react";

export default function CompareSlider({ before, after, label }: { before: ReactNode; after: ReactNode; label: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <div className="cmp" style={{ ["--pos" as string]: `${pos}%` }} data-cursor="Drag">
      <div className="cmp-layer cmp-before">{before}</div>
      <div className="cmp-layer cmp-after" aria-hidden>
        {after}
      </div>
      <div className="cmp-handle-track" aria-hidden>
        <span className="cmp-handle">
          <span>‹</span>
          <span>›</span>
        </span>
      </div>
      <span className="cmp-tag cmp-tag-before" aria-hidden>
        Before
      </span>
      <span className="cmp-tag cmp-tag-after" aria-hidden>
        After
      </span>
      <label htmlFor={id} className="sr-only">
        {label}: drag to compare before and after
      </label>
      <input id={id} className="cmp-range" type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} />
    </div>
  );
}
