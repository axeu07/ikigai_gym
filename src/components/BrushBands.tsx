/** Two ink-brush bands crossing the page with drifting words. CSS-only marquee; static under reduced motion. */
import { bands } from "@/lib/content";

export function Band({ words, tone }: { words: readonly string[]; tone: "sun" | "paper" }) {
  const row = [...words, ...words];
  return (
    <div className={`band band-${tone}`}>
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
