import { CART_STORAGE_KEY, MAX_QUANTITY_PER_PRODUCT } from "@/config/shop";
import { getProductById } from "@/features/catalog/catalog.queries";
import type { CartItem } from "./cart.slice";

/**
 * Le localStorage est modifiable par n'importe qui (devtools, extension…) :
 * on le valide comme une entrée utilisateur. Tout ce qui est invalide est
 * ignoré, et les produits retirés du catalogue disparaissent du panier.
 *
 * Validation écrite à la main plutôt qu'avec Zod : ce fichier est chargé sur
 * toutes les pages (via CartPersistence), et Zod pèse ~87 Ko compressés,
 * soit plus que React. Pour deux champs, une garde de type suffit ; Zod reste
 * utilisé là où il apporte ses messages d'erreur (formulaire de commande).
 */
function isStoredCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const { productId, quantity } = value as Record<string, unknown>;
  return (
    typeof productId === "string" &&
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= MAX_QUANTITY_PER_PRODUCT
  );
}

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    // Une seule ligne invalide → panier entier ignoré (données non fiables).
    if (!Array.isArray(parsed) || !parsed.every(isStoredCartItem)) return [];
    return parsed
      // On ne garde que les deux champs attendus, sans propriété ajoutée.
      .map(({ productId, quantity }) => ({ productId, quantity }))
      .filter((item) => getProductById(item.productId) !== undefined);
  } catch {
    return []; // JSON corrompu ou stockage indisponible
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // stockage plein ou bloqué : le panier reste utilisable pour la session
  }
}
