"use client";

import { MAX_QUANTITY_PER_PRODUCT } from "@/config/shop";
import { MinusIcon, PlusIcon } from "@/components/site/icons";

type QuantityStepperProps = {
  /** Valeur en string : le champ doit pouvoir être vide pendant la saisie. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** false = boutons +/- uniquement (panier). true = saisie clavier autorisée (fiche produit). */
  editable?: boolean;
  productName?: string;
  min?: number;
  max?: number;
  id?: string;
  describedBy?: string;
  invalid?: boolean;
};

export function QuantityStepper({
  value,
  onChange,
  onBlur,
  editable = true,
  productName,
  min = 1,
  max = MAX_QUANTITY_PER_PRODUCT,
  id,
  describedBy,
  invalid = false,
}: QuantityStepperProps) {
  const numeric = Number(value) || 0;
  // Les boutons ramènent toujours dans les bornes (ex. 50 puis "−" → 20).
  const step = (delta: 1 | -1) =>
    onChange(String(Math.min(max, Math.max(min, Math.floor(numeric) + delta))));
  const suffix = productName ? ` de ${productName}` : "";
  const buttonClass =
    "flex w-11 shrink-0 items-center justify-center text-ink-soft transition-colors hover:text-orange hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-35";

  return (
    // Enveloppe en flex "row" : peu importe le conteneur parent (flex-col,
    // grid, block), le stepper garde la largeur de son contenu au lieu
    // d'être étiré sur toute la ligne.
    <div className="flex">
      <div
        className={`flex h-11 shrink-0 items-stretch border bg-bg ${invalid ? "border-red-500" : "border-line"}`}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={numeric <= min}
          aria-label={`Diminuer la quantité${suffix}`}
          className={buttonClass}
        >
          <MinusIcon className="h-4 w-4" />
        </button>

        {editable ? (
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={3}
            value={value}
            // Seuls les chiffres passent ; les bornes sont vérifiées par Zod
            // pour que le client VOIE pourquoi 50 est refusé.
            onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
            onBlur={onBlur}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className="w-12 shrink-0 border-x border-line bg-transparent text-center text-sm font-medium outline-none focus:bg-surface-2"
          />
        ) : (
          <span
            aria-live="polite"
            className="flex w-12 shrink-0 items-center justify-center border-x border-line text-sm font-medium"
          >
            <span className="sr-only">Quantité{suffix} : </span>
            {value}
          </span>
        )}

        <button
          type="button"
          onClick={() => step(1)}
          disabled={numeric >= max}
          aria-label={`Augmenter la quantité${suffix}`}
          className={buttonClass}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
