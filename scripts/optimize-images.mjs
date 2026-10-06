// Génère les variantes WebP des images de public/images avant chaque build.
//
// Pourquoi : en export statique, il n'y a pas de serveur Next pour
// redimensionner les images à la demande. Sans ce script, chaque carte
// produit téléchargeait la photo d'origine (2160 px, ~400 Ko) pour
// l'afficher en 180 px sur mobile.
//
// Exemple : public/images/plafonniers/br-01.jpg devient
//   public/images-opt/plafonniers/br-01-96.webp, br-01-192.webp, ... br-01-1280.webp
// et src/lib/image-loader.ts choisit le bon fichier pour chaque écran.

import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  deviceSizes,
  imageSizes,
  OPTIMIZED_DIR,
  SOURCE_DIR,
} from "../images.config.mjs";

const SOURCE_ROOT = path.join("public", SOURCE_DIR);
const OUTPUT_ROOT = path.join("public", OPTIMIZED_DIR);
const WIDTHS = [...imageSizes, ...deviceSizes];
const QUALITY = 75;
const SOURCE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

/** Liste récursive des fichiers d'un dossier. */
async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    }),
  );
  return nested.flat();
}

/** Vrai si la variante existe déjà et est plus récente que sa source. */
async function isUpToDate(sourcePath, outputPath) {
  try {
    const [source, output] = await Promise.all([
      stat(sourcePath),
      stat(outputPath),
    ]);
    return output.mtimeMs >= source.mtimeMs;
  } catch {
    return false; // variante absente : à générer
  }
}

const sources = (await listFiles(SOURCE_ROOT)).filter((file) =>
  SOURCE_EXTENSIONS.includes(path.extname(file).toLowerCase()),
);

let generated = 0;

for (const sourcePath of sources) {
  // "public/images/plafonniers/br-01.jpg" → "plafonniers/br-01"
  const relative = path.relative(SOURCE_ROOT, sourcePath);
  const nameWithoutExtension = relative.slice(0, -path.extname(relative).length);

  for (const width of WIDTHS) {
    const outputPath = path.join(
      OUTPUT_ROOT,
      `${nameWithoutExtension}-${width}.webp`,
    );
    if (await isUpToDate(sourcePath, outputPath)) continue;

    await mkdir(path.dirname(outputPath), { recursive: true });
    await sharp(sourcePath)
      // withoutEnlargement : une source plus petite que la largeur demandée
      // garde sa taille. Le fichier existe quand même, car next/image peut
      // le demander dans son srcset.
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    generated += 1;
  }
}

console.log(
  `optimize-images : ${generated} variante(s) générée(s), ${sources.length} source(s).`,
);
