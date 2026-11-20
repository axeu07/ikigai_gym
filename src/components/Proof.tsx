/** 10 Proof: big numbers (unconfirmed ones tagged) and review themes, paraphrased, never quoted. */
import { proof } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { Confirm } from "./ui";

export default function Proof() {
  return (
    <Section id="proof" className="proof">
      <div className="hex-texture" aria-hidden />
      <div className="wrap">
        <SectionHead id="proof" title={proof.heading} />
        <dl className="pf-numbers">
          {proof.numbers.map((n, i) => (
            <div key={n.label} className="pf-num reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
              <dt>
                {n.label} <Confirm confirmed={n.confirmed} />
              </dt>
              <dd>
                {n.value}
                <span>{n.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
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
    </Section>
  );
}
