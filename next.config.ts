import type { NextConfig } from "next";
import { deviceSizes, imageSizes } from "./images.config.mjs";

const nextConfig: NextConfig = {
  // Export statique : génère un dossier out/ de fichiers HTML/CSS/JS purs,
  // hébergeable sur un mutualisé classique (Octenium, etc.) sans serveur Node.
  output: "export",

  // Génère /produits/index.html au lieu de /produits.html : un Apache
  // mutualisé sert alors /produits/ (et /produits/plafonnier-led-br01/)
  // sans règle de réécriture .htaccess.
  trailingSlash: true,

  // Pas de serveur en export statique → pas d'optimisation d'image à la volée.
  // Les variantes sont générées au build (scripts/optimize-images.mjs) et le
  // loader personnalisé indique à next/image où les trouver.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes,
    imageSizes,
  },
};

export default nextConfig;
