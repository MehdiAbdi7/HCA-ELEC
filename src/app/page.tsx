import { Hero } from "@/components/site/Hero";
import { TrustStrip } from "@/components/site/TrustStrip";
import { AboutSection } from "@/components/site/AboutSection";
import { Contact } from "@/components/site/Contact";
import { CategoryShowcase } from "@/components/catalog/CategoryShowcase";
import { CATEGORY_IDS } from "@/features/catalog/catalog.types";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      {/* Une section carrousel par catégorie : une nouvelle catégorie
          ajoutée au catalogue apparaît ici automatiquement. */}
      {CATEGORY_IDS.map((categoryId) => (
        <CategoryShowcase key={categoryId} categoryId={categoryId} />
      ))}
      <AboutSection />
      <Contact />
    </main>
  );
}
