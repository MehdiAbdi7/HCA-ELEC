import type {
  Category,
  CategoryId,
  Collection,
  Product,
} from "./catalog.types";

/**
 * Catalogue statique du magasin.
 * Pour ajouter un produit : ajouter une entrée ci-dessous + son image dans
 * /public/images. Tout le reste du site (accueil, catalogue, fiches, panier)
 * se met à jour automatiquement.
 */

export const categories: Record<CategoryId, Category> = {
  plafonniers: {
    id: "plafonniers",
    label: "Plafonniers LED",
    shortLabel: "Plafonniers",
    intro:
      "56W, Ø40cm, réglables sur 3 positions de couleur (chaud, neutre, froid). Neuf finitions disponibles en magasin.",
  },
  appliques: {
    id: "appliques",
    label: "Appliques murales",
    shortLabel: "Appliques",
    intro:
      "Pour l'intérieur ou l'extérieur, du modèle discret au plus décoratif.",
  },
};

export const collections: Collection[] = [
  {
    id: "crystal-double",
    category: "appliques",
    title: "Applique Crystal — modèle double",
    intro:
      "Diffusion haut/bas, éclats dorés pris dans l'acrylique, 3 positions de couleur.",
  },
  {
    id: "crystal-triple",
    category: "appliques",
    title: "Applique Crystal — modèle triple",
    intro: "Même finition, format plus large, 3 positions de couleur.",
  },
  {
    id: "incurvee",
    category: "appliques",
    title: "Design incurvé doré",
    intro:
      "Courbe métallique ouverte, intérieur doré, diffusion haut/bas enveloppante.",
  },
  {
    id: "projecteurs",
    category: "appliques",
    title: "Projecteurs orientables",
    intro: "Tête orientable 3 positions, finition dorée, 12W.",
  },
  {
    id: "simples",
    category: "appliques",
    title: "Simples & polyvalentes",
    intro:
      "Pour l'intérieur comme l'extérieur, du modèle compact au plus large.",
  },
];

/* ------------------------------------------------------------------ */
/* Plafonniers : même fiche technique, seule la finition change.       */
/* ------------------------------------------------------------------ */

const PLAFONNIER_CODES = ["01", "03", "06", "07", "09", "10", "11", "12", "13"];

const plafonniers: Product[] = PLAFONNIER_CODES.map((code) => ({
  id: `br${code}`,
  slug: `plafonnier-led-br${code}`,
  name: `Plafonnier LED BR${code}`,
  category: "plafonniers",
  spec: "56W • Ø40cm • 3 positions de lumière",
  description:
    "Plafonnier LED de 40 cm de diamètre et 56W, réglable sur trois positions de couleur : blanc chaud, neutre ou froid. Même fiche technique sur toute la gamme, seule la finition change.",
  features: [
    "Puissance : 56W",
    "Diamètre : 40 cm",
    "3 positions de couleur : chaud, neutre, froid",
  ],
  image: `/images/plafonniers/br-${code}.jpg`,
  price: 4000,
  oldPrice: 4500,
  outdoor: false,
}));

/* ------------------------------------------------------------------ */
/* Appliques                                                          */
/* ------------------------------------------------------------------ */

type AppliqueInput = Pick<
  Product,
  "id" | "name" | "spec" | "image" | "price" | "oldPrice"
> &
  Partial<Pick<Product, "description" | "features" | "outdoor">>;

/** Complète les champs communs d'une applique (catégorie, slug, description par défaut…). */
function applique(collectionId: string, input: AppliqueInput): Product {
  const { description, features, outdoor = false, ...rest } = input;
  const collection = collections.find((c) => c.id === collectionId);
  return {
    ...rest,
    slug: `applique-${rest.id}`,
    category: "appliques",
    collectionId,
    description: description ?? collection?.intro ?? "",
    features: features ?? rest.spec.split(" • "),
    outdoor,
  };
}

const appliques: Product[] = [
  // Crystal double
  applique("crystal-double", {
    id: "crystale-2-3000",
    name: "Crystal double — 3000K",
    spec: "Blanc chaud",
    image: "/images/appliques/crystale-2-3000.jpg",
    oldPrice: 2800,
    price: 2400,
  }),

  // Crystal triple
  applique("crystal-triple", {
    id: "crystale-3-3000",
    name: "Crystal triple — 3000K",
    spec: "Blanc chaud",
    image: "/images/appliques/crystale-3-3000.jpg",
    oldPrice: 3200,
    price: 2800,
  }),

  // Incurvée
  applique("incurvee", {
    id: "white-g",
    name: "Incurvée blanche / dorée",
    spec: "Métallique",
    image: "/images/appliques/white-g.jpg",
    oldPrice: 4000,
    price: 3600,
  }),
  applique("incurvee", {
    id: "black-g",
    name: "Incurvée noire / dorée",
    spec: "Métallique",
    image: "/images/appliques/black-g.jpg",
    oldPrice: 4000,
    price: 3600,
  }),

  // Projecteurs
  applique("projecteurs", {
    id: "proj-bk-g",
    name: "Projecteur noir / doré",
    spec: "12W • 3 positions",
    image: "/images/appliques/proj-bk-g.jpg",
    oldPrice: 2000,
    price: 1600,
  }),
  applique("projecteurs", {
    id: "proj-wh-g",
    name: "Projecteur blanc / doré",
    spec: "12W • 3 positions",
    image: "/images/appliques/proj-wh-g.jpg",
    oldPrice: 2000,
    price: 1600,
  }),

  // Simples & polyvalentes
  applique("simples", {
    id: "cube-bk",
    name: "Cube noir",
    spec: "Intérieur • 5W",
    image: "/images/appliques/cube-bk.jpg",
    oldPrice: 2300,
    price: 2000,
  }),
  applique("simples", {
    id: "cylindrique-bk",
    name: "Cylindrique noire",
    spec: "Intérieur / extérieur • 6W",
    image: "/images/appliques/cylindrique-bk.jpg",
    oldPrice: 2800,
    price: 2500,
    outdoor: true,
  }),
  applique("simples", {
    id: "rond-bk",
    name: "Ronde métallique",
    spec: "Intérieur / extérieur • 12W",
    image: "/images/appliques/rond-bk.jpg",
    oldPrice: 2500,
    price: 2200,
    outdoor: true,
  }),
  applique("simples", {
    id: "carre-bk",
    name: "Bloc verre noir",
    spec: "Intérieur / extérieur • 12W",
    image: "/images/appliques/carre-bk.jpg",
    oldPrice: 2500,
    price: 2200,
    outdoor: true,
  }),
  applique("simples", {
    id: "double-bk",
    name: "Courbe plastique noire",
    spec: "Intérieur / extérieur",
    image: "/images/appliques/double-bk.jpg",
    oldPrice: 1500,
    price: 1200,
    outdoor: true,
  }),
  applique("simples", {
    id: "double-wh",
    name: "Courbe métallique blanche",
    spec: "Intérieur / extérieur",
    image: "/images/appliques/double-wh.jpg",
    oldPrice: 2300,
    price: 2000,
    outdoor: true,
  }),
  applique("simples", {
    id: "triple-bk",
    name: "Courbe large plastique noire",
    spec: "Intérieur / extérieur",
    image: "/images/appliques/triple-bk.jpg",
    oldPrice: 1800,
    price: 1500,
    outdoor: true,
  }),
  applique("simples", {
    id: "triple-wh",
    name: "Courbe large métallique blanche",
    spec: "Intérieur / extérieur",
    image: "/images/appliques/triple-wh.jpg",
    oldPrice: 2800,
    price: 2500,
    outdoor: true,
  }),
];

export const products: Product[] = [...plafonniers, ...appliques];
