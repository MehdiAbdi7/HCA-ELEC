"use client";

import { useMemo } from "react";
import { SITE } from "@/config/site";
import {
  DELIVERY_MODES,
  DELIVERY_MODE_LABELS,
  WILAYAS,
  formatWilaya,
  isShippingMode,
  type DeliveryMode,
} from "@/config/delivery";
import { formatPrice } from "@/lib/format";
import type { OrderFormController } from "@/features/order/useOrderForm";
import { FieldError, FormField, inputClassName } from "@/components/ui/FormField";

const NOTE_MAX_LENGTH = 300;

const MODE_DESCRIPTIONS: Record<DeliveryMode, string> = {
  pickup: SITE.address,
  domicile: "Le livreur vous apporte la commande",
  stopdesk: "À retirer au bureau du transporteur",
};

/**
 * Champs client communs à la fiche produit et au panier.
 * Purement visuel : toute la logique (valeurs, erreurs, frais) vient du hook
 * useOrderForm et de la grille tarifaire config/delivery.
 */
export function CustomerFields({ form }: { form: OrderFormController }) {
  const { values, deliveryFee } = form;
  const deliveryIds = form.ids("deliveryMode");
  const deliveryError = form.errorFor("deliveryMode");
  const needsShipping = isShippingMode(values.deliveryMode);

  // Le tarif dépend du mode : on l'affiche dans chaque option pour que le
  // client compare domicile / bureau sans changer de sélection.
  const wilayaOptions = useMemo(() => {
    if (!isShippingMode(values.deliveryMode)) return [];
    return WILAYAS.map((wilaya) => {
      const fee = wilaya.fees[values.deliveryMode as Exclude<DeliveryMode, "pickup">];
      return {
        code: wilaya.code,
        // Un tarif à 0 = wilaya non desservie pour ce mode : option désactivée.
        label: fee > 0 ? `${formatWilaya(wilaya)} — ${formatPrice(fee)}` : `${formatWilaya(wilaya)} — non desservie`,
        disabled: fee === 0,
      };
    });
  }, [values.deliveryMode]);

  return (
    <div className="flex flex-col gap-5">
      <FormField label="Nom et prénom" required {...form.ids("fullName")} error={form.errorFor("fullName")}>
        <input
          {...form.fieldProps("fullName")}
          type="text"
          required
          autoComplete="name"
          maxLength={60}
          placeholder="Ex. : Karim Benali"
          className={inputClassName(Boolean(form.errorFor("fullName")))}
        />
      </FormField>

      <FormField
        label="Téléphone"
        required
        {...form.ids("phone")}
        hint="Mobile à 10 chiffres (05, 06 ou 07). Le magasin vous appelle pour confirmer."
        error={form.errorFor("phone")}
      >
        <input
          {...form.fieldProps("phone")}
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          maxLength={17}
          placeholder="0555 12 34 56"
          className={inputClassName(Boolean(form.errorFor("phone")))}
        />
      </FormField>

      <fieldset aria-describedby={deliveryError ? deliveryIds.errorId : undefined}>
        <legend className="text-sm font-medium">
          Mode de réception
          <span aria-hidden="true" className="ml-0.5 text-orange-ink">
            *
          </span>
        </legend>
        <div className="mt-2 flex flex-col gap-2">
          {DELIVERY_MODES.map((mode) => {
            const checked = values.deliveryMode === mode;
            return (
              <label
                key={mode}
                className={`flex cursor-pointer gap-3 border p-3 text-sm transition-colors ${
                  checked ? "border-orange bg-orange/5" : "border-line hover:border-ink-soft"
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMode"
                  value={mode}
                  checked={checked}
                  onChange={() => form.setValue("deliveryMode", mode)}
                  className="mt-0.5 h-4 w-4 accent-orange"
                />
                <span>
                  <span className="block font-medium">{DELIVERY_MODE_LABELS[mode]}</span>
                  <span className="block text-xs text-ink-soft">{MODE_DESCRIPTIONS[mode]}</span>
                </span>
              </label>
            );
          })}
        </div>
        {deliveryError && <FieldError id={deliveryIds.errorId} message={deliveryError} />}
      </fieldset>

      {needsShipping && (
        <FormField
          label="Wilaya"
          required
          {...form.ids("wilaya")}
          hint={
            deliveryFee !== null
              ? `Frais de livraison : ${formatPrice(deliveryFee)}`
              : "Le tarif s'affiche dès que vous choisissez votre wilaya."
          }
          error={form.errorFor("wilaya")}
        >
          <select
            {...form.fieldProps("wilaya")}
            required
            className={inputClassName(Boolean(form.errorFor("wilaya")))}
          >
            <option value="">Choisir une wilaya</option>
            {wilayaOptions.map((option) => (
              <option key={option.code} value={option.code} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
      )}

      {values.deliveryMode === "domicile" && (
        <FormField
          label="Adresse de livraison"
          required
          {...form.ids("address")}
          hint="Commune, quartier, rue et un point de repère."
          error={form.errorFor("address")}
        >
          <textarea
            {...form.fieldProps("address")}
            required
            rows={3}
            maxLength={200}
            autoComplete="street-address"
            placeholder="Ex. : Birkhadem, cité 200 logements, bât. B, en face de la pharmacie"
            className={`${inputClassName(Boolean(form.errorFor("address")))} resize-none`}
          />
        </FormField>
      )}

      <FormField
        label="Remarque"
        optional
        {...form.ids("note")}
        hint={`${values.note.length}/${NOTE_MAX_LENGTH} caractères`}
        error={form.errorFor("note")}
      >
        <textarea
          {...form.fieldProps("note")}
          rows={2}
          maxLength={NOTE_MAX_LENGTH}
          placeholder="Horaire de passage, question sur un produit…"
          className={`${inputClassName(Boolean(form.errorFor("note")))} resize-none`}
        />
      </FormField>
    </div>
  );
}
