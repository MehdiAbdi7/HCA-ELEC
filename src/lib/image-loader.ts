import type { ImageLoaderProps } from "next/image";
import { OPTIMIZED_DIR, SOURCE_DIR } from "../../images.config.mjs";

/**
 * Loader next/image pour l'export statique : au lieu d'appeler un serveur
 * d'optimisation (absent sur un hébergement mutualisé), il pointe vers les
 * variantes WebP générées au build par scripts/optimize-images.mjs.
 *
 * "/images/plafonniers/br-01.jpg" + 384 → "/images-opt/plafonniers/br-01-384.webp"
 *
 * next/image appelle cette fonction une fois par largeur de images.config.mjs
 * pour construire le srcset, et le navigateur télécharge la plus adaptée.
 */
export default function imageLoader({ src, width }: ImageLoaderProps) {
  const withoutExtension = src.replace(/\.[a-z]+$/i, "");
  const optimized = withoutExtension.replace(
    `/${SOURCE_DIR}/`,
    `/${OPTIMIZED_DIR}/`,
  );
  return `${optimized}-${width}.webp`;
}
