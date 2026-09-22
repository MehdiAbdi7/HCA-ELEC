import { appliqueGroups } from "@/data/lighting";
import { ProductCard } from "./ProductCard";

export function AppliquesSection() {
  return (
    <section id="appliques" className="border-b border-line py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-lg">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Appliques murales
          </h2>
          <p className="mt-3 text-ink-soft">
            Pour l&apos;intérieur ou l&apos;extérieur, du modèle discret au
            plus décoratif.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-14">
          {appliqueGroups.map((group) => (
            <div key={group.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                <h3 className="font-display text-lg font-semibold">
                  {group.title}
                </h3>
                <p className="text-sm text-ink-soft">{group.intro}</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {group.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
