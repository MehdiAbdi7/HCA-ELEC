"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { CartPersistence } from "@/features/cart/CartPersistence";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartPersistence />
      {children}
    </Provider>
  );
}
