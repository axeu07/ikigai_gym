/**
 * Media pipeline config for `npm run media`.
 * Originals: ../ikigai_media (WhatsApp exports). They are copied into media-src/raw/ with clean
 * names first (see media-map.md); the pipeline reads from media-src/raw/ (override: IKIGAI_MEDIA_SRC).
 *
 * Times are in seconds. `crop` is an ffmpeg crop (w:h:x:y) applied to the SOURCE frame
 * (removes burned-in captions/logos) before scaling. Footage is low-res WhatsApp video, so it is
 * only ever shown small: portrait cards and circle masks. Never upscale.
 */

export const sources = {
  shadowbox: { file: "ikigai-shadowbox.mp4", crop: "478:850:0:0" }, // 478x850, outdoor footbridge
  danceLead: { file: "ikigai-dance-lead.mp4", crop: "478:640:0:210" }, // 478x850, crop below the burned-in logo + caption
  airbike: { file: "ikigai-airbike.mp4", crop: "368:464:0:0" }, // 368x464
  treadmills: { file: "ikigai-treadmills.mp4", crop: "720:900:0:0" }, // 720x900, sharpest clip
  danceGroup: { file: "ikigai-dance-group.mp4", crop: "478:850:0:0" }, // 478x850
  // ikigai-coach-reel.mp4 (edited trainer promo, heavy graphics) is intentionally unused until the client confirms who it is.
};

/** Default output size for portrait loops. */
export const loopSize = { w: 360, h: 576 };
/** Square loops shown inside the ikigai circles. */
const circle = { w: 360, h: 360 };

export const clips = [
  // circles (square, centre-cropped on the subject)
  { id: "joy", size: circle, label: "Group dance class, women in front (JOY)", segments: [["danceGroup", 1.0, 8.0]], crop: { danceGroup: "478:478:0:300" } },
  { id: "power", size: circle, label: "Member on an air bike (POWER)", segments: [["airbike", 0.0, 4.9]], crop: { airbike: "368:368:0:50" } },
  { id: "tribe", size: circle, label: "Shadowboxing on a footbridge, Doon hills behind (TRIBE)", segments: [["shadowbox", 0.5, 8.0]], crop: { shadowbox: "478:478:0:300" } },
  { id: "sun", size: { w: 480, h: 480 }, label: "Treadmill row by the daylight window (hero sun circle)", boomerang: true, segments: [["treadmills", 0.0, 2.9]], crop: { treadmills: "720:720:0:120" } },
  // portrait cards
  { id: "dance-lead", size: { w: 360, h: 480 }, label: "Dance class, lead in front (caption cropped off)", segments: [["danceLead", 0.5, 9.5]] },
  { id: "dance-group", label: "Group dance / aerobics class", segments: [["danceGroup", 8.0, 16.0]] },
  { id: "shadowbox", label: "Shadowboxing outdoors on a footbridge", segments: [["shadowbox", 0.5, 10.0]] },
  { id: "airbike", size: { w: 360, h: 454 }, label: "Air bike sprint", segments: [["airbike", 0.0, 4.9]] },
  { id: "treadmills", size: { w: 480, h: 600 }, label: "Treadmill row by the window", boomerang: true, segments: [["treadmills", 0.0, 2.9]] },
];

/** Single frames worth keeping as stills (no loop). */
export const frames = [];

/**
 * Photos. `crop` (w:h:x:y) cuts the useful part of the source.
 * The poster (1080x1258) is a 2x2 collage: each tile is cut out on its own (~420x260, small).
 */
export const photos = [
  { id: "floor", file: "ikigai-floor.jpg", crop: "1180:1600:0:0", label: "Strength floor: turf sled track, plate-loaded machines, wall slogan" },
  { id: "floor-wide", file: "ikigai-floor.jpg", crop: "1280:860:0:290", label: "Strength floor, landscape crop with the wall slogan" },
  { id: "boxing-sign", file: "ikigai-poster.jpg", crop: "420:262:102:162", label: "The Ikigai Boxing Club wooden sign" },
  { id: "air-bikes", file: "ikigai-poster.jpg", crop: "420:262:572:162", label: "Row of air bikes" },
  { id: "steam-room", file: "ikigai-poster.jpg", crop: "420:258:102:458", label: "Steam room with wooden bench" },
  { id: "washroom", file: "ikigai-poster.jpg", crop: "420:258:572:458", label: "Washroom with vessel basins" },
  // Instagram screenshots (2026-11-20): small (~280px wide) but sharp and well graded. 2px trimmed off each edge.
  { id: "sign-venn", file: "ikigai-sign-venn.png", crop: "282:460:2:2", label: "The ikigai four-circle diagram sign on the glass entrance door" },
  { id: "boxing-mural", file: "ikigai-boxing-mural.png", crop: "279:452:2:2", label: "Ikigai Boxing Club sign above the boxer mural on the glass wall" },
  { id: "floor-dark", file: "ikigai-floor-dark.png", crop: "263:454:2:2", label: "Strength floor in low light: benches, plate trees, turf strip" },
  { id: "punchbag", file: "ikigai-punchbag.png", crop: "275:397:2:2", label: "Heavy punching bag in the wood-floored studio" },
  { id: "plate-machine", file: "ikigai-plate-machine.png", crop: "274:436:2:2", label: "Red plate-loaded strength machine" },
  { id: "racks", file: "ikigai-racks.png", crop: "275:413:2:2", label: "Power racks with loaded barbells" },
  { id: "dumbbells", file: "ikigai-dumbbells.png", crop: "255:449:2:2", label: "Dumbbell rack along the mirror wall" },
  { id: "functional", file: "ikigai-functional.png", crop: "280:447:2:2", label: "Functional zone: storage cages, plyo box, machines" },
  { id: "exterior", file: "ikigai-exterior.png", crop: "283:297:2:2", label: "Building front at dusk with the IKIGAI FITNESS CLUB sign" },
];

/** Hero backdrop with blur/darken baked in (no runtime CSS filters). */
export const backdropBlur = { photo: "floor-wide", sigma: 5, brightness: 0.34, saturate: 0.55 };

/** Widths for responsive photos. Widths above the source are skipped (never upscale). */
export const photoWidths = [480, 800, 1280];

/** Open Graph share image (1200x630), cut from the strength-floor photo. */
export const ogImage = { file: "ikigai-floor.jpg", crop: "1280:672:0:300", out: "og.jpg" };
