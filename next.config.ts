import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statique : génère un dossier out/ de fichiers HTML/CSS/JS purs,
  // hébergeable sur un mutualisé classique (Octenium, etc.) sans serveur
  // Node.js qui tourne en permanence.
  output: "export",

  // Pas de serveur en export statique, donc pas d'optimisation d'image à la
  // volée possible : on sert les images telles quelles depuis /public.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
