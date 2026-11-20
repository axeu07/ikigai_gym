"use client";
/** Top bar: wordmark, section links, live open/closed chip and the one red CTA. Mobile: full-screen menu. */
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { getLenis, scrollToTarget } from "@/lib/motion";
import { nav } from "@/lib/content";
import Logo from "./Logo";
import { StatusChip } from "./ui";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
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

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    // wait a frame so Lenis is running again before scrolling
    requestAnimationFrame(() => scrollToTarget(href));
    history.replaceState(null, "", href);
  };

  return (
    <header className={`nav ${solid ? "is-solid" : ""} ${hidden && !open ? "is-hidden" : ""}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-logo" onClick={(e) => go(e, "#top")} aria-label="IKIGAI Fitness Club, back to top">
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
          <a href={nav.cta.href} className="btn btn-sun btn-sm" onClick={(e) => go(e, nav.cta.href)}>
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
      <div id="mobile-menu" ref={menuRef} className={`nav-menu ${open ? "is-open" : ""}`} hidden={!open}>
        <nav aria-label="Mobile">
          {nav.links.map((l, i) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} style={{ ["--i" as string]: i }}>
              {l.label}
            </a>
          ))}
          <a href={nav.cta.href} className="btn btn-sun" onClick={(e) => go(e, nav.cta.href)}>
            {nav.cta.label}
          </a>
        </nav>
        <StatusChip />
      </div>
    </header>
  );
}
