/** 07 先生 Sensei: Coach Arun (TO CONFIRM) plus placeholder cards until the client sends the team. */
import { sensei } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder } from "./Media";
import { Tag } from "./ui";

export default function Sensei() {
  return (
    <Section id="sensei" tone="paper" className="sensei">
      <div className="wrap">
        <SectionHead id="sensei" title={sensei.heading} sub={sensei.sub} />
        <ul className="ss-grid">
          {sensei.people.map((p, i) => (
            <li key={i} className="ss-card reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
              <InkPlaceholder className="ss-photo" label={`${p.name} portrait`} tag="PORTRAIT COMING" />
              <h3>{p.name}</h3>
              <p>
                {p.role} {!p.confirmed && <Tag>TO CONFIRM</Tag>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
