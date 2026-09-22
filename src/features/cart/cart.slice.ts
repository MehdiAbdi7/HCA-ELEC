import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MAX_QUANTITY_PER_PRODUCT } from "@/config/shop";

/**
 * Le panier ne stocke QUE { productId, quantity }.
 * Nom, prix, image sont relus depuis le catalogue au moment de l'affichage :
 * un prix modifié dans le catalogue ne peut jamais rester "figé" dans le
 * localStorage d'un client (même principe que resolveOrderItemsPricing côté
 * backend Niwa Food).
 */
export type CartItem = { productId: string; quantity: number };

type CartState = {
  items: CartItem[];
  /** false tant que le panier n'a pas été relu depuis localStorage (voir CartPersistence). */
  hydrated: boolean;
};

const initialState: CartState = { items: [], hydrated: false };

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY_PER_PRODUCT, Math.max(1, Math.floor(quantity)));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartHydrated(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
    itemAdded(state, action: PayloadAction<{ productId: string; quantity?: number }>) {
      const { productId, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.productId === productId);
      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + quantity);
      } else {
        state.items.push({ productId, quantity: clampQuantity(quantity) });
      }
    },
    quantityChanged(state, action: PayloadAction<CartItem>) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) item.quantity = clampQuantity(action.payload.quantity);
    },
    itemRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    cartCleared(state) {
      state.items = [];
    },
  },
});

export const { cartHydrated, itemAdded, quantityChanged, itemRemoved, cartCleared } = cartSlice.actions;
export default cartSlice.reducer;
