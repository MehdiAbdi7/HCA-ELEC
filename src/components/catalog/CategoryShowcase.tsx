import Link from "next/link";
import type { CategoryId } from "@/features/catalog/catalog.types";
import {
  categoryHref,
  getCategory,
  getProductsByCategory,
} from "@/features/catalog/catalog.queries";
import { ProductCard } from "./ProductCard";
import { ProductCarousel } from "./ProductCarousel";

/**
 * Section d'accueil d'une catégorie : titre + carrousel + lien vers le
 * catalogue filtré. L'accueil reste léger, le détail est sur /produits.
 */
export function CategoryShowcase({ categoryId }: { categoryId: CategoryId }) {
  const category = getCategory(categoryId);
  const products = getProductsByCategory(categoryId);
  if (products.length === 0) return null;

  return (
    <section
      id={category.id}
      className="scroll-mt-20 px-2 md:px-5 py-10 md:py-14"
    >
      {/*
        Chaque catégorie est un bloc encadré : la bordure orange isole
        visuellement le carrousel du reste de la page. Le padding intérieur
        (px-5 / md:px-8) laisse aussi la place aux flèches, positionnées à
        -20px du rail, pour rester DANS le cadre.
      */}
      <div className=" mx-auto max-w-7xl border-2 border-surface-2 rounded-2xl bg-surface-2/20 backdrop-blur-2xl shadow-2xl shadow-surface-2 px-5 py-8 md:px-8 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-lg">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              {category.label}
            </h2>
            <p className="mt-3 text-ink-soft">{category.intro}</p>
          </div>
          <Link
            href={categoryHref(category.id)}
            className="border border-line px-6 py-2 text-sm font-medium transition-colors hover:border-orange hover:text-orange-ink"
          >
            Voir les {products.length} {category.shortLabel.toLowerCase()}
          </Link>
        </div>

        <ProductCarousel label={category.label} className="mt-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductCarousel>
      </div>
    </section>
  );
}
