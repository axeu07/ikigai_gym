"use client";
/**
 * 10 Visit, merged into the top of the footer: heading + directions/WhatsApp on the left, the building
 * photo on the right. "Show map" swaps the photo for a Google Maps embed (no third-party request until
 * the visitor asks). Address / hours / contact live once, in the footer grid below.
 */
import { useState } from "react";
import { fullAddress, mapsEmbed, mapsUrl, visit, waLink } from "@/lib/content";
import { SectionHead } from "./Section";
import { BgPicture } from "./Media";
import Button, { WhatsAppIcon } from "./Button";

export default function Visit() {
  const [map, setMap] = useState(false);
  return (
    <div id="visit" data-section="visit" aria-labelledby="visit-title" className="visit vs-merged" role="region">
      <div className="wrap vs-grid">
        <div className="vs-info">
          <SectionHead id="visit" title={visit.heading} sub={visit.sub} />
          <div className="vs-actions reveal">
            <Button href={mapsUrl} external>
              Get directions
            </Button>
            <Button href={waLink("Hi IKIGAI! I'd like to visit.")} external variant="ghost" icon={<WhatsAppIcon />}>
              WhatsApp
            </Button>
          </div>
        </div>

        <div className="vs-photo reveal">
          {map ? (
            <iframe title={`Map: ${fullAddress}`} src={mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          ) : (
            <BgPicture id={visit.bg} />
          )}
          <button type="button" className="vs-photo-toggle" onClick={() => setMap((m) => !m)} aria-pressed={map}>
            <span className="vs-pin" aria-hidden />
            {map ? "Show photo" : visit.mapButton}
          </button>
        </div>
      </div>
    </div>
  );
}
