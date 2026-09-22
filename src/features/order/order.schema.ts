import { z } from "zod";
import { MAX_QUANTITY_PER_PRODUCT } from "@/config/shop";
import { DELIVERY_MODE_LABELS, getWilaya, isWilayaServed, type ShippingMode } from "@/config/delivery";
import { getProductById } from "@/features/catalog/catalog.queries";

/**
 * Validation du formulaire de commande.
 *
 * Règle d'écriture des messages : chaque message dit au client QUOI corriger,
 * jamais juste "invalide". Les règles sont ordonnées du plus simple au plus
 * précis : le formulaire n'affiche que la première erreur d'un champ.
 */

export { DELIVERY_MODE_LABELS };

/** Lettres latines (accents inclus) et arabes, espaces, apostrophes, tirets, points. */
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ\u0600-\u06FF\s'’.-]+$/;

/** "+213 555 03 22 16" ou "0555.03.22.16" → "0555032216" */
export function normalizePhone(raw: string): string {
  return raw.replace(/[\s.-]/g, "").replace(/^(\+|00)213/, "0");
}

export const orderItemSchema = z.object({
  productId: z
    .string()
    .refine((id) => getProductById(id) !== undefined, "Ce produit n'est plus disponible."),
  quantity: z
    .number({ error: `Indiquez une quantité entre 1 et ${MAX_QUANTITY_PER_PRODUCT}.` })
    .int("La quantité doit être un nombre entier.")
    .min(1, "Il faut au moins 1 article.")
    .max(
      MAX_QUANTITY_PER_PRODUCT,
      `${MAX_QUANTITY_PER_PRODUCT} articles maximum par produit. Pour une plus grande quantité, appelez le magasin.`,
    ),
});
export type OrderItemInput = z.input<typeof orderItemSchema>;

/** Champs communs aux trois modes de réception. */
const commonFields = {
  fullName: z
    .string()
    .trim()
    .min(1, "Indiquez votre nom et prénom.")
    .min(3, "Votre nom doit contenir au moins 3 lettres.")
    .max(60, "Votre nom ne doit pas dépasser 60 caractères.")
    .regex(NAME_PATTERN, "Votre nom ne doit contenir que des lettres (pas de chiffres ni de symboles)."),

  phone: z
    .string()
    .transform(normalizePhone)
    .pipe(
      z
        .string()
        .min(1, "Indiquez votre numéro de téléphone.")
        .regex(/^\d+$/, "Le numéro ne doit contenir que des chiffres.")
        .length(10, "Le numéro doit contenir exactement 10 chiffres (ex. 0555 12 34 56).")
        .regex(/^0[567]/, "Le numéro doit commencer par 05, 06 ou 07."),
    ),

  note: z.string().trim().max(300, "La remarque ne doit pas dépasser 300 caractères."),

  items: z.array(orderItemSchema).min(1, "Votre commande ne contient aucun produit."),
};

/** Wilaya obligatoire ET desservie par le transporteur pour le mode choisi. */
const wilayaSchema = (mode: ShippingMode) =>
  z
    .string()
    .min(1, "Choisissez votre wilaya.")
    .refine((code) => getWilaya(code) !== undefined, "Cette wilaya n'existe pas.")
    .refine(
      (code) => isWilayaServed(code, mode),
      `${DELIVERY_MODE_LABELS[mode]} non disponible dans cette wilaya. Choisissez un autre mode de réception.`,
    );

/**
 * Union discriminée sur le mode de réception : chaque mode a EXACTEMENT les
 * champs dont il a besoin, et TypeScript le sait aussi. Dans
 * `if (order.deliveryMode === "domicile")`, `order.wilaya` et `order.address`
 * existent et sont typés string ; en retrait magasin, ils n'existent pas.
 */
export const orderSchema = z.discriminatedUnion(
  "deliveryMode",
  [
    z.object({ ...commonFields, deliveryMode: z.literal("pickup") }),
    z.object({
      ...commonFields,
      deliveryMode: z.literal("domicile"),
      wilaya: wilayaSchema("domicile"),
      address: z
        .string()
        .trim()
        .min(1, "Indiquez votre adresse de livraison.")
        .min(10, "Précisez l'adresse : commune, rue, un point de repère (10 caractères minimum).")
        .max(200, "L'adresse ne doit pas dépasser 200 caractères."),
    }),
    z.object({
      ...commonFields,
      deliveryMode: z.literal("stopdesk"),
      wilaya: wilayaSchema("stopdesk"),
    }),
  ],
  { error: "Choisissez un mode de réception." },
);

export type Order = z.output<typeof orderSchema>;
