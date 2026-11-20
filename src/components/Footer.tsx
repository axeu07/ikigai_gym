/** Footer: hills silhouette + ensō, address, hours, socials and links. */
import { contact, footer, fullAddress, hours, nav, site, telLink, waLink } from "@/lib/content";
import Enso from "./Enso";
import Hills from "./Hills";
import Logo from "./Logo";
import { Confirm } from "./ui";

export default function Footer() {
  return (
    <footer className="footer">
      <Hills className="footer-hills" />
      <div className="wrap footer-grid">
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
        <div>
          <h2 className="footer-h">Follow</h2>
          <ul className="footer-links">
            <li>
              <a href={contact.instagram.value.url} target="_blank" rel="noopener noreferrer">
                Instagram {contact.instagram.value.handle}
              </a>
            </li>
            <li>
              <a href={contact.facebook.value.url} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
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
