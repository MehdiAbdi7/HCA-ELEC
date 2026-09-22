import { categories, collections, products } from "./catalog.data";
import { CATEGORY_IDS, type Category, type CategoryId, type Collection, type Product } from "./catalog.types";

/**
 * Point d'accès UNIQUE au catalogue. Les composants n'importent jamais
 * catalog.data directement : le jour où les produits viendront d'une API,
 * seul ce fichier change.
 */

const productsById = new Map(products.map((p) => [p.id, p]));
const productsBySlug = new Map(products.map((p) => [p.slug, p]));

export const getAllProducts = (): Product[] => products;
export const getProductById = (id: string): Product | undefined => productsById.get(id);
export const getProductBySlug = (slug: string): Product | undefined => productsBySlug.get(slug);

export const getProductsByCategory = (categoryId: CategoryId): Product[] =>
  products.filter((p) => p.category === categoryId);

export const getCategory = (id: CategoryId): Category => categories[id];
export const getCategoryList = (): Category[] => CATEGORY_IDS.map((id) => categories[id]);

export const getCollection = (id?: string): Collection | undefined =>
  id ? collections.find((c) => c.id === id) : undefined;

export const getCollectionsByCategory = (categoryId: CategoryId): Collection[] =>
  collections.filter((c) => c.category === categoryId);

/** Produits de la même gamme d'abord, puis de la même catégorie. */
export function getRelatedProducts(product: Product, limit = 8): Product[] {
  const others = products.filter((p) => p.id !== product.id && p.category === product.category);
  const sameCollection = others.filter((p) => product.collectionId && p.collectionId === product.collectionId);
  const rest = others.filter((p) => !sameCollection.includes(p));
  return [...sameCollection, ...rest].slice(0, limit);
}

/* Construction des URL : centralisée pour ne jamais écrire "/produits/..." à la main. */
export const productHref = (product: Product): string => `/produits/${product.slug}`;
export const productOrderHref = (product: Product): string => `${productHref(product)}#commander`;
export const categoryHref = (categoryId: CategoryId): string => `/produits?categorie=${categoryId}`;
