# IKIGAI media map

Originals live in `../ikigai_media` (WhatsApp exports and Instagram screenshots, 2026-11-20). They are copied into `media-src/raw/` with clean names, which is git-ignored and never deployed. `npm run media` builds everything in `public/media/` and `src/lib/media-manifest.json` from `scripts/media.config.mjs`.

**Quality note:** everything is compressed. Videos are ≤720 px wide and the screenshots are about 280 px wide, so media is only shown small: circle masks, portrait cards and thumbnails. Higher-resolution originals from the client would help a lot.

## Inventory

| Clean name | Original file | Size | Length | What it shows | Quality |
|---|---|---|---|---|---|
| ikigai-poster.jpg | WhatsApp Image 10.53.10 | 1080×1258 | — | Facilities poster: 2×2 grid (Boxing Club sign, air bikes, steam room, washroom) + facility list + phone | OK; tiles are ~420×260 |
| ikigai-floor.jpg | WhatsApp Image 10.53.14 | 1280×1600 | — | Strength floor, turf sled track, wall slogan "This place will change you, if you let it." | Good, the sharpest asset |
| ikigai-shadowbox.mp4 | WhatsApp Video 10.53.10 (1) | 478×850 | 13.6 s | Man shadowboxing on a footbridge, Doon hills behind | OK |
| ikigai-dance-lead.mp4 | WhatsApp Video 10.53.10 | 478×850 | 20.6 s | Dance class, male lead in front. Burned-in logo and caption (cropped off) | OK |
| ikigai-coach-reel.mp4 | WhatsApp Video 10.53.12 | 478×850 | 14.3 s | Edited trainer promo, heavy graphics | **Unused** until the client confirms who it is |
| ikigai-airbike.mp4 | WhatsApp Video 10.53.13 | 368×464 | 5.1 s | Member on an air bike | Low-res, fine in a circle |
| ikigai-treadmills.mp4 | WhatsApp Video 10.53.14 | 720×900 | 3.1 s | Treadmill row by the daylight window | Good |
| ikigai-dance-group.mp4 | WhatsApp Video 10.53.15 | 478×850 | 21.2 s | Group dance/aerobics class, women in front | OK |
| ikigai-sign-venn.png | Screenshot 104355 | 286×464 | — | The ikigai four-circle diagram sign on the glass entrance door | Sharp, small |
| ikigai-boxing-mural.png | Screenshot 104403 | 283×456 | — | Ikigai Boxing Club sign above a boxer mural | Sharp, small |
| ikigai-floor-dark.png | Screenshot 104417 | 267×458 | — | Strength floor in low light | Sharp, small (spare) |
| ikigai-punchbag.png | Screenshot 104439 | 279×401 | — | Heavy punching bag in the wood-floored studio | Sharp, small |
| ikigai-plate-machine.png | Screenshot 104458 | 278×440 | — | Red plate-loaded strength machine | Sharp, small |
| ikigai-racks.png | Screenshot 104504 | 279×417 | — | Power racks with loaded barbells | Sharp, small |
| ikigai-dumbbells.png | Screenshot 104511 | 259×453 | — | Dumbbell rack along the mirror wall | Sharp, small |
| ikigai-functional.png | Screenshot 104516 | 284×451 | — | Functional zone: cages, plyo box, machines | Sharp, small |
| ikigai-exterior.png | Screenshot 114439 | 287×301 | — | Building front at dusk with the IKIGAI FITNESS CLUB sign | Sharp, small |

## Built assets → sections

| Asset id | Source | Used in |
|---|---|---|
| `floor-wide-blur` (backdrop) | ikigai-floor.jpg | Hero backdrop (blur + darken baked in) |
| `og.jpg` (1200×630) | ikigai-floor.jpg | Open Graph / Twitter share image |
| `joy` / `power` / `tribe` (square loops) | dance-group / airbike / shadowbox | Philosophy circles JOY, POWER, TRIBE |
| `steam-room` | poster tile | Philosophy RESTORE circle, Find your circle, Restore |
| `sign-venn` | ikigai-sign-venn.png | Philosophy ("the four circles hang on our front door") |
| `floor` | ikigai-floor.jpg | Find your circle (Get stronger), Tribe strip |
| `racks` | ikigai-racks.png | Programs: Gym floor |
| `treadmills` (loop) | ikigai-treadmills.mp4 | Programs: Cardio |
| `punchbag` | ikigai-punchbag.png | Programs: Boxing; Boxing section |
| `dance-group` (loop) | ikigai-dance-group.mp4 | Programs: Zumba; Find your circle; Tribe strip |
| `plate-machine` | ikigai-plate-machine.png | Programs: Personal training |
| `boxing-mural` | ikigai-boxing-mural.png | Boxing section (main image; replaces the poster tile) |
| `shadowbox` (loop) | ikigai-shadowbox.mp4 | Boxing section; Find your circle (Learn to box) |
| `airbike` (loop) | ikigai-airbike.mp4 | Find your circle (Lose weight) |
| `dance-lead` (loop) | ikigai-dance-lead.mp4 | Find your circle (Find my people); Tribe strip |
| `washroom` | poster tile | Restore |
| `dumbbells`, `functional` | screenshots | Tribe strip (replace the weaker air-bike poster tile) |
| `exterior` | ikigai-exterior.png | Visit (helps people find the building) |
| `boxing-sign`, `air-bikes`, `floor-dark`, `sun` | — | Built but currently unused (spares) |

## Still placeholders (ink wash + tag)

Yoga · Bhangra · Showers · Lockers · Cafeteria · trainer portraits (Sensei) · transformations (Kaizen) · Morning Grind / trek photos · real logo file.
