import { z } from "zod";
import { CART_STORAGE_KEY, MAX_QUANTITY_PER_PRODUCT } from "@/config/shop";
import { getProductById } from "@/features/catalog/catalog.queries";
import type { CartItem } from "./cart.slice";

/**
 * Le localStorage est modifiable par n'importe qui (devtools, extension…) :
 * on le valide comme une entrée utilisateur. Tout ce qui est invalide est
 * ignoré, et les produits retirés du catalogue disparaissent du panier.
 */
const storedCartSchema = z.array(
  z.object({
    productId: z.string(),
    quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_PRODUCT),
  }),
);

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = storedCartSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return [];
    return parsed.data.filter((item) => getProductById(item.productId) !== undefined);
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
