/** Two ink-brush bands crossing the page with drifting words. CSS-only marquee; static under reduced motion. */
import { bands } from "@/lib/content";
import "./bands.css";

export function Band({ words, tone }: { words: readonly string[]; tone: "sun" | "paper" }) {
  const row = [...words, ...words];
  return (
    <div className={`band band-${tone}`} data-skew>
      <div className="band-track">
        {[0, 1].map((k) => (
          <p key={k} className="band-row" aria-hidden={k === 1 || undefined}>
            {row.map((w, i) => (
              <span key={i}>
                {w}
                <i aria-hidden>●</i>
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}

/** A single infinite marquee band (used between sections). */
export function Marquee({ words, tone = "sun" }: { words: readonly string[]; tone?: "sun" | "paper" }) {
  return (
    <div className="bands bands-single" role="presentation">
      <Band words={words} tone={tone} />
    </div>
  );
}

export default function BrushBands() {
  return (
    <div className="bands" role="presentation">
      <Band words={bands.a} tone="sun" />
      <Band words={bands.b} tone="paper" />
    </div>
  );
}

/**
 * A quiet transition between sections in place of a marquee: 間 (ma, a pause). An ember brush stroke
 * draws outward from a small ensō as it scrolls into view (CSS scroll-driven where supported, static
 * otherwise and under reduced motion).
 */
export function Seam() {
  return (
    <div className="seam" role="presentation">
      <span className="seam-line seam-line-l" />
      <span className="seam-mark">
        <svg viewBox="0 0 40 40" aria-hidden>
          <path d="M33 13a15 15 0 1 1-6.5-6.8" />
        </svg>
        <span className="jp">間</span>
      </span>
      <span className="seam-line seam-line-r" />
    </div>
  );
}
