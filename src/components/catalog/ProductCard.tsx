import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/features/catalog/catalog.types";
import { productHref, productOrderHref } from "@/features/catalog/catalog.queries";
import { getDiscountPercent } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { DiscountBadge, PriceTag } from "./PriceTag";

export function ProductCard({ product }: { product: Product }) {
  const href = productHref(product);

  return (
    <article className="group notch flex h-full flex-col border border-line bg-surface transition-colors hover:border-orange">
      {/* Lien image retiré de la tabulation : le titre porte déjà le même lien. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 75vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <DiscountBadge percent={getDiscountPercent(product.price, product.oldPrice)} className="absolute left-3 top-3" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-medium">
            <Link href={href} className="transition-colors hover:text-orange-ink">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-ink-soft">{product.spec}</p>
        </div>

        <PriceTag price={product.price} oldPrice={product.oldPrice} className="mt-auto" />

        <div className="flex gap-2">
          <Link
            href={productOrderHref(product)}
            className="flex h-9 flex-1 items-center justify-center bg-ink text-sm font-medium text-bg transition-opacity hover:opacity-90 dark:bg-orange dark:text-ink"
          >
            Acheter
          </Link>
          <AddToCartButton productId={product.id} productName={product.name} variant="icon" />
        </div>
      </div>
    </article>
  );
}
