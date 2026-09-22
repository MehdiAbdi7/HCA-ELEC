import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/features/theme/themeSlice";
import cartReducer from "@/features/cart/cart.slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
