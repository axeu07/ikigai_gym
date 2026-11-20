/**
 * Open / closed status against the gym's hours in IST (Asia/Kolkata), whatever the visitor's timezone.
 * Hours come from content.ts. Sunday hours are unconfirmed, so Sunday reads as closed.
 */
import { hours } from "./content";

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const to12h = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

const OPEN_MIN = toMinutes(hours.weekdays.open);
const CLOSE_MIN = toMinutes(hours.weekdays.close);
const OPEN_DAYS: readonly number[] = hours.openDays;

export type GymStatus = { open: boolean; text: string };

export function istNow(now = new Date()) {
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60_000);
  return { day: ist.getDay(), mins: ist.getHours() * 60 + ist.getMinutes() };
}

export function gymStatus(now = new Date()): GymStatus {
  const { day, mins } = istNow(now);
  const openDay = OPEN_DAYS.includes(day);
  const opens = to12h(hours.weekdays.open);
  if (openDay && mins >= OPEN_MIN && mins < CLOSE_MIN) return { open: true, text: `Open now · until ${to12h(hours.weekdays.close)}` };
  if (openDay && mins < OPEN_MIN) return { open: false, text: `Closed · opens ${opens}` };
  const tomorrow = (day + 1) % 7;
  if (OPEN_DAYS.includes(tomorrow)) return { open: false, text: `Closed · opens ${opens}` };
  const next = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][OPEN_DAYS.find((d) => d > day) ?? OPEN_DAYS[0]];
  return { open: false, text: `Closed · opens ${next} ${opens}` };
}

export const hoursFallback = `${hours.weekdays.days} · ${hours.weekdays.label}`;
