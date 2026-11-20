/**
 * Typographic IKIGAI wordmark with a small ensō and a red sun dot.
 * TO CONFIRM: swap for the client's real logo file once supplied (set REAL_LOGO to its /public path).
 */
import Enso from "./Enso";

const REAL_LOGO: string | null = null;

export default function Logo({ className = "", sub = true }: { className?: string; sub?: boolean }) {
  if (REAL_LOGO) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={REAL_LOGO} alt="IKIGAI Fitness Club" className={`logo-img ${className}`} />;
  }
  return (
    <span className={`logo ${className}`} aria-label="IKIGAI Fitness Club" role="img">
      <span className="logo-mark" aria-hidden>
        <Enso strokeWidth={9} />
        <span className="logo-dot" />
      </span>
      <span className="logo-text" aria-hidden>
        <span className="logo-word">IKIGAI</span>
        {sub && <span className="logo-sub">Fitness Club</span>}
      </span>
    </span>
  );
}
