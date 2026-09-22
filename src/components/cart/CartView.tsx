"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cartCleared } from "@/features/cart/cart.slice";
import {
  selectCartCount,
  selectCartHydrated,
  selectCartItems,
  selectCartLines,
  selectCartTotal,
} from "@/features/cart/cart.selectors";
import { DELIVERY_MODE_LABELS } from "@/config/delivery";
import { useOrderForm } from "@/features/order/useOrderForm";
import { formatPrice } from "@/lib/format";
import { CustomerFields } from "@/components/order/CustomerFields";
import { OrderSentPanel } from "@/components/order/OrderSentPanel";
import { OrderSubmitButton } from "@/components/order/OrderSubmitButton";
import { FieldError } from "@/components/ui/FormField";
import { CartLineItem } from "./CartLineItem";

export function CartView() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectCartHydrated);
  const items = useAppSelector(selectCartItems);
  const lines = useAppSelector(selectCartLines);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);
  const form = useOrderForm({ items });

  // Tant que localStorage n'est pas relu, on ne sait pas si le panier est vide.
  if (!hydrated) {
    return (
      <div className="mt-8 h-72 animate-pulse bg-surface-2" aria-busy="true" />
    );
  }

  if (form.status === "sent" && form.whatsappUrl) {
    return (
      <div className="mt-8 max-w-xl">
        <OrderSentPanel whatsappUrl={form.whatsappUrl} onBack={form.backToForm}>
          {/* On ne vide PAS le panier automatiquement : on ne sait pas si
              le client a réellement appuyé sur "Envoyer" dans WhatsApp. */}
          <button
            type="button"
            onClick={() => {
              dispatch(cartCleared());
              form.reset();
            }}
            className="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-orange"
          >
            Commande envoyée, vider le panier
          </button>
        </OrderSentPanel>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-8 border border-dashed border-line px-6 py-16 text-center">
        <p className="font-display text-xl font-semibold">
          Votre panier est vide
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Ajoutez des produits depuis le catalogue pour préparer votre commande.
        </p>
        <Link
          href="/produits"
          className="mt-6 inline-block bg-ink px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 dark:bg-orange dark:text-ink"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const itemsError = form.errorFor("items");
  const { deliveryFee } = form;

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
      <section aria-labelledby="cart-items-title">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <h2
            id="cart-items-title"
            className="font-display text-lg font-semibold"
          >
            {count} article{count > 1 ? "s" : ""}
          </h2>
          <button
            type="button"
            onClick={() => dispatch(cartCleared())}
            className="text-xs text-ink-soft transition-colors hover:text-red-600"
          >
            Vider le panier
          </button>
        </div>
        <ul className="divide-y divide-line">
          {lines.map((line) => (
            <CartLineItem key={line.product.id} line={line} />
          ))}
        </ul>
      </section>

      {/* Desktop : le bloc reste fixe à l'écran (sticky) et ne dépasse jamais
          sa hauteur. Le résumé et le bouton d'envoi restent toujours visibles,
          seuls les champs du formulaire scrollent à l'intérieur. */}
      <aside className="notch flex flex-col self-start border border-line bg-surface p-5 md:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)]">
        <dl className="flex shrink-0 flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Sous-total produits</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-soft">
              {DELIVERY_MODE_LABELS[form.values.deliveryMode]}
            </dt>
            {/* Les frais suivent le mode et la wilaya choisis plus bas dans le formulaire. */}
            <dd
              className={
                deliveryFee === null ? "text-right text-ink-soft" : undefined
              }
            >
              {deliveryFee === null
                ? "Choisissez votre wilaya"
                : deliveryFee === 0
                  ? "Offert"
                  : formatPrice(deliveryFee)}
            </dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3">
            <dt className="font-medium">Total</dt>
            <dd className="font-display text-2xl font-semibold text-orange-ink">
              {formatPrice(total + (deliveryFee ?? 0))}
              {deliveryFee === null && (
                <span className="ml-1 text-xs font-normal text-ink-soft">
                  + livraison
                </span>
              )}
            </dd>
          </div>
        </dl>

        <h2 className="mt-8 shrink-0 font-display text-lg font-semibold">
          Vos coordonnées
        </h2>

        {/* min-h-0 : sans lui, un enfant flex refuse de rétrécir et le scroll interne ne s'active pas. */}
        <form
          onSubmit={form.handleSubmit}
          noValidate
          className="mt-4 flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-1 pr-3 [scrollbar-color:var(--line)_transparent] scrollbar-thin">
            <CustomerFields form={form} />
            {itemsError && (
              <div className="mt-5">
                <FieldError message={itemsError} />
              </div>
            )}
          </div>
          <div className="shrink-0 border-t border-line pt-4 mt-4">
            <OrderSubmitButton />
          </div>
        </form>
      </aside>
    </div>
  );
}
