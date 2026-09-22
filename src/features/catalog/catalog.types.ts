export const CATEGORY_IDS = ["plafonniers", "appliques"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Category = {
  id: CategoryId;
  /** Titre de section : "Plafonniers LED" */
  label: string;
  /** Libellé court pour fil d'Ariane / filtres : "Plafonniers" */
  shortLabel: string;
  intro: string;
};

/** Gamme de produits à l'intérieur d'une catégorie (ex. "Applique Crystal — modèle double"). */
export type Collection = {
  id: string;
  category: CategoryId;
  title: string;
  intro: string;
};

export type Product = {
  /** Identifiant technique stable (stocké dans le panier). Ne jamais le renommer. */
  id: string;
  /** Segment d'URL : /produits/<slug> */
  slug: string;
  name: string;
  category: CategoryId;
  collectionId?: string;
  /** Résumé technique court affiché sur les cartes. */
  spec: string;
  description: string;
  features: string[];
  image: string;
  price: number;
  /** Prix barré. Absent = pas de promotion. */
  oldPrice?: number;
  /** true uniquement si le produit est explicitement indiqué utilisable en extérieur. */
  outdoor: boolean;
};
