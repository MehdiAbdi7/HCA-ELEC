// Largeurs (px) des variantes d'images, partagées par deux fichiers :
//  - next.config.ts : next/image ne propose au navigateur que ces largeurs (srcset) ;
//  - scripts/optimize-images.mjs : génère un fichier WebP pour chacune.
// Si on ajoute une largeur ici, elle est générée au prochain build.

// Petites largeurs : logos et miniatures du panier (largeur fixe en px).
export const imageSizes = [96, 192];

// Grandes largeurs : photos qui suivent la largeur de l'écran (sizes en vw).
export const deviceSizes = [384, 640, 750, 960, 1280];

// Dossier des sources (public/images) et des variantes générées (non commitées).
export const SOURCE_DIR = "images";
export const OPTIMIZED_DIR = "images-opt";
