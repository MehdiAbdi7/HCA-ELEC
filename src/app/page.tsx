import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { TrustStrip } from "@/components/site/TrustStrip";
import { PlafonniersSection } from "@/components/site/PlafonniersSection";
import { AppliquesSection } from "@/components/site/AppliquesSection";
import { AboutSection } from "@/components/site/AboutSection";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <PlafonniersSection />
        <AppliquesSection />
        <AboutSection />
      </main>
      <Contact />
      <Footer />
    </>
  );
}
