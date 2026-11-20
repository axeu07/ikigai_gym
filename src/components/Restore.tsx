/**
 * 06 癒し Iyashi: Restore. Steam, washrooms, showers, lockers and the cafeteria ("fuel") card.
 * Slow steam drifts behind (CSS). Missing photos show an ink placeholder with PHOTO COMING.
 */
import { restore } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder, Picture } from "./Media";
import { Tag } from "./ui";

export default function Restore() {
  return (
    <Section id="restore" className="restore">
      <div className="steam" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="wrap">
        <SectionHead id="restore" title={restore.heading} sub={restore.sub} />
        <ul className="rs-grid">
          {restore.items.map((it, i) => (
            <li key={it.id} className="rs-card reveal tilt-card" data-tilt style={{ ["--d" as string]: `${i * 80}ms` }}>
              <div className="rs-media">{it.media?.photo ? <Picture id={it.media.photo} alt={it.media.alt ?? ""} sizes="(min-width: 1024px) 24vw, 90vw" /> : <InkPlaceholder label={`${it.name} photo`} />}</div>
              <h3>{it.name}</h3>
              <p>{it.line}</p>
            </li>
          ))}
          <li className="rs-card rs-cafe reveal tilt-card" data-tilt style={{ ["--d" as string]: "320ms" }}>
            <p className="rs-cafe-kicker">Fuel</p>
            <h3>{restore.cafe.name}</h3>
            <p>{restore.cafe.line}</p>
            <p className="rs-cafe-menu">
              <Tag>TO CONFIRM</Tag> {restore.cafe.menuNote}
            </p>
          </li>
        </ul>
        <p className="rs-hygiene reveal">{restore.hygiene}</p>
      </div>
    </Section>
  );
}
