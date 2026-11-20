/**
 * ALL copy and facts for the IKIGAI Fitness Club site live here, so details can be edited in one file.
 * Source of truth: IKIGAI_BRIEF.md. Never invent facts.
 * Anything with `confirmed: false` (or marked TO CONFIRM / SAMPLE) renders with a visible <Tag>.
 */

export const site = {
  name: "IKIGAI Fitness Club",
  shortName: "IKIGAI",
  boxingClub: "Ikigai Boxing Club",
  city: "Dehradun",
  tagline: "Find your reason to move.",
  metaDescription:
    "IKIGAI Fitness Club, Jakhan, Rajpur Road, Dehradun. A unisex, women-friendly gym with strength, cardio, the Ikigai Boxing Club, Yoga, Zumba, Bhangra, steam and a cafeteria under one roof. Book a free trial on WhatsApp.",
  meaning: "Ikigai (生き甲斐) is Japanese for “a reason for being”: iki, life, and gai, worth.",
} as const;

/** A value plus whether the client has confirmed it. Unconfirmed values show a TO CONFIRM tag. */
export type Fact<T> = { value: T; confirmed: boolean; note?: string };

export const contact = {
  address: {
    line1: "138/345, First Floor, Doon Zone Tower",
    line2: "Jakhan, Rajpur Road",
    city: "Dehradun",
    region: "Uttarakhand",
    postalCode: "248001",
    country: "IN",
  },
  // Main number from the gym's own poster (confirmed).
  phoneDisplay: "+91 70173 85943",
  phoneE164: "+917017385943",
  // Default WhatsApp number until the client says which number is on WhatsApp.
  whatsapp: { value: "917017385943", confirmed: false, note: "Which number is on WhatsApp?" } as Fact<string>,
  otherPhones: { value: ["+91 95206 65943", "+91 78189 14101"], confirmed: false } as Fact<string[]>,
  email: { value: "ikigaifitnessclub@gmail.com", confirmed: false } as Fact<string>,
  instagram: { value: { handle: "@ikigaifitnessclub", url: "https://www.instagram.com/ikigaifitnessclub/" }, confirmed: false } as Fact<{ handle: string; url: string }>,
  facebook: { value: { name: "Ikigai Fitness CLUB", url: "https://www.facebook.com/search/top?q=Ikigai%20Fitness%20CLUB" }, confirmed: false } as Fact<{ name: string; url: string }>,
  parking: { value: "Free on-site parking", confirmed: false } as Fact<string>,
} as const;

export const waLink = (text?: string) => `https://wa.me/${contact.whatsapp.value}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telLink = `tel:${contact.phoneE164}`;
export const fullAddress = `${contact.address.line1}, ${contact.address.line2}, ${contact.address.city}, ${contact.address.region} ${contact.address.postalCode}`;
export const mapsQuery = `IKIGAI Fitness Club, Doon Zone Tower, Jakhan, Rajpur Road, Dehradun 248001`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`;

/** Hours in IST, 24 h "HH:MM". Mon–Sat is consistent across listings but still unconfirmed. */
export const hours = {
  weekdays: { days: "Mon–Sat", open: "06:00", close: "22:00", label: "6:00 AM – 10:00 PM", confirmed: false },
  // Sunday is doubtful (one source belonged to another gym), so the site treats Sunday as closed.
  sunday: { label: "Sunday hours to be confirmed", open: null as string | null, close: null as string | null, confirmed: false },
  openDays: [1, 2, 3, 4, 5, 6], // 0 = Sunday
} as const;

export const rating = { value: 4.8, count: "230+", source: "Google", confirmed: false, alt: "Justdial 4.7 from 162 ratings" } as const;

/** The twelve facilities on the gym's own poster (confirmed). */
export const facilities = ["Gym", "Yoga", "Zumba", "Boxing", "Bhangra", "Steam", "Showers", "Lifting", "Lockers", "Cafeteria", "Training", "Cardio"] as const;
export const amenities = ["Free WiFi", "Wheelchair-accessible entrance"] as const;

// ── Pillars: the four ikigai circles ────────────────────────────────────────
export type PillarId = "joy" | "power" | "tribe" | "restore";
export type MediaRef = { video?: string; photo?: string; alt?: string };
export type Pillar = { id: PillarId; word: string; circle: string; jp: string; line: string; items: string[]; media: MediaRef };

export const pillars: Pillar[] = [
  { id: "joy", word: "Joy", circle: "What you love", jp: "好き", line: "Movement you look forward to. Zumba, Bhangra and Yoga, with music and people.", items: ["Zumba", "Bhangra", "Yoga"], media: { video: "joy" } },
  { id: "power", word: "Power", circle: "What you're good at", jp: "力", line: "Get stronger every week. Lifting, strength, cardio and our own Boxing Club.", items: ["Strength", "Lifting", "Cardio", "Boxing"], media: { video: "power" } },
  { id: "tribe", word: "Tribe", circle: "What the world needs", jp: "仲間", line: "People who show up for you. Morning sessions, treks and a good crowd.", items: ["Community", "Group classes", "Treks"], media: { video: "tribe" } },
  { id: "restore", word: "Restore", circle: "What you need", jp: "癒し", line: "Recover properly. Steam, showers, lockers and a cafeteria to refuel.", items: ["Steam", "Showers", "Lockers", "Cafeteria"], media: { photo: "steam-room", alt: "The steam room at IKIGAI with its wooden bench" } },
];
export const pillarById = (id: PillarId) => pillars.find((p) => p.id === id)!;

// ── Sections: id, number, Japanese numeral, optional kanji accent (always paired with English) ──
export const sections = [
  { id: "top", index: "01", numeral: "一", kanji: "始め", romaji: "Hajime", label: "Begin" },
  { id: "philosophy", index: "02", numeral: "二", kanji: "生き甲斐", romaji: "Ikigai", label: "Four circles, one reason" },
  { id: "programs", index: "03", numeral: "三", kanji: "道", romaji: "Michi", label: "Programs & timetable" },
  { id: "boxing", index: "04", numeral: "四", kanji: "拳", romaji: "Ken", label: "Ikigai Boxing Club" },
  { id: "restore", index: "05", numeral: "五", kanji: "癒し", romaji: "Iyashi", label: "Restore" },
  { id: "sensei", index: "06", numeral: "六", kanji: "先生", romaji: "Sensei", label: "Coaches" },
  { id: "tribe", index: "07", numeral: "七", kanji: "仲間", romaji: "Nakama", label: "The tribe" },
  { id: "proof", index: "08", numeral: "八", kanji: "改善", romaji: "Kaizen", label: "Reviews & progress" },
  { id: "plans", index: "09", numeral: "九", kanji: "約束", romaji: "Yakusoku", label: "Membership & free trial" },
  { id: "visit", index: "10", numeral: "十", kanji: "", romaji: "", label: "Visit us" },
] as const;
export type SectionId = (typeof sections)[number]["id"];
export const sectionById = (id: SectionId) => sections.find((s) => s.id === id)!;

/** Which sections fill which circle of the progress indicator. */
export const progressMap: { pillar: PillarId; from: SectionId; to: SectionId }[] = [
  { pillar: "joy", from: "philosophy", to: "programs" },
  { pillar: "power", from: "boxing", to: "boxing" },
  { pillar: "restore", from: "restore", to: "restore" },
  { pillar: "tribe", from: "sensei", to: "proof" },
];

export const nav = {
  links: [
    { label: "Ikigai", href: "#philosophy" },
    { label: "Programs", href: "#programs" },
    { label: "Boxing", href: "#boxing" },
    { label: "Restore", href: "#restore" },
    { label: "Tribe", href: "#tribe" },
    { label: "Plans", href: "#plans" },
    { label: "Visit", href: "#visit" },
  ],
  cta: { label: "Book free trial", href: "#book" },
} as const;

// ── 01 Hero ─────────────────────────────────────────────────────────────────
export const hero = {
  kicker: "IKIGAI Fitness Club · Jakhan, Rajpur Road · Dehradun",
  headline: ["Find your", "Ikigai"],
  tagline: "Find your reason to move.",
  sub: "Strength, cardio, boxing, dance, yoga and recovery under one roof. A unisex, women-friendly gym with a community that keeps you coming back.",
  /** two full portrait loops framing the dark centre: treadmill promo on the left, Zumba class on the right */
  video: "hero-reel",
  videoRight: "hero-zumba",
  ctaPrimary: { label: "Book a free trial", href: "#book" },
  ctaWhatsApp: { label: "WhatsApp us", text: "Hi IKIGAI! I'd like to know more about joining." },
  wallLine: "This place will change you, if you let it.",
  wallNote: "Painted on our gym-floor wall",
} as const;

// ── 02 Philosophy ───────────────────────────────────────────────────────────
export const philosophy = {
  heading: "Four circles. One reason. Yours.",
  intro: "The Japanese ikigai is drawn as four overlapping circles. Where they meet is your reason for being. We built the gym the same way.",
  centre: { word: "Ikigai", line: "Where all four meet. Find your reason to move." },
  signNote: "The four circles hang on our front door.",
} as const;

export const bands = {
  a: ["Boxing", "Yoga", "Bhangra", "Steam", "Zumba", "Lifting", "Cardio"],
  b: ["Iki = life", "Gai = worth", "Every rep has a reason", "Train for a life worth living"],
} as const;

// ── (retired) Find your circle — section removed; data kept for the booking prefill ─────────────────────────────────────────────────────
// Suggestions only (SAMPLE): built from things IKIGAI offers. Nothing here is a fixed program.
export type GoalId = "fun" | "stronger" | "box" | "fitter" | "unwind" | "people";
export type Goal = { id: GoalId; label: string; pillar: PillarId; program: string; try: string[]; media: MediaRef };
export const finder = {
  heading: "Which circle are you starting in?",
  sub: "Pick what you want most right now. We'll point you to a place to start. You can switch circles any time.",
  cta: "Start here with a free trial",
  goals: [
    { id: "fun", label: "Have fun moving", pillar: "joy", program: "Dance & flow", try: ["Zumba", "Bhangra", "Yoga"], media: { video: "dance-group" } },
    { id: "stronger", label: "Get stronger", pillar: "power", program: "Strength foundations", try: ["Lifting", "Strength floor", "Trainer guidance"], media: { photo: "floor", alt: "The IKIGAI strength floor" } },
    { id: "box", label: "Learn to box", pillar: "power", program: "Boxing Club starter", try: ["Ikigai Boxing Club", "Cardio", "Conditioning"], media: { video: "shadowbox" } },
    { id: "fitter", label: "Lose weight, get fitter", pillar: "power", program: "Burn & build", try: ["Cardio", "Air bikes", "Zumba"], media: { video: "airbike" } },
    { id: "unwind", label: "De-stress & recover", pillar: "restore", program: "Slow & steady", try: ["Yoga", "Steam", "Showers"], media: { photo: "steam-room", alt: "The steam room" } },
    { id: "people", label: "Find my people", pillar: "tribe", program: "Join the tribe", try: ["Group classes", "Community mornings", "Treks"], media: { video: "dance-lead" } },
  ] as Goal[],
};

// ── 04 Michi: programs + SAMPLE timetable ────────────────────────────────────
export const programs = {
  heading: "Seven ways in.",
  sub: "Everything below happens under one roof at Jakhan. Every class has a beginner pace.",
  list: [
    { name: "Gym floor", jp: "鍛錬", line: "Plate-loaded machines, power racks and free weights, with a turf track down the middle.", pillar: "power", media: { photo: "racks", alt: "Power racks with loaded barbells on the IKIGAI floor" } },
    { name: "Cardio", jp: "持久", line: "Treadmills by the window and a row of air bikes.", pillar: "power", media: { video: "treadmills" } },
    { name: "Boxing", jp: "拳闘", line: "Our own Ikigai Boxing Club zone, inside the gym.", pillar: "power", media: { photo: "punchbag", alt: "A heavy punching bag in the IKIGAI studio" } },
    { name: "Yoga", jp: "ヨガ", line: "Mobility, breath and calm.", pillar: "joy", media: { photo: "yoga", alt: "Two women holding a side-angle yoga stretch" } },
    { name: "Zumba", jp: "ズンバ", line: "High-energy dance cardio.", pillar: "joy", media: { video: "dance-group" } },
    { name: "Bhangra", jp: "バングラ", line: "Doon energy, Punjabi beats. A proper workout.", pillar: "joy", media: { photo: "bhangra", alt: "A dance class mid-move, led from the front" } },
    { name: "Personal training", jp: "個人指導", line: "One-to-one coaching with a plan built for you.", pillar: "power", media: { photo: "plate-machine", alt: "A red plate-loaded strength machine" } },
  ] as { name: string; jp: string; line: string; pillar: PillarId; media: MediaRef | null }[],
};

export type ClassSlot = { time: string; mins: number; name: string; pillar: PillarId };
const dayA: ClassSlot[] = [
  { time: "07:00", mins: 60, name: "Yoga", pillar: "joy" },
  { time: "08:00", mins: 45, name: "Zumba", pillar: "joy" },
  { time: "18:00", mins: 60, name: "Boxing", pillar: "power" },
  { time: "19:00", mins: 45, name: "Bhangra", pillar: "joy" },
];
const dayB: ClassSlot[] = [
  { time: "07:00", mins: 45, name: "Zumba", pillar: "joy" },
  { time: "08:00", mins: 60, name: "Boxing", pillar: "power" },
  { time: "18:00", mins: 60, name: "Yoga", pillar: "joy" },
  { time: "19:00", mins: 45, name: "Zumba", pillar: "joy" },
];
export const timetable = {
  note: "Sample timetable to show the layout. Real batch times to be confirmed by IKIGAI.",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const,
  schedule: [dayA, dayB, dayA, dayB, dayA, dayB] as ClassSlot[][],
};

// ── 05 Ken: Ikigai Boxing Club ───────────────────────────────────────────────
export const boxing = {
  heading: ["A boxing club", "inside your gym."],
  sub: "The Ikigai Boxing Club is a dedicated, branded zone on the floor. Learn the stance, the jab and the footwork, then build the conditioning that comes with it.",
  points: [
    { title: "Its own zone", line: "A branded boxing area inside the gym, not a corner of the cardio floor.", confirmed: true },
    { title: "Beginner-friendly", line: "Start from zero. No gloves or experience needed to try.", confirmed: false },
    { title: "Coach", line: "Coach name and batch times to be confirmed.", confirmed: false },
  ],
  punch: "Throw a jab",
  media: {
    /** banner background (the club sign + boxer mural) */
    banner: "boxing-mural",
    clip: { video: "shadowbox" },
  },
} as const;

// ── 05 Iyashi: Restore (café merged in) ─────────────────────────────────────
/** jp = kanji painted on the locker door (always shown with the English name). */
export type RestoreItem = { id: string; name: string; jp: string; line: string; media: MediaRef | null };
export const restore = {
  heading: "Recovery is part of the workout.",
  sub: "The things most local gyms skip, and the reason members call IKIGAI premium at a local price.",
  items: [
    { id: "steam", name: "Steam room", jp: "蒸し風呂", line: "Proper heat, soft light. Loosen up after a heavy day.", media: { photo: "restore-steam", alt: "Tiled steam room with benches, warm light and drifting steam" } },
    { id: "washrooms", name: "Premium washrooms", jp: "洗面所", line: "Clean, modern washrooms with vessel basins.", media: { photo: "restore-washroom", alt: "Marble washroom counter with vessel basins and backlit mirrors" } },
    { id: "showers", name: "Showers", jp: "シャワー", line: "Shower before you head to work or college.", media: { photo: "restore-showers", alt: "Row of glass-screened rain showers" } },
    { id: "lockers", name: "Lockers", jp: "ロッカー", line: "Keep your bag and phone safe while you train.", media: { photo: "restore-lockers", alt: "Wooden locker room with a bench" } },
  ] as RestoreItem[],
  cafe: {
    name: "Cafeteria",
    line: "Refuel right after your session.",
    menuNote: "Menu and prices to be confirmed.",
  },
  hygiene: "Members keep mentioning hygiene and cleanliness in reviews. We intend to keep it that way.",
} as const;

// ── 07 Sensei ───────────────────────────────────────────────────────────────
export const sensei = {
  heading: "Coaches who know your name.",
  sub: "Reviewers describe IKIGAI's trainers as friendly and qualified. Full team profiles are coming soon.",
  people: [
    // photo = AI-generated stand-in portrait (shown with a SAMPLE PHOTO tag) until real trainer photos arrive
    { name: "Coach Arun", role: "Coach", confirmed: false, photo: "coach-01" },
    { name: "Trainer", role: "Name to confirm", confirmed: false, photo: "coach-02" },
    { name: "Trainer", role: "Name to confirm", confirmed: false, photo: "coach-03" },
    { name: "Trainer", role: "Name to confirm", confirmed: false, photo: "coach-04" },
  ],
} as const;

// ── 08 Nakama: the tribe ────────────────────────────────────────────────────
export const tribe = {
  bg: "functional",
  heading: "Not just a gym. A tribe.",
  sub: "Come for the workout, stay for the people.",
  events: [
    { name: "The Morning Grind", line: "Coffee, music and an easy start to the day, together.", confirmed: false },
    { name: "Shikhar Falls treks", line: "Out of the gym and into the Doon hills with the crew.", confirmed: false },
  ],
  strip: [
    { video: "dance-group", caption: "Class night" },
    { video: "tribe", caption: "Training outdoors" },
    { photo: "floor", caption: "The floor", alt: "The IKIGAI strength floor with a turf track" },
    { video: "dance-lead", caption: "Just another day at Ikigai" },
    { photo: "dumbbells", caption: "Dumbbell row", alt: "Dumbbell rack along the mirror wall" },
    { photo: "functional", caption: "Functional zone", alt: "Functional training zone with a plyo box" },
  ] as (MediaRef & { caption: string })[],
  follow: "Follow the tribe",
} as const;

// ── 08 Kaizen: reviews + progress (one section) ─────────────────────────────
export const proof = {
  heading: "Small steps. Real results.",
  sub: "Kaizen means continuous improvement. Here's what members say about training with us, and where their progress stories will go.",
  reviews: { title: "What members keep saying" },
  progress: {
    title: "Member progress",
    line: "Real transformations will appear here, shared with each member's permission.",
    slots: 3,
  },
  numbers: [
    { value: "4.8", suffix: "★", label: "Google rating", confirmed: false },
    { value: "230", suffix: "+", label: "Google reviews", confirmed: false },
    { value: "12", suffix: "", label: "Facilities under one roof", confirmed: true },
    { value: "7", suffix: "", label: "Ways to train", confirmed: true },
  ],
  themes: [
    { title: "Friendly, qualified trainers", line: "The trainers come up again and again: approachable, knowledgeable, patient with beginners." },
    { title: "Clean and hygienic", line: "Members point out how well-kept and clean the gym is." },
    { title: "Modern, maintained equipment", line: "Good machines that are looked after." },
    { title: "Affordable for the quality", line: "Premium touches like steam and a cafeteria, at a local price." },
  ],
  note: "Themes summarised from public reviews (Google, Justdial). Not direct quotes.",
} as const;

// ── 09 Yakusoku: plans ──────────────────────────────────────────────────────
// `demoPrice` is a placeholder for layout only (shown with a SAMPLE tag), NOT a real IKIGAI price.
// Replace with the client's real price list (then move it to `price` and set confirmed: true).
export type Plan = { id: string; name: string; price: string | null; demoPrice?: string; per: string; confirmed: boolean; note: string; featured?: boolean };
export const plans = {
  heading: "A promise to yourself.",
  sub: "Simple plans. Ask us anything before you join.",
  list: [
    { id: "monthly", name: "Monthly", price: null, demoPrice: "₹2,000", per: "/ month", confirmed: false, note: "Demo price. Call or WhatsApp for the real one." },
    { id: "quarterly", name: "3 months", price: null, demoPrice: "₹5,000", per: "/ 3 months", confirmed: false, note: "Demo price. Call or WhatsApp for the real one." },
    { id: "half", name: "6 months", price: "₹8,000", per: "/ 6 months", confirmed: false, note: "Seen in a promo. May be an offer." },
    { id: "annual", name: "12 months", price: "₹12,000", per: "/ 12 months", confirmed: false, note: "Seen in a promo. May be an offer.", featured: true },
    { id: "pt", name: "Personal training", price: null, demoPrice: "₹7,000", per: "/ month", confirmed: false, note: "Demo price. Call or WhatsApp for the real one." },
  ] as Plan[],
} as const;

// ── 12 Book ─────────────────────────────────────────────────────────────────
export const booking = {
  heading: "Your first day is on us.",
  sub: "Tell us when you'd like to come in. We'll confirm on WhatsApp.",
  trialConfirmed: false,
  interests: ["Free trial", "Membership", "Boxing Club", "Personal training", "Yoga / Zumba / Bhangra"] as const,
} as const;

// ── 13 Visit + footer ───────────────────────────────────────────────────────
export const visit = {
  heading: "Come and see it.",
  sub: "First floor, Doon Zone Tower, on Rajpur Road at Jakhan.",
  /** background: the building front with the IKIGAI FITNESS CLUB sign */
  bg: "exterior",
  mapButton: "Load the map",
  mapNote: "Loads Google Maps",
} as const;

export const footer = {
  line: "Find your reason to move.",
  meaning: "生き甲斐 · iki, life · gai, worth",
} as const;
