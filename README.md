# IKIGAI Fitness Club, Dehradun

Website for IKIGAI Fitness Club, Jakhan, Rajpur Road, Dehradun. Concept: **"Four circles, one reason"**. The Japanese ikigai diagram maps onto the gym's four pillars: JOY, POWER, TRIBE and RESTORE.

Next.js 16 static export · GSAP + Lenis · all copy in `src/lib/content.ts` · ffmpeg media pipeline · WhatsApp booking (no backend).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm run lint
npm run media      # rebuild media from media-src/raw (needs ffmpeg on PATH)
```

Production build with the real domain (domain TO CONFIRM):

```bash
NEXT_PUBLIC_SITE_URL=https://ikigaifitnessclub.com npm run build
```

## Editing content

- **Facts and copy:** `src/lib/content.ts`. Any value with `confirmed: false` shows a TO CONFIRM tag on the page. Flip it to `true` once the client confirms.
- **Hours / open-closed chip:** `hours` in `content.ts` (IST logic in `src/lib/hours.ts`).
- **Media:** see `media-map.md`. Add a file to `media-src/raw/`, add an entry to `scripts/media.config.mjs`, run `npm run media`, then reference its id in `content.ts`.
- **Logo:** set `REAL_LOGO` in `src/components/Logo.tsx` once the client sends the file.

Brief and rules: `IKIGAI_BRIEF.md`. Never invent prices, trainers, reviews or timetables.
