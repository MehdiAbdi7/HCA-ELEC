"use client";

import { useEffect } from "react";
import { CART_STORAGE_KEY } from "@/config/shop";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cartHydrated } from "./cart.slice";
import { selectCartHydrated, selectCartItems } from "./cart.selectors";
import { loadCart, saveCart } from "./cart.storage";

/**
 * Synchronise le panier Redux avec localStorage. Ne rend rien.
 *
 * Pourquoi pas lire localStorage dans l'initialState du slice ?
 * Parce que le HTML est généré au build (export statique) avec un panier vide :
 * si le client démarrait avec un autre panier, React signalerait un
 * hydration mismatch. On démarre donc vide, puis on hydrate après le montage.
 */
export function CartPersistence() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const hydrated = useAppSelector(selectCartHydrated);

  // 1. Au montage : relecture du panier sauvegardé.
  useEffect(() => {
    dispatch(cartHydrated(loadCart()));
  }, [dispatch]);

  // 2. À chaque changement : sauvegarde (jamais avant l'hydratation,
  //    sinon on écraserait le panier sauvegardé par un panier vide).
  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  // 3. Panier modifié dans un autre onglet → on le reprend ici.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) dispatch(cartHydrated(loadCart()));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  return null;
}
