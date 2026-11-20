"use client";
/**
 * 09 約束 Yakusoku: plans + the free-trial pass, one section on a pinned sideways journey (07 Tribe
 * pattern): Monthly → 3 months → Personal training → the featured plan → the trial pass.
 * The featured card has a 6 / 12-month toggle; the price morphs between the two amounts seen in promos
 * (both TO CONFIRM, may be offers). Other plans are "Call for pricing".
 * Desktop (≥1024px, motion OK): heading on the left; as the track travels, each card is dealt onto the
 * table (drops in with a spin, scrubbed). When the featured card lands, a red hanko stamp slams onto it
 * with the punch shake; then the trial ticket prints. "Book free trial" links scroll the journey to
 * the ticket. Mobile / reduced motion: plan cards are a swipe row (mobile.css), the trial pass sits
 * below, and the stamp lands once in view.
 * DOM keeps .pl-cards > (.pl-card.is-featured + ul.pl-grid > li.pl-card) for the phone rules; the
 * desktop order (featured last) comes from CSS `order`.
 */
import { useRef, useState } from "react";
import { gsap, punch, ScrollTrigger, useGSAP } from "@/lib/motion";
import { plans, waLink } from "@/lib/content";
import { enterInTrack, HPIN_MQ, useHorizontalPin } from "@/lib/useHorizontalPin";
import Section, { SectionHead } from "./Section";
import { Confirm, Tag } from "./ui";
import Button, { WhatsAppIcon } from "./Button";
import BookTrial from "./BookTrial";

const priced = plans.list.filter((p) => p.price);
const others = plans.list.filter((p) => !p.price);
const toNum = (s: string) => Number(s.replace(/[^\d]/g, ""));
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const SPIN = [-14, 10, -7, 12, -3];

export default function Plans() {
  const [term, setTerm] = useState(priced.length - 1);
  const priceRef = useRef<HTMLSpanElement>(null);
  const shown = useRef(toNum(priced[priced.length - 1]?.price ?? "0"));
  const plan = priced[term];
  const pin = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLSpanElement>(null);
  const stamped = useRef(false);

  const stamp = (on: boolean) => {
    const hanko = pin.current?.querySelector<HTMLElement>(".pl-hanko");
    if (!hanko || on === stamped.current) return;
    stamped.current = on;
    hanko.classList.toggle("is-stamped", on);
    // the stamp lands ~0.25s into its slam animation; shake the table, not the (scrubbed) card
    const table = viewport.current;
    if (on && table) window.setTimeout(() => punch(table), 250);
  };

  useHorizontalPin({
    pin,
    viewport,
    track,
    onProgress: (p) => trail.current && gsap.set(trail.current, { scaleX: p }),
    setup: (ctx) => {
      const section = ctx.pin.closest("section");
      section?.classList.add("pl-deal");
      const tr = ctx.track;
      // dealing order = visual order (CSS `order`): the plain plans, the featured plan, then the ticket
      const items = [...gsap.utils.toArray<HTMLElement>(".pl-grid > .pl-card", tr), ...gsap.utils.toArray<HTMLElement>(".pl-card.is-featured, #book", tr)];
      const book = tr.querySelector<HTMLElement>("#book");
      const undo = enterInTrack(
        ctx,
        items,
        (el, i) => (el === book ? { y: 90, opacity: 0 } : { y: () => -window.innerHeight * 0.5, x: 120, rotate: SPIN[i % SPIN.length], opacity: 0 }),
        (el) => {
          if (el.classList.contains("is-featured"))
            return { onUpdate: (s: ScrollTrigger) => stamp(s.progress > 0.97 || (stamped.current && s.progress > 0.6)), onLeave: () => stamp(true) };
          if (el === book) return { onUpdate: (s: ScrollTrigger) => void (s.progress > 0.85 && book.classList.add("is-in")), onLeave: () => book.classList.add("is-in") };
        },
      );

      // "Book free trial" links: travel the journey to the ticket instead of jumping to the pin's top
      const onClick = (e: MouseEvent) => {
        const a = (e.target as Element).closest?.('a[href="#book"]');
        if (!a || !book) return;
        // capture phase on document: runs before React's handlers (nav's own scroll-to), which we skip
        e.preventDefault();
        e.stopPropagation();
        ctx.scrollToItem(book);
      };
      document.addEventListener("click", onClick, true);
      return () => {
        undo();
        document.removeEventListener("click", onClick, true);
        section?.classList.remove("pl-deal");
      };
    },
  });

  // mobile / reduced motion: the stamp lands once the featured card is in view
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`not all and ${HPIN_MQ}`, () => {
        const hanko = pin.current?.querySelector(".pl-hanko");
        if (!hanko) return;
        const st = ScrollTrigger.create({ trigger: hanko, start: "top 75%", once: true, onEnter: () => stamp(true) });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: pin },
  );

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
    <Section id="plans" className="plans hp-section">
      <div ref={pin} className="hp-pin fx-pin pl-pin">
        <div className="wrap pl-layout hp-side">
          <SectionHead id="plans" title={plans.heading} sub={plans.sub} mega />
        </div>

        <div ref={viewport} className="hp-viewport">
          <div ref={track} className="hp-track pl-track">
            <div className="pl-cards">
              {plan && (
                <article className="pl-card pl-flip pl-feature is-featured">
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
                  <div className="hanko pl-hanko" aria-hidden>
                    <span>生き</span>
                    <span>甲斐</span>
                  </div>
                </article>
              )}

              <ul className="pl-grid">
                {others.map((p, i) => (
                  <li key={p.id} className="pl-card pl-flip" style={{ ["--d" as string]: `${120 + i * 100}ms` }}>
                    <h3>{p.name}</h3>
                    {p.demoPrice ? (
                      <p className="pl-price pl-demo">
                        <span>{p.demoPrice}</span> <span className="pl-per">{p.per}</span>
                      </p>
                    ) : (
                      <p className="pl-call">Call for pricing</p>
                    )}
                    <p className="pl-note">
                      {/* demo prices are placeholders, never presented as real */}
                      {p.demoPrice ? <Tag>SAMPLE</Tag> : <Confirm confirmed={p.confirmed} />} {p.note}
                    </p>
                    <Button href={waLink(`Hi IKIGAI! Could you share details for the ${p.name} plan?`)} external variant="ghost" icon={<WhatsAppIcon />}>
                      Ask on WhatsApp
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <BookTrial />
          </div>
        </div>

        <div className="hp-trail" aria-hidden>
          <span>Plans</span>
          <i>
            <span ref={trail} className="hp-trail-fill" />
          </i>
          <span>Free trial</span>
        </div>
      </div>
    </Section>
  );
}
