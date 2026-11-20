/** Floating WhatsApp button on every page (bottom-right). */
import { waLink } from "@/lib/content";
import { WhatsAppIcon } from "./Button";

export default function FloatingWhatsApp() {
  return (
    <a href={waLink("Hi IKIGAI! I have a question.")} target="_blank" rel="noopener noreferrer" className="fab-wa" aria-label="Chat with IKIGAI on WhatsApp (opens in a new tab)">
      <WhatsAppIcon className="fab-wa-icon" />
      <span className="fab-wa-label">WhatsApp</span>
    </a>
  );
}
