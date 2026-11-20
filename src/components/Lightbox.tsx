"use client";
/**
 * Lightbox on the native <dialog> (focus trap, Esc and inert background for free). Prev/next with
 * buttons and arrow keys; click on the backdrop closes. Media is rendered by the caller.
 */
import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  caption: string;
  counter: string;
  children: ReactNode;
};

export default function Lightbox({ open, onClose, onPrev, onNext, caption, counter, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={caption}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onNext();
        if (e.key === "ArrowLeft") onPrev();
      }}
    >
      {open && (
        <figure className="lb-figure">
          <div className="lb-media">{children}</div>
          <figcaption>
            <span>{caption}</span>
            <span className="lb-count">{counter}</span>
          </figcaption>
        </figure>
      )}
      <button type="button" className="lb-btn lb-prev" onClick={onPrev} aria-label="Previous photo">
        ←
      </button>
      <button type="button" className="lb-btn lb-next" onClick={onNext} aria-label="Next photo">
        →
      </button>
      <button type="button" className="lb-btn lb-close" onClick={onClose} aria-label="Close">
        ×
      </button>
    </dialog>
  );
}
