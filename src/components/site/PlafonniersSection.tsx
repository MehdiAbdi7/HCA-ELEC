import { plafonniers } from "@/data/lighting";
import { ProductCard } from "./ProductCard";

export function PlafonniersSection() {
  return (
    <section id="plafonniers" className="border-b border-line py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-lg">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Plafonniers LED
          </h2>
          <p className="mt-3 text-ink-soft">
            56W, Ø40cm, réglables sur 3 positions de couleur (chaud, neutre,
            froid). Neuf finitions disponibles en magasin.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {plafonniers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
