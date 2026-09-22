"use client";

import { useMemo, useState } from "react";
import { MAX_QUANTITY_PER_PRODUCT } from "@/config/shop";
import { DELIVERY_MODE_LABELS } from "@/config/delivery";
import type { Product } from "@/features/catalog/catalog.types";
import { useOrderForm } from "@/features/order/useOrderForm";
import { formatPrice } from "@/lib/format";
import { FormField } from "@/components/ui/FormField";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { CustomerFields } from "./CustomerFields";
import { OrderSentPanel } from "./OrderSentPanel";
import { OrderSubmitButton } from "./OrderSubmitButton";

/** Commande directe d'UN produit, depuis sa fiche (bouton "Acheter"). */
export function ProductOrderForm({ product }: { product: Product }) {
  // String : le client doit pouvoir effacer le champ pour retaper.
  const [quantityInput, setQuantityInput] = useState("1");
  const quantity = quantityInput === "" ? Number.NaN : Number(quantityInput);

  const items = useMemo(() => [{ productId: product.id, quantity }], [product.id, quantity]);
  const form = useOrderForm({ items });

  if (form.status === "sent" && form.whatsappUrl) {
    return <OrderSentPanel whatsappUrl={form.whatsappUrl} onBack={form.backToForm} />;
  }

  const quantityPath = "items.0.quantity";
  const quantityIds = form.ids(quantityPath);
  const quantityError = form.errorFor(quantityPath);
  const subtotal = Number.isInteger(quantity) && quantity > 0 ? product.price * quantity : null;

  return (
    <form onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField
        label="Quantité"
        required
        {...quantityIds}
        hint={`Entre 1 et ${MAX_QUANTITY_PER_PRODUCT} par commande.`}
        error={quantityError}
      >
        <QuantityStepper
          id={quantityIds.inputId}
          value={quantityInput}
          onChange={setQuantityInput}
          onBlur={() => form.markTouched(quantityPath)}
          productName={product.name}
          invalid={Boolean(quantityError)}
          describedBy={quantityError ? `${quantityIds.hintId} ${quantityIds.errorId}` : quantityIds.hintId}
        />
      </FormField>

      <CustomerFields form={form} />

      <div className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-soft">Sous-total produits</span>
          <span>{subtotal !== null ? formatPrice(subtotal) : "—"}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-ink-soft">{DELIVERY_MODE_LABELS[form.values.deliveryMode]}</span>
          <span className={form.deliveryFee === null ? "text-right text-ink-soft" : undefined}>
            {form.deliveryFee === null
              ? "Choisissez votre wilaya"
              : form.deliveryFee === 0
                ? "Offert"
                : formatPrice(form.deliveryFee)}
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-3">
          <span className="font-medium">Total</span>
          <span className="font-display text-2xl font-semibold text-orange-ink">
            {subtotal !== null ? formatPrice(subtotal + (form.deliveryFee ?? 0)) : "—"}
            {subtotal !== null && form.deliveryFee === null && (
              <span className="ml-1 text-xs font-normal text-ink-soft">+ livraison</span>
            )}
          </span>
        </div>
      </div>

      <OrderSubmitButton />
    </form>
  );
}
