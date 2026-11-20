/**
 * 10 Proof: numbers count up inside ember rings that draw as they count (<Effects /> drives both from
 * [data-count] and [data-ring]). Unconfirmed numbers are tagged. Review themes are paraphrased, never quoted.
 */
import { proof } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { Confirm } from "./ui";

const R = 46;

export default function Proof() {
  return (
    <Section id="proof" className="proof">
      <div className="wrap pf-layout">
        <div className="pf-left">
          <SectionHead id="proof" title={proof.heading} mega />
          <ul className="pf-themes">
            {proof.themes.map((t, i) => (
              <li key={t.title} className="reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
                <h3>{t.title}</h3>
                <p>{t.line}</p>
              </li>
            ))}
          </ul>
          <p className="pf-note">{proof.note}</p>
        </div>

        <dl className="pf-numbers">
          {proof.numbers.map((n, i) => {
            // the rating ring fills to its share of 5 stars; counts fill the whole ring
            const frac = n.suffix === "★" ? parseFloat(n.value) / 5 : 1;
            return (
              <div key={n.label} className="pf-num reveal" style={{ ["--d" as string]: `${i * 100}ms` }}>
                <dt>
                  {n.label} <Confirm confirmed={n.confirmed} />
                </dt>
                <dd>
                  <svg viewBox="0 0 100 100" className="pf-ring" aria-hidden>
                    <circle cx="50" cy="50" r={R} className="pf-ring-track" />
                    <circle cx="50" cy="50" r={R} className="pf-ring-fill" pathLength={1} data-ring={frac} transform="rotate(-90 50 50)" />
                  </svg>
                  <span className="pf-val">
                    <span data-count={n.value}>{n.value}</span>
                    <span className="pf-suf">{n.suffix}</span>
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
