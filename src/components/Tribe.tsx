/** 08 仲間 Nakama: community events (TO CONFIRM), a strip of real footage and the Instagram follow CTA. */
import { contact, tribe } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { LoopVideo, Picture } from "./Media";
import { Confirm } from "./ui";
import Button from "./Button";

export default function Tribe() {
  const ig = contact.instagram;
  return (
    <Section id="tribe" className="tribe">
      <div className="wrap">
        <SectionHead id="tribe" title={tribe.heading} sub={tribe.sub} />
        <ul className="tb-events">
          {tribe.events.map((e, i) => (
            <li key={e.name} className="reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <h3>
                {e.name} <Confirm confirmed={e.confirmed} />
              </h3>
              <p>{e.line}</p>
            </li>
          ))}
        </ul>
      </div>
      <ul className="tb-strip" aria-label="Life at IKIGAI">
        {tribe.strip.map((m, i) => (
          <li key={m.caption} className="tb-frame reveal" style={{ ["--d" as string]: `${i * 70}ms`, ["--r" as string]: `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg` }}>
            <div className="tb-media">{m.video ? <LoopVideo id={m.video} /> : <Picture id={m.photo!} alt={m.alt ?? ""} sizes="240px" />}</div>
            <p>{m.caption}</p>
          </li>
        ))}
      </ul>
      <div className="wrap tb-follow reveal">
        <Button href={ig.value.url} external variant="ghost">
          {tribe.follow} · {ig.value.handle}
        </Button>
        <Confirm confirmed={ig.confirmed} />
      </div>
    </Section>
  );
}
