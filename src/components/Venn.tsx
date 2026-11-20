/**
 * The ikigai Venn: four rings (HTML, so every transform stays on the compositor) around an ember core
 * with "IKIGAI". Shared by the intro and the hero so the intro can FLIP onto the hero copy.
 *
 * Each ring carries its own element (CSS-only, transform/opacity animation, styles in venn-fx.css):
 *   POWER   → fire: flame tongues licking around the ring + a rotating ember glow
 *   RESTORE → water: a rotating aqua shimmer, ripples and a wave sloshing inside the ring
 *   TRIBE   → ink: Japanese words orbiting the ring on a text path (生き甲斐 · 仲間 · 好き · 力 · 癒し)
 *   JOY     → sakura: petals drifting around the ring
 * When the rings combine, an orb of each element rushes into the centre and fuses into the ember core,
 * which then reads IKIGAI (in the intro this lines up with the ignite; on the hero it repeats slowly).
 */
import { useId } from "react";
import { pillars, type PillarId } from "@/lib/content";
import "./venn-fx.css";

const FLAMES = 12;
const PETALS = 7;
const KANJI = "生き甲斐 ・ 仲間 ・ 好き ・ 力 ・ 癒し ・ 生き甲斐 ・ 仲間 ・ 好き ・ 力 ・ 癒し ・";

function Fire() {
  return (
    <span className="vfx vfx-fire">
      <span className="vfx-fire-glow" />
      {Array.from({ length: FLAMES }, (_, i) => (
        <span key={i} className="flame" style={{ ["--a" as string]: `${(360 / FLAMES) * i}deg`, ["--fd" as string]: `${(i % 4) * -0.17}s`, ["--fs" as string]: `${0.75 + (i % 3) * 0.18}` }}>
          <i />
        </span>
      ))}
    </span>
  );
}

function Water() {
  return (
    <span className="vfx vfx-water">
      <span className="vfx-water-shimmer" />
      <span className="vfx-water-inner">
        <span className="ripple-w" />
        <span className="ripple-w" />
        <span className="ripple-w" />
        <span className="vfx-wave">
          <svg viewBox="0 0 200 40" preserveAspectRatio="none">
            <path d="M0 20 Q 12.5 8 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20 V40 H0 Z" />
          </svg>
          <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="vfx-wave-back">
            <path d="M0 22 Q 12.5 12 25 22 T 50 22 T 75 22 T 100 22 T 125 22 T 150 22 T 175 22 T 200 22 V40 H0 Z" />
          </svg>
        </span>
      </span>
    </span>
  );
}

function Ink() {
  const id = useId().replace(/:/g, "");
  return (
    <span className="vfx vfx-ink">
      <svg viewBox="0 0 100 100" className="vfx-kanji">
        <defs>
          <path id={`kp-${id}`} d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
        </defs>
        <text lang="ja">
          <textPath href={`#kp-${id}`} textLength="262" lengthAdjust="spacing">
            {KANJI}
          </textPath>
        </text>
      </svg>
    </span>
  );
}

function Sakura() {
  return (
    <span className="vfx vfx-sakura">
      <span className="vfx-sakura-orbit">
        {Array.from({ length: PETALS }, (_, i) => (
          <span key={i} className="petal-arm" style={{ ["--a" as string]: `${(360 / PETALS) * i}deg` }}>
            <i style={{ ["--pd" as string]: `${i * -0.6}s` }} />
          </span>
        ))}
      </span>
    </span>
  );
}

const FX: Record<PillarId, () => React.JSX.Element> = { power: Fire, restore: Water, tribe: Ink, joy: Sakura };

export default function Venn({ className = "", word = true }: { className?: string; word?: boolean }) {
  return (
    <div className={`venn ${className}`} aria-hidden>
      {pillars.map((p) => {
        const Effect = FX[p.id];
        return (
          <div key={p.id} className={`v-ring v-${p.id}`} data-p={p.id}>
            <Effect />
            <span className="v-notch" />
            <span className="v-word">{p.word}</span>
          </div>
        );
      })}
      {/* one orb per element; they rush into the core when the rings combine */}
      {pillars.map((p) => (
        <span key={p.id} className={`v-orb v-orb-${p.id}`} />
      ))}
      <div className="v-flash" />
      <div className="v-core" />
      {word && <span className="v-name">IKIGAI</span>}
    </div>
  );
}
