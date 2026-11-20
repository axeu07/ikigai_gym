"use client";
/**
 * 11 約束 Yakusoku: plans. The featured card has a 6 / 12-month toggle; the price morphs between the
 * two amounts seen in promos (both TO CONFIRM, may be offers). Other plans are "Call for pricing".
 * Cards flip in on enter (CSS, transform/opacity) and tilt on desktop; the featured card glows.
 */
import { useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { plans, waLink } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { Confirm } from "./ui";
import Button, { WhatsAppIcon } from "./Button";

const priced = plans.list.filter((p) => p.price);
const others = plans.list.filter((p) => !p.price);
const toNum = (s: string) => Number(s.replace(/[^\d]/g, ""));
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default function Plans() {
  const [term, setTerm] = useState(priced.length - 1);
  const priceRef = useRef<HTMLSpanElement>(null);
  const shown = useRef(toNum(priced[priced.length - 1]?.price ?? "0"));
  const plan = priced[term];

  const pick = (i: number) => {
    if (i === term) return;
    setTerm(i);
    const to = toNum(priced[i].price!);
    const el = priceRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduced) {
      shown.current = to;
      if (el) el.textContent = inr(to);
      return;
    }
    const o = { v: shown.current };
    gsap.to(o, {
      v: to,
      duration: 0.7,
      ease: "power3.out",
      onUpdate: () => {
        shown.current = o.v;
        el.textContent = inr(o.v);
      },
    });
    gsap.fromTo(el, { yPercent: 18, opacity: 0.4 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  };

  return (
    <Section id="plans" className="plans">
      <div className="wrap pl-layout">
        <SectionHead id="plans" title={plans.heading} sub={plans.sub} mega />

        <div className="pl-cards">
          {plan && (
            <article className="pl-card pl-flip pl-feature tilt-card is-featured" data-tilt style={{ ["--d" as string]: "0ms" }}>
              <div className="pl-toggle" role="group" aria-label="Plan length">
                {priced.map((p, i) => (
                  <button key={p.id} type="button" aria-pressed={i === term} className={i === term ? "is-on" : ""} onClick={() => pick(i)}>
                    {p.name}
                  </button>
                ))}
                <span className="pl-toggle-thumb" style={{ transform: `translateX(${term * 100}%)`, width: `${100 / priced.length}%` }} aria-hidden />
              </div>
              <p className="pl-price" aria-live="polite">
                <span ref={priceRef}>{priced[priced.length - 1]?.price}</span> <span className="pl-per">{plan.per}</span>
              </p>
              <p className="pl-note">
                <Confirm confirmed={plan.confirmed} /> {plan.note}
              </p>
              <Button href={waLink(`Hi IKIGAI! Could you share details for the ${plan.name} plan?`)} external icon={<WhatsAppIcon />}>
                Ask about {plan.name}
              </Button>
            </article>
          )}

          <ul className="pl-grid">
            {others.map((p, i) => (
              <li key={p.id} className="pl-card pl-flip tilt-card" data-tilt style={{ ["--d" as string]: `${120 + i * 100}ms` }}>
                <h3>{p.name}</h3>
                <p className="pl-call">Call for pricing</p>
                <p className="pl-note">
                  <Confirm confirmed={p.confirmed} /> {p.note}
                </p>
                <Button href={waLink(`Hi IKIGAI! Could you share details for the ${p.name} plan?`)} external variant="ghost" icon={<WhatsAppIcon />}>
                  Ask on WhatsApp
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
