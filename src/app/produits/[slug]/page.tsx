import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/config/site";
import {
  categoryHref,
  getAllProducts,
  getCategory,
  getCollection,
  getProductBySlug,
  getRelatedProducts,
} from "@/features/catalog/catalog.queries";
import { getDiscountPercent } from "@/lib/format";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DiscountBadge, PriceTag } from "@/components/catalog/PriceTag";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductCarousel } from "@/components/catalog/ProductCarousel";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductOrderForm } from "@/components/order/ProductOrderForm";

type ProductPageProps = { params: Promise<{ slug: string }> };

// Export statique : une page HTML est générée au build pour chaque produit,
// et toute autre URL /produits/xxx renvoie la 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description:
      `${product.name} — ${product.spec}. ${product.description}`.slice(0, 160),
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const collection = getCollection(product.collectionId);
  const related = getRelatedProducts(product);

  // Données structurées : Google peut afficher le prix dans ses résultats.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "DZD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 background md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue", href: "/produits" },
          { label: category.shortLabel, href: categoryHref(category.id) },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="notch relative aspect-square self-start overflow-hidden border border-line bg-surface md:sticky md:top-24">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 540px, 100vw"
            className="object-cover"
          />
          <DiscountBadge
            percent={getDiscountPercent(product.price, product.oldPrice)}
            className="absolute left-4 top-4 text-sm"
          />
        </div>

        <div>
          <p className="text-sm text-orange-ink">
            {collection?.title ?? category.label}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-ink-soft">{product.spec}</p>

          <PriceTag
            price={product.price}
            oldPrice={product.oldPrice}
            size="lg"
            className="mt-6"
          />

          <p className="mt-6 leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <ul className="mt-6 flex flex-col gap-2 text-sm">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-baseline gap-3">
                <span className="text-orange-ink">—</span>
                {feature}
              </li>
            ))}
          </ul>

          <AddToCartButton
            productId={product.id}
            productName={product.name}
            className="mt-8 w-full sm:w-auto"
          />

          {/* Cible du bouton "Acheter" des cartes produit (#commander).
              scroll-mt : la navbar sticky ne masque pas le titre. */}
          <section
            id="commander"
            aria-labelledby="order-title"
            className="mt-12 scroll-mt-24 border-t border-line pt-8"
          >
            <h2
              id="order-title"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              Commander ce produit
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Plusieurs produits à commander ? Ajoutez-les au panier et
              commandez tout en une fois.
            </p>
            <div className="mt-6">
              <ProductOrderForm product={product} />
            </div>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section
          aria-labelledby="related-title"
          className="mt-20 border-t border-line pt-12"
        >
          <h2
            id="related-title"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            {collection
              ? "Dans la même gamme"
              : `Autres ${category.shortLabel.toLowerCase()}`}
          </h2>
          <ProductCarousel label="Produits similaires" className="mt-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductCarousel>
        </section>
      )}
    </main>
  );
}
