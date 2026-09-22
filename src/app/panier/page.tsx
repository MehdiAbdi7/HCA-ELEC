import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Panier",
  robots: { index: false }, // page personnelle, sans intérêt pour Google
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 background ">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Panier
      </h1>
      <CartView />
    </main>
  );
}
