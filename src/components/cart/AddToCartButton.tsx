"use client";

import { useEffect, useState } from "react";
import { MAX_QUANTITY_PER_PRODUCT } from "@/config/shop";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { itemAdded } from "@/features/cart/cart.slice";
import { selectQuantityInCart } from "@/features/cart/cart.selectors";
import { CartIcon, CheckIcon } from "@/components/site/icons";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  /** "icon" = carré compact (cartes produit), "full" = bouton texte (fiche produit). */
  variant?: "icon" | "full";
  className?: string;
};

const FEEDBACK_MS = 1500;

export function AddToCartButton({ productId, productName, variant = "full", className = "" }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const quantityInCart = useAppSelector(selectQuantityInCart(productId));
  const [justAdded, setJustAdded] = useState(false);

  const isMaxed = quantityInCart >= MAX_QUANTITY_PER_PRODUCT;

  // Retour visuel "Ajouté" pendant 1,5 s, puis retour à l'état normal.
  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  const handleClick = () => {
    dispatch(itemAdded({ productId }));
    setJustAdded(true);
  };

  const Icon = justAdded ? CheckIcon : CartIcon;
  const title = isMaxed ? `Quantité maximale (${MAX_QUANTITY_PER_PRODUCT}) déjà dans le panier` : undefined;

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={isMaxed}
          title={title}
          aria-label={`Ajouter ${productName} au panier`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            justAdded ? "border-orange bg-orange text-white" : "border-line text-ink hover:border-orange hover:text-orange"
          } ${className}`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isMaxed}
          title={title}
          className={`flex h-11 items-center justify-center gap-2 border px-6 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            justAdded ? "border-orange bg-orange text-white" : "border-ink text-ink hover:border-orange hover:text-orange-ink"
          } ${className}`}
        >
          <Icon className="h-4 w-4" />
          {justAdded ? "Ajouté au panier" : "Ajouter au panier"}
        </button>
      )}
      {/* Annonce aux lecteurs d'écran, le changement d'icône seul n'est pas perçu. */}
      <span className="sr-only" aria-live="polite">
        {justAdded ? `${productName} ajouté au panier` : ""}
      </span>
    </>
  );
}
