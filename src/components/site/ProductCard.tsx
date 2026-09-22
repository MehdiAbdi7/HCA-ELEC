import Image from "next/image";
import type { Product } from "@/data/lighting";
import { SITE } from "@/data/lighting";
import { WhatsappIcon } from "./icons";

export function ProductCard({ product }: { product: Product }) {
  const message = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par : ${product.name} (${product.price} DA).`
  );

  return (
    <article className="group notch flex flex-col border border-line bg-surface transition-colors hover:border-orange">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="mt-0.5 text-xs text-ink-soft">{product.spec}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <p>
            <span className="mr-2 text-xs text-ink-soft line-through">
              {product.oldPrice} DA
            </span>
            <span className="font-display text-base font-semibold text-orange-ink">
              {product.price} DA
            </span>
          </p>
          <a
            href={`${SITE.whatsappHref}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Commander ${product.name} sur WhatsApp`}
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink text-bg transition-opacity hover:opacity-90 dark:bg-orange dark:text-ink"
          >
            <WhatsappIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
