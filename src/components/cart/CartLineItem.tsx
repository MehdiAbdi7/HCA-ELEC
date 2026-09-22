"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { itemRemoved, quantityChanged } from "@/features/cart/cart.slice";
import { productHref } from "@/features/catalog/catalog.queries";
import type { OrderLine } from "@/features/order/order.pricing";
import { formatPrice } from "@/lib/format";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { TrashIcon } from "@/components/site/icons";

export function CartLineItem({ line }: { line: OrderLine }) {
  const dispatch = useAppDispatch();
  const { product, quantity, lineTotal } = line;
  const href = productHref(product);

  return (
    <li className="flex gap-4 py-5">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="notch relative h-24 w-24 shrink-0 overflow-hidden border border-line bg-surface">
        <Image src={product.image} alt="" fill sizes="96px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href={href} className="text-sm font-medium transition-colors hover:text-orange-ink">
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-ink-soft">{product.spec}</p>
          <p className="mt-1 text-xs text-ink-soft">{formatPrice(product.price)} l&apos;unité</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:flex-col sm:items-end">
          <QuantityStepper
            value={String(quantity)}
            editable={false}
            productName={product.name}
            onChange={(value) => dispatch(quantityChanged({ productId: product.id, quantity: Number(value) }))}
          />
          <p className="font-display font-semibold text-orange-ink">{formatPrice(lineTotal)}</p>
          <button
            type="button"
            onClick={() => dispatch(itemRemoved(product.id))}
            className="flex items-center gap-1 text-xs text-ink-soft transition-colors hover:text-red-600"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Retirer<span className="sr-only"> {product.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
