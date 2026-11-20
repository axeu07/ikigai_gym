"use client";
/**
 * 14 Visit: address + contact card, building photo and a click-to-load Google Maps embed
 * (no third-party request until the visitor asks for the map).
 */
import { useState } from "react";
import { contact, fullAddress, hours, mapsEmbed, mapsUrl, telLink, visit, waLink } from "@/lib/content";
import Section, { SectionHead } from "./Section";
import { BgLayer } from "./Media";
import { Confirm, StatusChip } from "./ui";
import Button, { WhatsAppIcon } from "./Button";

export default function Visit() {
  const [map, setMap] = useState(false);
  return (
    <Section id="visit" className="visit">
      <BgLayer id={visit.bg} />
      <div className="wrap vs-grid">
        <div className="vs-info">
          <SectionHead id="visit" title={visit.heading} sub={visit.sub} />
          <address className="vs-card reveal">
            <p className="vs-addr">
              {contact.address.line1}
              <br />
              {contact.address.line2}
              <br />
              {contact.address.city}, {contact.address.region} {contact.address.postalCode}
            </p>
            <p>
              <a href={telLink}>{contact.phoneDisplay}</a>
            </p>
            <p>
              {hours.weekdays.days} · {hours.weekdays.label} <Confirm confirmed={hours.weekdays.confirmed} />
              <br />
              <span className="muted">{hours.sunday.label}</span>
            </p>
            <p>
              <a href={`mailto:${contact.email.value}`}>{contact.email.value}</a> <Confirm confirmed={contact.email.confirmed} />
            </p>
            <p>
              {contact.parking.value} <Confirm confirmed={contact.parking.confirmed} />
            </p>
            <StatusChip />
          </address>
          <div className="vs-actions reveal">
            <Button href={mapsUrl} external>
              Get directions
            </Button>
            <Button href={waLink("Hi IKIGAI! I'd like to visit.")} external variant="ghost" icon={<WhatsAppIcon />}>
              WhatsApp
            </Button>
          </div>
        </div>

        <div className="vs-media">
          <div className="vs-map reveal">
            {map ? (
              <iframe title={`Map: ${fullAddress}`} src={mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            ) : (
              <button type="button" className="vs-map-btn" onClick={() => setMap(true)}>
                <span className="vs-pin" aria-hidden />
                <span>{visit.mapButton}</span>
                <small>{visit.mapNote}</small>
              </button>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
