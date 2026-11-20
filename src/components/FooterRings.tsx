"use client";
/**
 * Footer contact mark: the four-circle IKIGAI logo sits right beside the footer wordmark. When the
 * visitor reaches the end of the page, the overlapping rings break apart and roll to the right (under
 * the map) into a row of four separate rings, one per contact channel (WhatsApp, Instagram, Mail,
 * Call). Transform/opacity only; the rings are already spread out (no animation) under
 * prefers-reduced-motion. Styles: footer-rings.css.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { contact, telLink, waLink } from "@/lib/content";
import { WhatsAppIcon } from "./Button";
import "./footer-rings.css";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M6.6 3.5h2.6l1.4 4.2-2 1.4a12 12 0 0 0 6.3 6.3l1.4-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

type Ring = { key: string; label: string; href: string; aria: string; icon: ReactNode; external?: boolean };

const RINGS: Ring[] = [
  { key: "wa", label: "WhatsApp", href: waLink("Hi IKIGAI! I have a question."), aria: "Chat with IKIGAI on WhatsApp (opens in a new tab)", icon: <WhatsAppIcon />, external: true },
  { key: "ig", label: "Instagram", href: contact.instagram.value.url, aria: `IKIGAI on Instagram, ${contact.instagram.value.handle} (opens in a new tab)`, icon: <InstagramIcon />, external: true },
  { key: "mail", label: "Mail", href: `mailto:${contact.email.value}`, aria: `Email IKIGAI at ${contact.email.value}`, icon: <MailIcon /> },
  { key: "call", label: "Call", href: telLink, aria: `Call IKIGAI on ${contact.phoneDisplay}`, icon: <PhoneIcon /> },
];

export default function FooterRings() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // The broken-apart row is the natural (CSS) layout. For the joined logo, each ring gets an offset
    // (--jx/--jy) that pulls it back into a 2x2 overlapping cluster at the left end of the row.
    const place = () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>(".ft-ring"));
      if (!items.length) return;
      const s = items[0].offsetWidth;
      const o = s * 0.31; // same overlap as the four-circle logo (CircleProgress)
      const first = items[0].offsetLeft;
      items.forEach((li, i) => {
        const col = i % 2;
        const row = i < 2 ? -1 : 1;
        li.style.setProperty("--jx", `${first + col * 2 * o - li.offsetLeft}px`);
        li.style.setProperty("--jy", `${row * o}px`);
      });
      el.style.setProperty("--cx", `${first + o + s / 2}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    // Break apart when the visitor reaches the Visit section: the joined logo is shown first (held
    // briefly once it is on screen so it is actually seen), then the rings roll out. Leaving the
    // section joins them back up, so the moment replays.
    const visit = document.getElementById("visit");
    let inVisit = false;
    let ringsSeen = false;
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      if (inVisit && ringsSeen) timer = window.setTimeout(() => el.classList.add("is-broken"), 900);
      else el.classList.remove("is-broken");
    };
    const ioVisit = new IntersectionObserver(
      ([e]) => {
        // "visiting" = the Visit section has reached the upper half of the screen (or is still on it below)
        inVisit = e.isIntersecting || e.boundingClientRect.top < 0;
        update();
      },
      { rootMargin: "0px 0px -50% 0px" },
    );
    const ioRings = new IntersectionObserver(
      ([e]) => {
        ringsSeen = e.isIntersecting;
        update();
      },
      { threshold: 1 },
    );
    if (visit) ioVisit.observe(visit);
    else inVisit = true;
    ioRings.observe(el);
    return () => {
      window.clearTimeout(timer);
      ioVisit.disconnect();
      ioRings.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={root} className="ft-rings">
      <span className="ft-rings-core" aria-hidden />
      <ul className="ft-rings-list" aria-label="Contact IKIGAI">
        {RINGS.map((r, i) => (
          <li key={r.key} className="ft-ring" style={{ ["--i" as string]: i }}>
            <a href={r.href} aria-label={r.aria} {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <span className="ft-ring-icon">{r.icon}</span>
              <span className="ft-ring-label">{r.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
