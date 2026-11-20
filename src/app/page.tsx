import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import BrushBands from "@/components/BrushBands";
import FindCircle from "@/components/FindCircle";
import Programs from "@/components/Programs";
import Boxing from "@/components/Boxing";
import Restore from "@/components/Restore";
import Sensei from "@/components/Sensei";
import Tribe from "@/components/Tribe";
import Kaizen from "@/components/Kaizen";
import Proof from "@/components/Proof";
import Plans from "@/components/Plans";
import BookTrial from "@/components/BookTrial";
import Faq from "@/components/Faq";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";
import { jsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Philosophy />
        <BrushBands />
        <FindCircle />
        <Programs />
        <Boxing />
        <Restore />
        <Sensei />
        <Tribe />
        <Kaizen />
        <Proof />
        <Plans />
        <BookTrial />
        <Faq />
        <Visit />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
