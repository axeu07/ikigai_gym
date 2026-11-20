"use client";
/**
 * 13 FAQ: accessible accordion (button + region, aria-expanded). Smooth open/close with the
 * grid-template-rows 0fr → 1fr trick; the plus rotates to an x; the open item gets an ember border.
 * Unconfirmed answers carry a tag.
 */
import { useId, useState } from "react";
import { faq, waLink } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { Tag } from "./ui";

export default function Faq() {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" tone="paper" className="faq">
      <div className="wrap faq-grid">
        <SectionHead id="faq" title="Good questions." sub="Can't find yours? Ask us on WhatsApp." mega>
          <p className="reveal">
            <a className="link" href={waLink("Hi IKIGAI! I have a question.")} target="_blank" rel="noopener noreferrer">
              Message IKIGAI <span aria-hidden>→</span>
            </a>
          </p>
        </SectionHead>
        <div className="faq-list">
          {faq.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className={`faq-item reveal ${on ? "is-open" : ""}`} style={{ ["--d" as string]: `${i * 60}ms` }}>
                <h3>
                  <button type="button" id={`${uid}-q${i}`} aria-expanded={on} aria-controls={`${uid}-a${i}`} onClick={() => setOpen(on ? null : i)}>
                    <span>{f.q}</span>
                    <span aria-hidden className="faq-plus" />
                  </button>
                </h3>
                <div id={`${uid}-a${i}`} role="region" aria-labelledby={`${uid}-q${i}`} className="faq-a" inert={!on}>
                  <div className="faq-a-inner">
                    <p>
                      {!f.confirmed && <Tag>TO CONFIRM</Tag>} {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
