IKIGAI Fitness Club — Website Brief (read this first)

This file is the single source of truth for this project. Re-read it at the start of every session. Also read AGENTS.md (Next 16 has breaking changes — check node_modules/next/dist/docs/ before touching framework code).

0. What we are doing (one paragraph)

This repo (ikigai_fitness/) is a copy of the Viva Premium Gym website (another Dehradun gym we built earlier). We are turning it into a completely new, personalised website for IKIGAI Fitness Club, Dehradun. Reuse the engine, rebuild the skin. Keep the technical foundation (Next.js static export, GSAP + Lenis, content.ts pattern, media pipeline, SEO, IST open/closed chip, WhatsApp booking, accessibility). Replace the concept, theme, intro, copy, colours, fonts and most visuals. Viva is also in Dehradun, so the final site must not look or feel like a Viva clone — no gold, no neon, no bull, no "one day at the gym" clock.

1. Folder layout
C:\Users\Neetu AI Solutions\Desktop\IKIGAI_GYM\
├── ikigai_fitness\     ← the Next.js project (this repo, copied from viva_website)
└── ikigai_media\       ← raw Ikigai photos + videos (WhatsApp exports, 2026-11-20)
OS: Windows, PowerShell terminal. Use Windows-safe paths (the path contains spaces — quote it).
Raw media: ..\ikigai_media relative to the project. Filenames look like WhatsApp Image 2026-11-20 at 10.53.10 ...jpeg and WhatsApp Video 2026-11-20 at 10.53.10 ...mp4 (spaces + dots in names — handle carefully, or copy into media-src/ with clean names like ikigai-01.mp4).
scripts/media.config.mjs currently points at ../viva_videos → repoint to the Ikigai media.
WhatsApp compresses media, so expect low resolution. Inspect each file with ffprobe first (resolution, duration, orientation) and design around what we actually have (portrait cards if footage is low-res/vertical, as Viva did).
2. Safety rules (do these before anything else)
Git: check git remote -v. If it points to github.com/axeu07/viva_website, remove that remote (git remote remove origin) or re-init git. Never push to the Viva repo.
Rename "name" in package.json → ikigai-fitness.
Delete Viva-only docs/assets: docs/intro-shapes/, Viva files in public/media/img and public/media/video, and rewrite README.md, media-map.md, docs/PLAN.md for Ikigai.
Never invent facts. Anything not confirmed below must be visibly marked with the existing Tag component (TO CONFIRM / SAMPLE) from src/components/ui.tsx. No fake prices, fake trainer names, fake reviews or fake timetables presented as real.
Finish by grepping for leftovers: Viva|VIVA|viva|bull|7060|5 AM|05:00|gold|neon — zero Viva references should remain.
3. Business facts
Confirmed (from poster + multiple public listings)
Field	Value
Name	IKIGAI Fitness Club (also has a branded zone: "Ikigai Boxing Club")
Address	138/345 First Floor, Doon Zone Tower, Jakhan, Rajpur Road, Dehradun, Uttarakhand 248001
Main phone (on poster)	+91 70173 85943
Type	Unisex gym, women-friendly (listed under "Women Gyms" too)
Facilities (poster)	Gym, Yoga, Zumba, Boxing, Bhangra, Steam, Showers, Lifting, Lockers, Cafeteria, Training, Cardio
Visible in photos	Branded boxing zone, row of air bikes, steam room with wooden bench, premium washrooms with vessel basins
Amenities (listings)	WiFi, wheelchair-accessible entrance
Reputation	~4.7–4.8★ (Justdial 4.7 / 162 ratings; Google-based aggregators 4.8). Praise themes: friendly & qualified trainers, hygiene/cleanliness, modern equipment, well-maintained, affordable for the quality, good crowd
Meaning of name (members mention it in reviews)	Ikigai = "reason for being" / "a life worth living"
Current branding	Black background, white type, subtle hexagon pattern
TO CONFIRM (use Tag, keep easy to edit in content.ts)
Field	What we have	Note
Hours	Mon–Sat 6:00 AM – 10:00 PM	Fairly consistent across listings
Sunday hours	7:00 AM – 12:00 PM (?)	Doubtful — this exact timing belonged to another gym in one source
Other phones	+91 95206 65943, +91 78189 14101	Which one is WhatsApp? Default WhatsApp to 70173 85943 until confirmed
Email	ikigaifitnessclub@gmail.com	
Instagram	@ikigaifitnessclub (750+ posts)	
Facebook	"Ikigai Fitness CLUB"	
Domain	ikigaifitnessclub.com	Ask if they still own it
Prices	₹8,000 / 6 months, ₹12,000 / 12 months	Seen in promo reels — may be offers, not standard. Monthly/quarterly unknown
Trainers	"Coach Arun" (tagged on Instagram)	Others unknown → placeholder cards
Community events	"The Morning Grind" (coffee + music sessions), Shikhar Falls treks	Great differentiator — feature them
Parking	Free on-site parking (one source)	
Rating/review count	4.8★ / 230+ Google reviews (one source)	Use one number, mark to confirm
Class timetable	Unknown	Build the timetable UI with SAMPLE data
4. Positioning — what makes Ikigai different
Everything under one roof: strength + cardio + combat (boxing) + dance (Zumba, Bhangra) + yoga + recovery (steam) + cafeteria. Most nearby Jakhan gyms are plain "gym workout" places.
A dedicated Boxing Club inside the gym — strongest differentiator; give it its own section.
Premium experience at a local price — steam room, cafeteria and premium washrooms, yet reviewers call it affordable.
Community, not just a gym — Morning Grind socials, treks.
Local soul — Bhangra; vs. incoming chains (Vault by Virat Kohli, Anytime Fitness on EC Road). Ikigai = the personal, community-driven alternative.
Women-friendly, hygienic — say it clearly.
5. Creative concept — "Four circles, one reason"

The Japanese ikigai diagram is four overlapping circles; their centre is your ikigai (iki 生き = life, gai 甲斐 = worth). We map each circle to a pillar of the gym. This replaces Viva's "one day at the gym" spine.

Ikigai circle	Pillar	Contents
What you love	JOY	Zumba, Bhangra, Yoga
What you're good at	POWER	Strength, lifting, cardio, Boxing
What the world needs	TRIBE	Morning Grind, treks, community
What you need	RESTORE	Steam, showers, lockers, cafeteria
Centre	IKIGAI	"Find your reason to move."

Core line: Find your reason to move. Alternates: Every rep has a reason. · Iki = life. Gai = worth. Train for a life worth living. · Four circles. One reason. Yours.

Fusion idea — "Japanese soul, Doon energy": a red rising sun over a Mussoorie-hills silhouette (the hills are visible from Rajpur Road). Japanese words are accents only — always paired with English, never confusing.

Visual system
Token	Value	Use
Deep black	
#0A0A0A	Main background (updated: "Find your Ikigai" direction)
Washi paper	
#F2EEE6	Primary text / light sections
Ember (accent)	
#FF5A1F	The ONE accent: CTAs, centre core, highlights (dark text on it)
Ember glow	
#FF8A3D	Glows, hovers, spotlight
Ember deep	
#C2410C	Pressed states; accent text on light (paper) sections
Hanko red	
#D7261E	The hanko stamp ONLY
Ash stone	
#8A8580	Muted text, lines
Steam gold	
#C9A36A	Sparingly, Restore section only
Fonts: Anton (headlines, condensed caps) · Inter or Manrope (body) · Noto Serif JP (kanji accents). Drop Big Shoulders / Instrument Serif / Doto unless clearly useful.
Motifs: ensō brush circle (logo mark, dividers, loader) · vertical kanji 生き甲斐 in the hero · Ikigai's existing hexagon pattern as a faint background texture (brand continuity) · ma (間) = generous negative space · section numbering "01 / 一".
Motion: the four circles drift together and overlap in the hero, then the red centre lights up · ink-bleed image reveals · punch-impact shake + red flash in Boxing · slow steam drift in Restore · Lenis smooth scroll kept. Respect prefers-reduced-motion everywhere.
Replace Viva's film grain/dust with a subtle washi-paper texture (or remove). Custom cursor can become a small ensō ring. Sound toggle: optional (taiko hit / ambient) — drop if not tasteful.
6. Section map (Viva → Ikigai)
#	Viva section	Ikigai section	Action
—	Intro: bull → VIVA morph (Intro.tsx, brand/*, geometry.ts)	Ensō intro: brush circle paints itself → "IKIGAI" + 生き甲斐 fades in. Skippable, plays once per session	Replace. Delete bull geometry. Keep the data-intro / INTRO_DONE handoff (hero waits for it)
—	Day clock (DayClock.tsx)	Four-circle progress indicator (bottom-left): JOY / POWER / TRIBE / RESTORE fill as you scroll	Replace (remove day-time lighting keyframes in motion.ts)
01	Hero "Lights on"	始め Hajime — "Find your reason to move", rising sun over hills, vertical kanji, CTAs: Book free trial / WhatsApp us	Reskin + rewrite
02	Neon wall	The Ikigai philosophy — the four circles converge on scroll, each with 1 line + photo	Replace
—	Crossing tapes	Ink-brush bands with words (BOXING · YOGA · BHANGRA · STEAM …) — or drop	Reskin / optional
03	Goal finder (treadmill console)	"Find your circle" — pick a goal → suggested pillar + program → prefills booking	Keep logic, reskin
04	Classes scoreboard	道 Michi — Programs & timetable (Gym, Cardio, Yoga, Zumba, Bhangra, Boxing, PT). NOW / NEXT UP marker. SAMPLE data	Keep, reskin
05	—	拳 Ken — Ikigai Boxing Club spotlight (photo of the branded sign, coach, beginner-friendly, batch times)	New
06	Facilities (locker doors) + Café	癒し Iyashi — Restore: steam, showers, lockers, washrooms, cafeteria (merge café here as a small "fuel" menu or simple card)	Reskin + merge
07	Trainers (Coaches)	先生 Sensei — Coach Arun + placeholders	Keep, reskin
08	Memory wall	仲間 Nakama — Tribe: Morning Grind, Shikhar Falls treks, Instagram strip + follow CTA	Keep, repurpose
09	—	改善 Kaizen — Transformations (before/after slots, all placeholders until client sends consented photos)	New
10	Big numbers (Proof)	4.8★ · reviews · hours · "6 programs" etc. + 3 real review paraphrases (no invented quotes)	Keep, reskin
11	Membership metal cards	約束 Yakusoku — Plans: ink/paper cards instead of metallic; 6 & 12-month known, others TO CONFIRM; option for "Call for pricing"	Reskin
12	Book trial (day pass)	Same WhatsApp flow; pass styled as a Japanese ticket with a red hanko stamp "IKIGAI"	Keep, reskin
13	—	FAQ (timings, parking, women batches, trial, what to bring)	New
14	—	Google Maps embed + address/contact	New
—	Footer "Lights off"	Hills silhouette + ensō, address, hours, socials, floating WhatsApp button	Rewrite

Global: Nav links updated, open/closed chip uses Ikigai hours, floating WhatsApp button on all pages.

7. Files to touch (from the Viva handover)
src/lib/content.ts — almost all copy/facts. Restructure keys to match the new sections.
src/app/layout.tsx — title, keywords ("gym in Jakhan / Rajpur Road Dehradun", "boxing Dehradun", "steam gym Dehradun"), OG alt, themeColor 
#0E0E0E, fonts.
src/lib/seo.ts — SITE_URL, amenityFeature, HealthClub, opening days.
src/lib/hours.ts — 06:00–22:00 Mon–Sat; Sunday TO CONFIRM.
src/lib/motion.ts — remove day-clock lighting keyframes.
src/app/globals.css :root tokens — new palette.
src/components/Logo.tsx — REAL_LOGO once we have the file; until then a typographic "IKIGAI" + ensō.
Hardcoded strings: DayClock.tsx, ui.tsx:35, BookTrial.tsx (lines ~80, 112, 180, 204, 247), Footer.tsx:54, Proof.tsx, Cafe.tsx, GoalFinder.tsx, CrossingTapes.tsx, NeonWall.tsx.
src/lib/intro.ts, src/lib/booking.ts — rename storage keys/events viva-* → ikigai-*.
scripts/media.config.mjs, src/lib/media.ts, media-manifest.json — new media.
OG share image 1200×630 — build one from Ikigai photos.
Build with NEXT_PUBLIC_SITE_URL=https://ikigaifitnessclub.com (TO CONFIRM domain).
8. Media plan
Inventory every file in ..\ikigai_media with ffprobe: resolution, duration, orientation, and a 1-line description of what it shows (look at a frame).
Write the inventory to media-map.md and propose which clip/photo goes to which section.
Copy into media-src/ with clean names, update media.config.mjs (crops, time ranges), run npm run media (needs ffmpeg on PATH — check ffmpeg -version).
Where we lack media for a section, use a tasteful placeholder (ink texture / brush graphic), never Viva media.
9. How to work
Phase 0 — Audit (no code changes): read AGENTS.md, this brief, src/app/page.tsx, content.ts, the components list; run git remote -v; inventory media. Then report back: current state, risks, media inventory, and a step-by-step plan. Wait for approval.
Phase 1 — Clean-up & safety: git remote, package name, delete Viva media/docs, rename keys.
Phase 2 — Theme foundation: tokens, fonts, logo placeholder, global components (nav, cursor, progress indicator, floating WhatsApp, open chip).
Phase 3 — Content: rewrite content.ts with the facts above + Tag for unconfirmed items.
Phase 4 — Sections: one or two at a time, in page order. Run npm run dev and check each in the browser (desktop + mobile width) before moving on.
Phase 5 — New sections & add-ons: Boxing, Kaizen, FAQ, Maps.
Phase 6 — Intro: ensō intro last (it's polish; keep the handoff event).
Phase 7 — QA: npm run build passes, lint clean, Viva grep returns nothing, reduced-motion works, keyboard works, Lighthouse sanity, mobile layout, all TO CONFIRM tags listed in a final report.

Keep commits small with clear messages per phase. After each phase, summarise what changed and what's next.

10. Open questions for the client (keep this list updated)
Logo file (SVG/PNG) and any brand colours
Exact Sunday hours; which number is WhatsApp
Full price list (monthly/quarterly/half-yearly/yearly, PT)
Weekly class timetable
Trainer names, photos, specialties, certifications
Founder story + year founded
Women-only batches? Free trial policy?
Transformation photos (with consent)
Domain ownership (ikigaifitnessclub.com)
Higher-resolution photos/videos (WhatsApp versions are compressed)