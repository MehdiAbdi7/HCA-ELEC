"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectCartCount, selectCartHydrated } from "@/features/cart/cart.selectors";
import { CartIcon } from "@/components/site/icons";

/** Icône panier de la navbar, avec le nombre d'articles. */
export function CartButton() {
  const count = useAppSelector(selectCartCount);
  const hydrated = useAppSelector(selectCartHydrated);
  const label = count > 0 ? `Panier, ${count} article${count > 1 ? "s" : ""}` : "Panier";

  return (
    <Link
      href="/panier"
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-orange hover:text-orange"
    >
      <CartIcon className="h-4 w-4" />
      {hydrated && count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[11px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
