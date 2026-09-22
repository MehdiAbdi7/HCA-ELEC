import { z } from "zod";
import { getDiscountPercent, normalizeText } from "@/lib/format";
import { CATEGORY_IDS, type Product } from "./catalog.types";

/**
 * Filtres et tri du catalogue — fonctions PURES (aucun React), donc
 * testables unitairement et réutilisables.
 *
 * Les filtres vivent dans l'URL (?categorie=appliques&tri=prix-asc) :
 * un lien est partageable, et le bouton "retour" du navigateur fonctionne.
 */

/* ----------------------------- Tri ----------------------------- */

export const SORT_VALUES = ["pertinence", "prix-asc", "prix-desc", "remise", "nom"] as const;
export type SortValue = (typeof SORT_VALUES)[number];

export const SORT_LABELS: Record<SortValue, string> = {
  pertinence: "Pertinence",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  remise: "Meilleure remise",
  nom: "Nom (A → Z)",
};

/* --------------------------- Prix ------------------------------ */

export const PRICE_RANGE_IDS = ["moins-2000", "2000-3000", "plus-3000"] as const;
export type PriceRangeId = (typeof PRICE_RANGE_IDS)[number];

export const PRICE_RANGES: Record<PriceRangeId, { label: string; min: number; max: number }> = {
  "moins-2000": { label: "Moins de 2 000 DA", min: 0, max: 1999 },
  "2000-3000": { label: "De 2 000 à 3 000 DA", min: 2000, max: 3000 },
  "plus-3000": { label: "Plus de 3 000 DA", min: 3001, max: Number.POSITIVE_INFINITY },
};

/* ------------------ Lecture sécurisée de l'URL ------------------ */

/**
 * L'URL est une entrée utilisateur : n'importe qui peut taper ?tri=n'importe-quoi.
 * `.catch()` remplace toute valeur invalide par la valeur par défaut au lieu de
 * planter la page.
 */
const catalogFiltersSchema = z.object({
  q: z.string().trim().max(60).catch(""),
  categorie: z.enum(CATEGORY_IDS).optional().catch(undefined),
  collection: z.string().max(40).optional().catch(undefined),
  prix: z.enum(PRICE_RANGE_IDS).optional().catch(undefined),
  exterieur: z
    .literal("1")
    .optional()
    .catch(undefined)
    .transform((value) => value === "1"),
  tri: z.enum(SORT_VALUES).catch("pertinence"),
});

export type CatalogFilters = z.output<typeof catalogFiltersSchema>;

export const DEFAULT_FILTERS: CatalogFilters = {
  q: "",
  categorie: undefined,
  collection: undefined,
  prix: undefined,
  exterieur: false,
  tri: "pertinence",
};

export function parseCatalogFilters(params: Iterable<[string, string]>): CatalogFilters {
  return catalogFiltersSchema.parse(Object.fromEntries(params));
}

/** Inverse de parseCatalogFilters : n'écrit dans l'URL que ce qui diffère du défaut. */
export function toSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.categorie) params.set("categorie", filters.categorie);
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.prix) params.set("prix", filters.prix);
  if (filters.exterieur) params.set("exterieur", "1");
  if (filters.tri !== DEFAULT_FILTERS.tri) params.set("tri", filters.tri);
  return params;
}

/** Nombre de filtres actifs (le tri n'est pas un filtre). */
export function countActiveFilters(filters: CatalogFilters): number {
  return [filters.q, filters.categorie, filters.collection, filters.prix, filters.exterieur].filter(Boolean).length;
}

/* ------------------------- Application ------------------------- */

export function applyCatalogFilters(products: Product[], filters: CatalogFilters): Product[] {
  const query = normalizeText(filters.q);
  const range = filters.prix ? PRICE_RANGES[filters.prix] : undefined;

  const filtered = products.filter((product) => {
    if (filters.categorie && product.category !== filters.categorie) return false;
    if (filters.collection && product.collectionId !== filters.collection) return false;
    if (range && (product.price < range.min || product.price > range.max)) return false;
    if (filters.exterieur && !product.outdoor) return false;
    if (query && !normalizeText(`${product.name} ${product.spec}`).includes(query)) return false;
    return true;
  });

  return sortProducts(filtered, filters.tri);
}

function sortProducts(products: Product[], sort: SortValue): Product[] {
  const sorted = [...products]; // on ne mute jamais le tableau reçu
  switch (sort) {
    case "prix-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "prix-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "remise":
      return sorted.sort(
        (a, b) => (getDiscountPercent(b.price, b.oldPrice) ?? 0) - (getDiscountPercent(a.price, a.oldPrice) ?? 0),
      );
    case "nom":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "fr"));
    case "pertinence":
    default:
      return sorted; // ordre éditorial du catalogue
  }
}
