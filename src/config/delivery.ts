/**
 * Grille tarifaire du transporteur (Ecom Delivery — compte HOME CONNECT 16).
 *
 * Un tarif à 0 signifie "wilaya non desservie pour ce mode" : l'option est
 * alors désactivée dans le formulaire au lieu d'afficher une livraison gratuite.
 *
 * Pour mettre à jour les prix : modifier uniquement le tableau TARIFFS ci-dessous.
 */

export const DELIVERY_MODES = ["pickup", "domicile", "stopdesk"] as const;
export type DeliveryMode = (typeof DELIVERY_MODES)[number];

/** Modes qui impliquent un transporteur (donc une wilaya et des frais). */
export type ShippingMode = Exclude<DeliveryMode, "pickup">;

export const DELIVERY_MODE_LABELS: Record<DeliveryMode, string> = {
  pickup: "Retrait en magasin",
  domicile: "Livraison à domicile",
  stopdesk: "Bureau de livraison",
};

export type Wilaya = {
  /** Code officiel sur 2 chiffres ("01" à "58"), utilisé comme valeur du <select>. */
  code: string;
  name: string;
  fees: Record<ShippingMode, number>;
};

// [code, nom, domicile, stopdesk]
const TARIFFS: [string, string, number, number][] = [
  ["01", "Adrar", 1100, 750],
  ["02", "Chlef", 680, 400],
  ["03", "Laghouat", 880, 550],
  ["04", "Oum El Bouaghi", 700, 350],
  ["05", "Batna", 700, 400],
  ["06", "Bejaia", 700, 400],
  ["07", "Biskra", 950, 620],
  ["08", "Bechar", 1100, 720],
  ["09", "Blida", 500, 350],
  ["10", "Bouira", 700, 520],
  ["11", "Tamanrasset", 1600, 1120],
  ["12", "Tebessa", 900, 570],
  ["13", "Tlemcen", 900, 570],
  ["14", "Tiaret", 850, 520],
  ["15", "Tizi Ouzou", 630, 400],
  ["16", "Alger", 450, 200],
  ["17", "Djelfa", 950, 570],
  ["18", "Jijel", 900, 520],
  ["19", "Sétif", 690, 400],
  ["20", "Saida", 900, 570],
  ["21", "Skikda", 900, 520],
  ["22", "Sidi Bel Abbès", 900, 520],
  ["23", "Annaba", 700, 400],
  ["24", "Guelma", 900, 520],
  ["25", "Constantine", 680, 400],
  ["26", "Medea", 800, 520],
  ["27", "Mostaganem", 900, 520],
  ["28", "M'Sila", 850, 570],
  ["29", "Mascara", 900, 520],
  ["30", "Ouargla", 950, 670],
  ["31", "Oran", 580, 380],
  ["32", "El Bayadh", 1100, 670],
  ["33", "Illizi", 1700, 1200],
  ["34", "Bordj Bou Arreridj", 800, 520],
  ["35", "Boumerdes", 550, 350],
  ["36", "El Tarf", 850, 520],
  ["37", "Tindouf", 1350, 900],
  ["38", "Tissemsilt", 900, 520],
  ["39", "El Oued", 950, 670],
  ["40", "Khenchela", 900, 520],
  ["41", "Souk Ahras", 900, 520],
  ["42", "Tipaza", 550, 350],
  ["43", "Mila", 900, 520],
  ["44", "Ain Defla", 900, 520],
  ["45", "Naama", 1100, 670],
  ["46", "Ain Temouchent", 900, 520],
  ["47", "Ghardaia", 950, 620],
  ["48", "Relizane", 900, 520],
  ["49", "Timimoun", 1400, 1000],
  ["50", "Bordj Badji Mokhtar", 0, 0],
  ["51", "Ouled Djellal", 950, 620],
  ["52", "Béni Abbès", 1100, 970],
  ["53", "In Salah", 1600, 1100],
  ["54", "In Guezzam", 0, 0],
  ["55", "Touggourt", 950, 670],
  ["56", "Djanet", 2400, 1750],
  ["57", "M'Ghair", 950, 0],
  ["58", "Meniaa", 1000, 550],
];

export const WILAYAS: Wilaya[] = TARIFFS.map(([code, name, domicile, stopdesk]) => ({
  code,
  name,
  fees: { domicile, stopdesk },
}));

const wilayasByCode = new Map(WILAYAS.map((wilaya) => [wilaya.code, wilaya]));

export const getWilaya = (code: string): Wilaya | undefined => wilayasByCode.get(code);

export const isShippingMode = (mode: DeliveryMode): mode is ShippingMode => mode !== "pickup";

/** Wilaya desservie pour ce mode ? (tarif 0 dans la grille = non desservie) */
export function isWilayaServed(code: string, mode: ShippingMode): boolean {
  const fees = getWilaya(code)?.fees[mode];
  return fees !== undefined && fees > 0;
}

/**
 * Frais de livraison pour un mode et une wilaya.
 *  - retrait en magasin → 0 ;
 *  - wilaya non choisie ou non desservie → null (montant inconnu, pas gratuit).
 * Source unique du calcul : formulaire, récapitulatif et message WhatsApp
 * passent tous par ici.
 */
export function resolveDeliveryFee(mode: DeliveryMode, wilayaCode: string): number | null {
  if (!isShippingMode(mode)) return 0;
  const fee = getWilaya(wilayaCode)?.fees[mode];
  return fee !== undefined && fee > 0 ? fee : null;
}

/** "16 - Alger" */
export const formatWilaya = (wilaya: Wilaya): string => `${wilaya.code} - ${wilaya.name}`;
