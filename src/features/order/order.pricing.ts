import { resolveDeliveryFee } from "@/config/delivery";
import { getProductById } from "@/features/catalog/catalog.queries";
import type { Product } from "@/features/catalog/catalog.types";
import type { Order } from "./order.schema";

export type OrderLineInput = { productId: string; quantity: number };
export type OrderLine = { product: Product; quantity: number; lineTotal: number };

/**
 * Transforme des { productId, quantity } en lignes avec le VRAI prix du
 * catalogue. Utilisé par le panier ET par le message de commande : un seul
 * endroit calcule les prix.
 */
export function resolveOrderLines(items: readonly OrderLineInput[]): OrderLine[] {
  return items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    return [{ product, quantity: item.quantity, lineTotal: product.price * item.quantity }];
  });
}

export function getOrderTotal(lines: readonly OrderLine[]): number {
  return lines.reduce((total, line) => total + line.lineTotal, 0);
}

/** Récapitulatif chiffré d'une commande validée : produits + livraison. */
export function getOrderSummary(order: Order) {
  const lines = resolveOrderLines(order.items);
  const subtotal = getOrderTotal(lines);
  // Commande validée par Zod → la wilaya est desservie, les frais sont connus.
  const deliveryFee = order.deliveryMode === "pickup" ? 0 : (resolveDeliveryFee(order.deliveryMode, order.wilaya) ?? 0);
  return { lines, subtotal, deliveryFee, total: subtotal + deliveryFee };
}
