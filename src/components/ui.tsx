"use client";
/** Small shared UI: section labels, honesty tags, the live open/closed chip and chips. */
import { useEffect, useState, type ReactNode } from "react";
import { gymStatus, hoursFallback, type GymStatus } from "@/lib/hours";

/** `04 / 四 —— 道 Michi · Programs` style label. */
export function MicroLabel({ index, numeral, kanji, romaji, children, className = "" }: { index?: string; numeral?: string; kanji?: string; romaji?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`micro ${className}`}>
      {index && (
        <span className="micro-index">
          {index}
          {numeral && (
            <>
              {" / "}
              <span lang="ja" className="jp">{numeral}</span>
            </>
          )}
        </span>
      )}
      <span aria-hidden className="micro-rule" />
      {kanji && (
        <span className="micro-kanji">
          <span lang="ja" className="jp">{kanji}</span> {romaji && <i>{romaji}</i>}
          <span aria-hidden> · </span>
        </span>
      )}
      <span>{children}</span>
    </p>
  );
}

/** Dashed pill marking unconfirmed or demo content: TO CONFIRM / SAMPLE / PHOTO COMING. */
export function Tag({ children = "TO CONFIRM", className = "" }: { children?: ReactNode; className?: string }) {
  return <span className={`demo-tag ${className}`}>{children}</span>;
}

/** Renders a TO CONFIRM tag only when `confirmed` is false. */
export function Confirm({ confirmed, label = "TO CONFIRM" }: { confirmed: boolean; label?: string }) {
  return confirmed ? null : <Tag>{label}</Tag>;
}

/** Live status from IST: "● OPEN NOW · UNTIL 10:00 PM" / "● CLOSED · OPENS 6:00 AM". */
export function StatusChip({ className = "", bare = false }: { className?: string; bare?: boolean }) {
  const [status, setStatus] = useState<GymStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(gymStatus());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  const text = status?.text ?? hoursFallback;
  const state = status ? (status.open ? "open" : "closed") : "unknown";
  return (
    <span className={`${bare ? "status-bare" : "chip"} status ${className}`} data-state={state}>
      <span aria-hidden className="status-dot" />
      <span>{text}</span>
    </span>
  );
}

export function Chip({ children, href, className = "" }: { children: ReactNode; href?: string; className?: string }) {
  if (href) {
    return (
      <a href={href} className={`chip chip-link ${className}`}>
        {children}
      </a>
    );
  }
  return <span className={`chip ${className}`}>{children}</span>;
}
