/** Règles métier de la boutique, partagées entre le panier et le formulaire. */

export const CURRENCY_LABEL = "DA";

/**
 * Quantité max par produit. Utilisée à deux endroits qui DOIVENT rester
 * alignés : le clamp du panier (cart.slice) et la validation Zod (order.schema).
 */
export const MAX_QUANTITY_PER_PRODUCT = 20;

/** Clé localStorage du panier (préfixée pour éviter les collisions). */
export const CART_STORAGE_KEY = "hca-elec:cart";
