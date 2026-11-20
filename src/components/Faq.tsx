/** 13 FAQ: native <details> (keyboard and screen-reader friendly). Unconfirmed answers carry a tag. */
import { faq, waLink } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { Tag } from "./ui";

export default function Faq() {
  return (
    <Section id="faq" tone="paper" className="faq">
      <div className="wrap faq-grid">
        <SectionHead id="faq" title="Good questions." sub="Can't find yours? Ask us on WhatsApp.">
          <p className="reveal">
            <a className="link" href={waLink("Hi IKIGAI! I have a question.")} target="_blank" rel="noopener noreferrer">
              Message IKIGAI →
            </a>
          </p>
        </SectionHead>
        <div className="faq-list">
          {faq.map((f) => (
            <details key={f.q} className="faq-item reveal">
              <summary>
                <span>{f.q}</span>
                <span aria-hidden className="faq-plus" />
              </summary>
              <p>
                {!f.confirmed && <Tag>TO CONFIRM</Tag>} {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
