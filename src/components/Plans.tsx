/** 11 約束 Yakusoku: ink-on-paper plan cards. Only the two prices seen in promos are shown, tagged TO CONFIRM. */
import { plans, waLink } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { Confirm } from "./ui";
import Button, { WhatsAppIcon } from "./Button";

export default function Plans() {
  return (
    <Section id="plans" tone="paper" className="plans">
      <div className="wrap">
        <SectionHead id="plans" title={plans.heading} sub={plans.sub} />
        <ul className="pl-grid">
          {plans.list.map((p, i) => (
            <li key={p.id} data-tilt className={`pl-card reveal tilt-card ${p.price ? "has-price" : ""} ${p.featured ? "is-featured" : ""}`} style={{ ["--d" as string]: `${i * 70}ms` }}>
              <h3>{p.name}</h3>
              {p.price ? (
                <p className="pl-price">
                  {p.price} <span>{p.per}</span>
                </p>
              ) : (
                <p className="pl-price pl-call">Call for pricing</p>
              )}
              <p className="pl-note">
                <Confirm confirmed={p.confirmed} /> {p.note}
              </p>
              <Button href={waLink(`Hi IKIGAI! Could you share details for the ${p.name} plan?`)} external variant="paper" icon={<WhatsAppIcon />}>
                Ask on WhatsApp
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
