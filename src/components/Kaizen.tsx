/**
 * 09 改善 Kaizen: before/after drag-compare sliders. All placeholders until consented member photos
 * arrive (nothing invented).
 */
import { kaizen } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder } from "./Media";
import CompareSlider from "./CompareSlider";

export default function Kaizen() {
  return (
    <Section id="kaizen" className="kaizen">
      <div className="wrap kz-layout">
        <SectionHead id="kaizen" title={kaizen.heading} sub={kaizen.sub} mega />
        <ul className="kz-grid">
          {Array.from({ length: kaizen.slots }, (_, i) => (
            <li key={i} className="kz-card reveal" style={{ ["--d" as string]: `${i * 110}ms` }}>
              <CompareSlider label={`Member story ${i + 1}`} before={<InkPlaceholder tag="BEFORE · COMING" />} after={<InkPlaceholder className="ink-ph-warm" tag="AFTER · COMING" />} />
              <p className="kz-cap">Member story {i + 1}, shared with permission</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
