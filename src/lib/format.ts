import { CURRENCY_LABEL } from "@/config/shop";

/**
 * 4000 → "4 000 DA".
 * Formatage fait à la main (pas Intl.NumberFormat) pour être strictement
 * identique côté build et côté navigateur : aucun risque d'hydration mismatch
 * lié à une version d'ICU différente.
 */
export function formatPrice(amount: number): string {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `${grouped}\u00a0${CURRENCY_LABEL}`;
}

/** Pourcentage de remise arrondi, ou null s'il n'y a pas de remise. */
export function getDiscountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** Minuscules sans accents : "Éclairage" et "eclairage" matchent en recherche. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
