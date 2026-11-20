"use client";
/**
 * Page section. Its number, Japanese numeral and kanji accent come from `sections` in content.ts.
 * Children with class `reveal` ink-bleed in (CSS) once the section enters view; `.is-in` is added once.
 */
import { useRef, type ReactNode } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import { sectionById, type SectionId } from "@/lib/content";
import { MicroLabel } from "./ui";

type Props = {
  id: SectionId;
  children: ReactNode;
  className?: string;
  tone?: "dark" | "paper";
  /** accessible name for the region when there's no visible heading id */
  labelledBy?: string;
};

export default function Section({ id, children, className = "", tone = "dark", labelledBy }: Props) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      ScrollTrigger.create({ trigger: el, start: "top 72%", once: true, onEnter: () => el.classList.add("is-in") });
    },
    { scope: root },
  );
  return (
    <section ref={root} id={id} data-section={id} data-tone={tone} aria-labelledby={labelledBy ?? `${id}-title`} className={`section ${className}`}>
      {children}
    </section>
  );
}

/** Standard section header: label line, big title and a short sub. */
export function SectionHead({ id, title, sub, children, className = "" }: { id: SectionId; title: ReactNode; sub?: ReactNode; children?: ReactNode; className?: string }) {
  const s = sectionById(id);
  return (
    <header className={`section-head ${className}`}>
      <MicroLabel index={s.index} numeral={s.numeral} kanji={s.kanji} romaji={s.romaji} className="reveal">
        {s.label}
      </MicroLabel>
      <h2 id={`${id}-title`} className="h-display reveal" style={{ ["--d" as string]: "80ms" }}>
        {title}
      </h2>
      {sub && (
        <p className="lede reveal" style={{ ["--d" as string]: "160ms" }}>
          {sub}
        </p>
      )}
      {children}
    </header>
  );
}
