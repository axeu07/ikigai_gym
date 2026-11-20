/**
 * Page section. Its number, Japanese numeral and kanji accent come from `sections` in content.ts.
 * Sections start dimmed; the shared <Effects /> layer adds `.is-in` once (ScrollTrigger.batch), which
 * ignites the heading (split text), then reveals children with class `reveal` (staggered via --d).
 */
import type { ReactNode } from "react";
import { sectionById, type SectionId } from "@/lib/content";
import { MicroLabel } from "./ui";
import { BgLayer } from "./Media";

type Props = {
  id: SectionId;
  children: ReactNode;
  className?: string;
  tone?: "dark" | "paper";
  /** accessible name for the region when there's no visible heading id */
  labelledBy?: string;
  /** full-bleed background id (backgrounds in media.config.mjs), rendered as the first child */
  bg?: string;
  /** stacked-card scroll: slides up over the previous section (desktop, motion OK) */
  stack?: boolean;
};

export default function Section({ id, children, className = "", tone = "dark", labelledBy, bg, stack = true }: Props) {
  const s = sectionById(id);
  return (
    <section id={id} data-section={id} data-tone={tone} data-stack={stack ? "" : undefined} aria-labelledby={labelledBy ?? `${id}-title`} className={`section ${className}`}>
      {bg && <BgLayer id={bg} />}
      {/* giant outline number behind the title (parallax in <Effects />) */}
      <span className="ghost-num" aria-hidden data-ghost>
        {s.index}
      </span>
      {children}
      {/* darkens this section as the next one slides over it */}
      <span className="stack-shade" aria-hidden />
    </section>
  );
}

/** Standard section header: label line, big title and a short sub. */
export function SectionHead({ id, title, sub, children, className = "", mega = false, slam = false }: { id: SectionId; title: ReactNode; sub?: ReactNode; children?: ReactNode; className?: string; mega?: boolean; slam?: boolean }) {
  const s = sectionById(id);
  return (
    <header className={`section-head ${className}`}>
      <MicroLabel index={s.index} numeral={s.numeral} kanji={s.kanji} romaji={s.romaji} className="reveal">
        {s.label}
      </MicroLabel>
      <h2 id={`${id}-title`} className={`${mega ? "h-mega" : "h-display"} ${slam ? "h-slam" : "h-split"}`}>
        {title}
      </h2>
      {sub && (
        <p className="lede reveal" style={{ ["--d" as string]: "260ms" }}>
          {sub}
        </p>
      )}
      {children}
    </header>
  );
}
