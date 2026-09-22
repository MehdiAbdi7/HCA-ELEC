/**
 * Identité et coordonnées du magasin.
 * Source unique : tout composant qui affiche un nom, un téléphone ou une
 * adresse importe depuis ici (jamais de numéro en dur dans un composant).
 */
export const SITE = {
  name: "Home Connect Algérie",
  fullName: "Home Connect Algérie",
  tagline: "Électricité générale",
  city: "Alger",
  phoneDisplay: "0555 03 22 16",
  phoneHref: "tel:+213555032216",
  whatsappHref: "https://wa.me/213555032216",
  address: "Tixeraine, birkhadem, Alger",
  // URL publique du site (aperçus de liens WhatsApp/Facebook, SEO). À vérifier avant la mise en ligne.
  url: "https://hca-elec.com",
} as const;
