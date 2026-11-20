"use client";
/**
 * 12 Book a free trial: an honest WhatsApp enquiry (no backend), styled as a Japanese ticket with a
 * red hanko stamp. The ticket prints out of a slot as the section enters (CSS, transform only); on send
 * the hanko slams down with a small shake. Valid form → a pre-filled WhatsApp message in a new tab. Picks up the goal chosen
 * in "Find your circle" (lib/booking.ts).
 */
import { useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { punch } from "@/lib/motion";
import { booking, waLink } from "@/lib/content";
import { GOAL_EVENT, getGoalPrefill } from "@/lib/booking";
import Section, { SectionHead } from "./Section";
import { Tag } from "./ui";
import { WhatsAppIcon } from "./Button";

type Errors = Partial<Record<"name" | "phone", string>>;

const todayIST = () => new Date(Date.now() + (new Date().getTimezoneOffset() + 330) * 60_000).toISOString().slice(0, 10);
const noSubscribe = () => () => {};
const subscribeGoal = (cb: () => void) => {
  window.addEventListener(GOAL_EVENT, cb);
  return () => window.removeEventListener(GOAL_EVENT, cb);
};

export default function BookTrial() {
  const uid = useId();
  // the goal chosen in "Find your circle" (sessionStorage + event), and today's date in IST for the date picker
  const goal = useSyncExternalStore(subscribeGoal, getGoalPrefill, () => null);
  const minDate = useSyncExternalStore(noSubscribe, todayIST, () => undefined);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const ticket = useRef<HTMLFormElement>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").replace(/[\s-]/g, "");
    const interest = String(f.get("interest") ?? "");
    const date = String(f.get("date") ?? "");
    const time = String(f.get("time") ?? "");
    const errs: Errors = {};
    if (name.length < 2) errs.name = "Please enter your name.";
    if (!/^(\+?91)?[6-9]\d{9}$/.test(phone)) errs.phone = "Please enter a 10-digit Indian mobile number.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    const lines = [
      "Hi IKIGAI! I'd like to book a visit.",
      `Name: ${name}`,
      `Mobile: ${phone}`,
      `Interested in: ${interest}`,
      goal ? `Goal: ${goal}` : "",
      date ? `Preferred date: ${date}` : "",
      time ? `Preferred time: ${time}` : "",
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
    setSent(true);
    // the stamp lands ~0.25s into its slam animation
    window.setTimeout(() => ticket.current && punch(ticket.current), 250);
  };

  return (
    <Section id="book" className="book">
      <div className="wrap bk-grid">
        <SectionHead id="book" title={booking.heading} sub={booking.sub}>
          {!booking.trialConfirmed && (
            <p className="bk-tag reveal">
              <Tag>TO CONFIRM</Tag> Free-trial policy to be confirmed by IKIGAI.
            </p>
          )}
        </SectionHead>

        <div className="bk-slot">
          <span className="bk-slot-mouth" aria-hidden />
          <div className="bk-slot-window">
        <form ref={ticket} className="ticket" onSubmit={submit} noValidate aria-describedby={`${uid}-note`}>
          <div className="ticket-stub" aria-hidden>
            <span lang="ja">入場券</span>
            <span>Admit one</span>
          </div>
          <div className="ticket-body">
            <p className="ticket-title">
              IKIGAI <span>· Trial pass</span>
            </p>

            <div className="field">
              <label htmlFor={`${uid}-name`}>Your name</label>
              <input id={`${uid}-name`} name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined} />
              {errors.name && (
                <p id={`${uid}-name-err`} className="field-err">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor={`${uid}-phone`}>Mobile number</label>
              <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-phone-err` : undefined} />
              {errors.phone && (
                <p id={`${uid}-phone-err`} className="field-err">
                  {errors.phone}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor={`${uid}-interest`}>I&apos;m interested in</label>
              <select id={`${uid}-interest`} name="interest" defaultValue={booking.interests[0]}>
                {booking.interests.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor={`${uid}-date`}>Preferred date</label>
                <input id={`${uid}-date`} name="date" type="date" min={minDate} />
              </div>
              <div className="field">
                <label htmlFor={`${uid}-time`}>Time of day</label>
                <select id={`${uid}-time`} name="time" defaultValue="">
                  <option value="">Any time</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>
            </div>
            {goal && (
              <p className="ticket-goal">
                Your circle goal: <strong>{goal}</strong>
              </p>
            )}

            <button type="submit" className="btn btn-sun ticket-send">
              <span aria-hidden className="btn-icon">
                <WhatsAppIcon />
              </span>
              <span>Send on WhatsApp</span>
            </button>
            <p id={`${uid}-note`} className="ticket-note">
              Not a confirmed booking. We reply on WhatsApp.
            </p>
            <p className="sr-only" role="status">
              {sent ? "WhatsApp opened in a new tab with your request." : ""}
            </p>
          </div>
          <div className={`hanko ${sent ? "is-stamped" : ""}`} aria-hidden>
            <span>生き</span>
            <span>甲斐</span>
          </div>
        </form>
          </div>
        </div>
      </div>
    </Section>
  );
}
