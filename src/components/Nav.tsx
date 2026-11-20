"use client";
/**
 * Top bar (always visible): wordmark, section links, live open/closed chip and the one red CTA.
 * Clicking a link (or the logo, for home) spins the header ring and shows the four-ring logo spinning
 * over a veil (NavLoader) while the page moves to the section.
 * Mobile: full-screen menu.
 */
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { getLenis, prefersReducedMotion } from "@/lib/motion";
import { nav } from "@/lib/content";
import Logo from "./Logo";
import NavLoader, { type NavLoaderHandle } from "./NavLoader";
import { StatusChip } from "./ui";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const loader = useRef<NavLoaderHandle>(null);
  const [solid, setSolid] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.classList.add("menu-open");
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Spin the header logo ring (and pulse its ember dot) for as long as the scroll takes (scrollToTarget
  // takes ~1.3s). Web Animations API, so it restarts cleanly on every click. Reduced motion: no spin.
  const spinLogo = () => {
    if (prefersReducedMotion()) return;
    const mark = logoRef.current?.querySelector<HTMLElement>(".logo-mark");
    const ring = mark?.querySelector("svg");
    const dot = mark?.querySelector<HTMLElement>(".logo-dot");
    ring?.getAnimations().forEach((a) => a.cancel());
    ring?.animate(
      [
        { transform: "rotate(0deg) scale(1)" },
        { transform: "rotate(360deg) scale(1.25)", offset: 0.5 },
        { transform: "rotate(720deg) scale(1)" },
      ],
      { duration: 1400, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
    );
    dot?.getAnimations().forEach((a) => a.cancel());
    dot?.animate(
      [
        { transform: "scale(1)", boxShadow: "0 0 0 rgb(255 90 31 / 0)" },
        {
          transform: "scale(1.7)",
          boxShadow: "0 0 14px rgb(255 90 31 / 0.9)",
          offset: 0.5,
        },
        { transform: "scale(1)", boxShadow: "0 0 0 rgb(255 90 31 / 0)" },
      ],
      { duration: 1400, easing: "ease-in-out" },
    );
  };

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    spinLogo();
    // four-ring logo spins over a veil while the page moves to the section (NavLoader)
    requestAnimationFrame(() => loader.current?.go(href));
    history.replaceState(null, "", href);
  };

  return (
    <>
      <header className={`nav ${solid ? "is-solid" : ""}`}>
        <div className="nav-inner">
          <a
            ref={logoRef}
            href="#top"
            className="nav-logo"
            onClick={(e) => go(e, "#top")}
            aria-label="IKIGAI Fitness Club, back to top"
          >
            <Logo />
          </a>
          <nav aria-label="Main" className="nav-links">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-right">
            <StatusChip className="nav-status" />
            <a
              href={nav.cta.href}
              className="btn btn-sun btn-sm"
              onClick={(e) => go(e, nav.cta.href)}
            >
              {nav.cta.label}
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span aria-hidden />
              <span aria-hidden />
            </button>
          </div>
        </div>
        <div
          id="mobile-menu"
          ref={menuRef}
          className={`nav-menu ${open ? "is-open" : ""}`}
          hidden={!open}
        >
          <nav aria-label="Mobile">
            {nav.links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                style={{ ["--i" as string]: i }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={nav.cta.href}
              className="btn btn-sun"
              onClick={(e) => go(e, nav.cta.href)}
            >
              {nav.cta.label}
            </a>
          </nav>
          <StatusChip />
        </div>
      </header>
      <NavLoader ref={loader} />
    </>
  );
}
