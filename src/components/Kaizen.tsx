/** 09 改善 Kaizen: before/after frames, all placeholders until consented member photos arrive. */
import { kaizen } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder } from "./Media";

export default function Kaizen() {
  return (
    <Section id="kaizen" tone="paper" className="kaizen">
      <div className="wrap">
        <SectionHead id="kaizen" title={kaizen.heading} sub={kaizen.sub} />
        <ul className="kz-grid">
          {Array.from({ length: kaizen.slots }, (_, i) => (
            <li key={i} className="kz-card reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <div className="kz-pair">
                <figure>
                  <InkPlaceholder tag="BEFORE · COMING" />
                  <figcaption>Before</figcaption>
                </figure>
                <figure>
                  <InkPlaceholder tag="AFTER · COMING" />
                  <figcaption>After</figcaption>
                </figure>
              </div>
              <p className="kz-cap">Member story {i + 1}, shared with permission</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
