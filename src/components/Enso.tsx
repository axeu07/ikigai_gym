/**
 * Ensō: a brush circle drawn as an open arc with a rough, inky edge (SVG displacement filter).
 * `draw` animates the stroke in with CSS (class .enso-draw); reduced motion shows it complete.
 */
import { useId } from "react";

export const ENSO_PATH = "M70 15.4 A40 40 0 1 1 60.4 11.4";

export default function Enso({ className = "", draw = false, strokeWidth = 7, title }: { className?: string; draw?: boolean; strokeWidth?: number; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className={`enso ${draw ? "enso-draw" : ""} ${className}`} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <filter id={`brush-${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
        </filter>
      </defs>
      <g filter={`url(#brush-${id})`} fill="none" stroke="currentColor" strokeLinecap="round">
        <path className="enso-main" d={ENSO_PATH} strokeWidth={strokeWidth} pathLength={1} />
        <path className="enso-dry" d="M67 17 A37 37 0 1 1 58 13.6" strokeWidth={strokeWidth * 0.28} opacity="0.55" pathLength={1} />
      </g>
    </svg>
  );
}
