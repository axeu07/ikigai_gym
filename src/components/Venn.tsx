/**
 * The ikigai Venn: four thin rings (HTML, so every transform stays on the compositor) around an
 * ember core with "IKIGAI". Shared by the intro and the hero so the intro can FLIP onto the hero copy.
 */
import { pillars } from "@/lib/content";

export default function Venn({ className = "", word = true }: { className?: string; word?: boolean }) {
  return (
    <div className={`venn ${className}`} aria-hidden>
      {pillars.map((p) => (
        <div key={p.id} className={`v-ring v-${p.id}`} data-p={p.id}>
          <span className="v-notch" />
          <span className="v-word">{p.word}</span>
        </div>
      ))}
      <div className="v-flash" />
      <div className="v-core" />
      {word && <span className="v-name">IKIGAI</span>}
    </div>
  );
}
