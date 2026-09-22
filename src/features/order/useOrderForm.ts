"use client";

import { useId, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { resolveDeliveryFee, type DeliveryMode } from "@/config/delivery";
import { orderSchema, type OrderItemInput } from "./order.schema";
import { buildWhatsappOrderUrl } from "./order.whatsapp";

export type CustomerValues = {
  fullName: string;
  phone: string;
  deliveryMode: DeliveryMode;
  /** Code wilaya ("16"), vide tant que le client n'a pas choisi. */
  wilaya: string;
  address: string;
  note: string;
};

type TextField = Exclude<keyof CustomerValues, "deliveryMode">;

const INITIAL_VALUES: CustomerValues = {
  fullName: "",
  phone: "",
  deliveryMode: "pickup",
  wilaya: "",
  address: "",
  note: "",
};

/** issues Zod → { "phone": "message", "items.0.quantity": "message" } (1er message par champ). */
function toErrorMap(issues: readonly { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".");
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

/**
 * Logique du formulaire de commande, séparée de l'affichage.
 * Utilisée par la fiche produit (1 article) ET par le panier (n articles).
 *
 * Quand afficher une erreur ?
 *  - pas pendant que le client tape son premier caractère (agressif) ;
 *  - dès qu'il quitte le champ (blur), puis en direct pendant qu'il corrige ;
 *  - sur tous les champs après un clic sur "Envoyer".
 */
export function useOrderForm({ items }: { items: readonly OrderItemInput[] }) {
  const idPrefix = useId();

  const [values, setValues] = useState<CustomerValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  // Validation recalculée à chaque changement : le schéma est la seule source de vérité.
  const result = useMemo(() => orderSchema.safeParse({ ...values, items }), [values, items]);
  const errors = useMemo(() => (result.success ? {} : toErrorMap(result.error.issues)), [result]);

  /**
   * Frais de livraison en direct, calculés sur la saisie en cours (même si
   * le formulaire n'est pas encore valide) : le récapitulatif et le total
   * suivent le mode et la wilaya choisis. null = montant pas encore connu.
   */
  const deliveryFee = resolveDeliveryFee(values.deliveryMode, values.wilaya);

  const errorFor = (path: string): string | undefined =>
    submitAttempted || touched[path] ? errors[path] : undefined;

  const markTouched = (path: string) =>
    setTouched((prev) => (prev[path] ? prev : { ...prev, [path]: true }));

  const setValue = <K extends keyof CustomerValues>(field: K, value: CustomerValues[K]) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  /** Ids accessibles (label ↔ input ↔ message d'aide / d'erreur). */
  const ids = (path: string) => {
    const base = `${idPrefix}-${path.replaceAll(".", "-")}`;
    return { inputId: base, hintId: `${base}-hint`, errorId: `${base}-error` };
  };

  /** Props prêtes à étaler sur un <input> ou <textarea> texte. */
  const fieldProps = (field: TextField) => {
    const { inputId, hintId, errorId } = ids(field);
    const error = errorFor(field);
    return {
      id: inputId,
      name: field,
      value: values[field],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setValue(field, e.target.value),
      onBlur: () => markTouched(field),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${hintId} ${errorId}` : hintId,
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!result.success) {
      // Le <form> est pris sur l'événement (pas de ref à faire circuler).
      // Après le rendu des erreurs, on place le focus sur le premier champ fautif.
      const formElement = event.currentTarget;
      requestAnimationFrame(() => {
        formElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    const url = buildWhatsappOrderUrl(result.data);
    const whatsappWindow = window.open(url, "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;
    else window.location.assign(url); // popup bloquée → même onglet
    setWhatsappUrl(url);
  };

  /** Retour au formulaire en gardant la saisie (le client veut corriger). */
  const backToForm = () => setWhatsappUrl(null);

  /** Remise à zéro complète (après une commande envoyée). */
  const reset = () => {
    setValues(INITIAL_VALUES);
    setTouched({});
    setSubmitAttempted(false);
    setWhatsappUrl(null);
  };

  return {
    values,
    deliveryFee,
    setValue,
    fieldProps,
    ids,
    errorFor,
    markTouched,
    handleSubmit,
    backToForm,
    reset,
    status: whatsappUrl ? ("sent" as const) : ("editing" as const),
    whatsappUrl,
  };
}

export type OrderFormController = ReturnType<typeof useOrderForm>;
