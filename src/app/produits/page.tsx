import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/features/catalog/catalog.queries";
import { CatalogSkeleton, CatalogView } from "@/components/catalog/CatalogView";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Plafonniers LED et appliques murales en stock à Alger : filtrez par catégorie, gamme et prix.",
};

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Catalogue</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Tous les produits d&apos;éclairage disponibles en magasin, avec leur prix. Commandez en ligne, retirez à Tixeraine
        ou faites-vous livrer.
      </p>

      {/* CatalogView lit les filtres dans l'URL (useSearchParams) :
          en export statique, Next exige une frontière Suspense autour. */}
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView products={getAllProducts()} />
      </Suspense>
    </main>
  );
}
