/**
 * 06 癒し Iyashi: Restore. Everything slows down here: four soft steam shapes drift upward
 * (blurred divs, transform only), the colour warms as the section comes in (one long opacity fade),
 * and reveals run at half speed. Facilities on the right; the cafeteria is a menu board whose items
 * and prices are TO CONFIRM (no invented menu). Missing photos show an ink placeholder.
 */
import { restore } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { InkPlaceholder, Picture } from "./Media";
import { Tag } from "./ui";

export default function Restore() {
  return (
    <Section id="restore" className="restore">
      <div className="rs-warm" aria-hidden />
      <div className="steam" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="wrap rs-layout">
        <div className="rs-left">
          <SectionHead id="restore" title={restore.heading} sub={restore.sub} mega />
          <p className="rs-hygiene reveal">{restore.hygiene}</p>

          <div className="rs-board reveal" style={{ ["--d" as string]: "240ms" }}>
            <p className="rs-board-kicker">Fuel · {restore.cafe.name}</p>
            <p className="rs-board-line">{restore.cafe.line}</p>
            <ul className="rs-board-rows" aria-label="Menu (to be confirmed)">
              {["Shakes", "Snacks", "Coffee"].map((r) => (
                <li key={r} aria-hidden>
                  <span className="rs-board-blank" />
                  <span className="rs-board-dots" />
                  <span className="rs-board-price">₹ —</span>
                </li>
              ))}
            </ul>
            <p className="rs-board-note">
              <Tag>TO CONFIRM</Tag> {restore.cafe.menuNote}
            </p>
          </div>
        </div>

        <ul className="rs-grid">
          {restore.items.map((it, i) => (
            <li key={it.id} className="rs-card reveal tilt-card" data-tilt style={{ ["--d" as string]: `${i * 140}ms` }}>
              <div className="rs-media" data-skew>
                {it.media?.photo ? <Picture id={it.media.photo} alt={it.media.alt ?? ""} sizes="(min-width: 1024px) 24vw, 90vw" /> : <InkPlaceholder label={`${it.name} photo`} />}
              </div>
              <h3>{it.name}</h3>
              <p>{it.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
