import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import { Marquee, Seam } from "@/components/BrushBands";
import { bands, programs } from "@/lib/content";
import Programs from "@/components/Programs";
import Boxing from "@/components/Boxing";
import Restore from "@/components/Restore";
import Sensei from "@/components/Sensei";
import Tribe from "@/components/Tribe";
import Proof from "@/components/Proof";
import Plans from "@/components/Plans";
import Footer from "@/components/Footer";
import { jsonLd } from "@/lib/seo";
import "@/components/compact-tail.css";
import "@/components/tail-motion.css"; // scroll motion for Restore / Sensei / Tribe / Plans
import "./mobile.css"; // phone-only compaction; keep last so it wins

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Philosophy />
        <Seam />
        <Programs />
        <Boxing />
        <Marquee words={programs.list.map((p) => p.name)} />
        <Restore />
        <Sensei />
        <Tribe />
        <Proof />
        <Marquee words={bands.b} tone="paper" />
        <Plans />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
