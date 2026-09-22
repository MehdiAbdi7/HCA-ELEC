import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { getOrderTotal, resolveOrderLines } from "@/features/order/order.pricing";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartHydrated = (state: RootState) => state.cart.hydrated;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((count, item) => count + item.quantity, 0),
);

/** Lignes enrichies (produit + total ligne), mémoïsées : recalculées seulement si le panier change. */
export const selectCartLines = createSelector([selectCartItems], (items) => resolveOrderLines(items));

export const selectCartTotal = createSelector([selectCartLines], (lines) => getOrderTotal(lines));

export const selectQuantityInCart = (productId: string) => (state: RootState) =>
  state.cart.items.find((item) => item.productId === productId)?.quantity ?? 0;
