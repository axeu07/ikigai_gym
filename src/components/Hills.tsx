/** Mussoorie-hills silhouette (three ridges, as seen from Rajpur Road) with an optional rising red sun. */
export default function Hills({ className = "", sun = true }: { className?: string; sun?: boolean }) {
  return (
    <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" className={`hills ${className}`} aria-hidden>
      {sun && <circle className="hills-sun" cx="980" cy="210" r="120" />}
      <path className="ridge ridge-3" d="M0 220 C120 180 210 150 320 170 S520 120 640 140 S860 90 980 130 S1220 110 1320 150 S1440 160 1440 160 V360 H0Z" />
      <path className="ridge ridge-2" d="M0 260 C90 230 200 220 300 236 S480 200 600 220 S780 190 900 214 S1110 196 1220 226 S1380 214 1440 222 V360 H0Z" />
      <path className="ridge ridge-1" d="M0 300 C140 280 260 290 380 284 S620 262 760 280 S1000 266 1140 286 S1340 278 1440 290 V360 H0Z" />
    </svg>
  );
}
