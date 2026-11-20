/**
 * Footer: hills silhouette (parallax), then brand / address / hours and, on the same row, an outline
 * "IKIGAI" that fills with ember as you reach the bottom (scrubbed in <Effects />, transform only) with
 * the four contact rings beside it (FooterRings: they roll out to the right, under the map), then links.
 */
import { contact, footer, fullAddress, hours, nav, site, telLink } from "@/lib/content";
import Enso from "./Enso";
import FooterRings from "./FooterRings";
import Hills from "./Hills";
import Logo from "./Logo";
import Visit from "./Visit";
import { Confirm } from "./ui";

export default function Footer() {
  return (
    <footer className="footer">
      <Visit />
      <div className="ft-hero">
        <div className="ft-hills" data-ft-hills>
          <Hills className="footer-hills" />
        </div>
      </div>
      <div className="wrap footer-grid ft-grid">
        <div className="footer-brand">
          <Logo />
          <p className="footer-line">{footer.line}</p>
          <p className="footer-meaning" lang="ja">
            {footer.meaning}
          </p>
        </div>
        <div>
          <h2 className="footer-h">Visit</h2>
          <p>{fullAddress}</p>
          <p>
            <a href={telLink}>{contact.phoneDisplay}</a>
          </p>
        </div>
        <div>
          <h2 className="footer-h">Hours</h2>
          <p>
            {hours.weekdays.days} · {hours.weekdays.label} <Confirm confirmed={hours.weekdays.confirmed} />
          </p>
          <p className="muted">{hours.sunday.label}</p>
        </div>
        <div className="ft-mark">
          <div className="ft-word" aria-hidden>
            <span className="ft-word-outline">IKIGAI</span>
            <span className="ft-word-fill" data-ft-fill>
              <span className="ft-word-fill-inner" data-ft-fill-inner>
                IKIGAI
              </span>
            </span>
          </div>
          <FooterRings />
        </div>
        <nav aria-label="Footer" className="footer-nav">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href={nav.cta.href}>{nav.cta.label}</a>
        </nav>
      </div>
      <div className="wrap footer-base">
        <Enso className="footer-enso" strokeWidth={5} />
        <p>
          © {new Date().getFullYear()} {site.name}, {site.city}. Website preview: details marked TO CONFIRM are awaiting confirmation.
        </p>
      </div>
    </footer>
  );
}
