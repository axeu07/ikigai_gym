/** LocalBusiness (HealthClub) structured data, built from content.ts so it never drifts from the page. */
import { amenities, contact, facilities, hours, rating, site } from "./content";

// TO CONFIRM: does the client still own ikigaifitnessclub.com? Override with NEXT_PUBLIC_SITE_URL.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ikigaifitnessclub.com";

export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: site.name,
  url: SITE_URL,
  telephone: contact.phoneE164,
  image: `${SITE_URL}/og.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${contact.address.line1}, ${contact.address.line2}`,
    addressLocality: contact.address.city,
    addressRegion: contact.address.region,
    postalCode: contact.address.postalCode,
    addressCountry: contact.address.country,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: hours.weekdays.open,
      closes: hours.weekdays.close,
    },
  ],
  // Only confirmed numbers go into structured data.
  ...(rating.confirmed ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.value, reviewCount: parseInt(rating.count, 10) } } : {}),
  sameAs: [contact.instagram.value.url],
  amenityFeature: [...facilities, ...amenities].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
};
