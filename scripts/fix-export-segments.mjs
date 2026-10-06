// Corrige après le build un bug de l'export statique de Next 16 sous Windows.
//
// Le routeur de Next précharge chaque page via des petits fichiers au nom
// "à points" : /panier/__next.panier.__PAGE__.txt. Sous Windows, le build
// construit ce nom avec un antislash (panier\__PAGE__), que le système lit
// comme un dossier : il écrit out/panier/__next.panier/__PAGE__.txt.
// En ligne, le navigateur reçoit une 404 pour chaque lien préchargé
// (erreurs console, "Bonnes pratiques" à 96 dans Lighthouse).
//
// Ce script remet chaque fichier au nom attendu :
//   out/panier/__next.panier/__PAGE__.txt → out/panier/__next.panier.__PAGE__.txt
// Sur Mac ou Linux, aucun dossier "__next.*" n'existe et il ne fait rien.

import { readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "out";
const SEGMENT_PREFIX = "__next.";

/** Liste récursive des fichiers d'un dossier, en chemins relatifs. */
async function listFiles(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? listFiles(fullPath, base)
        : [path.relative(base, fullPath)];
    }),
  );
  return nested.flat();
}

/** Aplatit un dossier "__next.xxx" en fichiers "__next.xxx.yyy.txt" à côté de lui. */
async function flattenSegmentDirectory(segmentDir) {
  const parent = path.dirname(segmentDir);
  const files = await listFiles(segmentDir);
  for (const file of files) {
    // "$d$slug\__PAGE__.txt" → "$d$slug.__PAGE__.txt"
    const dottedName = file.split(path.sep).join(".");
    const target = path.join(parent, `${path.basename(segmentDir)}.${dottedName}`);
    await rename(path.join(segmentDir, file), target);
  }
  await rm(segmentDir, { recursive: true });
  return files.length;
}

/** Cherche les dossiers "__next.*" dans out/ (sauf out/_next, les fichiers JS/CSS). */
async function findSegmentDirectories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.name.startsWith(SEGMENT_PREFIX)) found.push(fullPath);
    else found.push(...(await findSegmentDirectories(fullPath)));
  }
  return found;
}

const segmentDirectories = await findSegmentDirectories(OUT_DIR);
let moved = 0;
for (const segmentDir of segmentDirectories) {
  moved += await flattenSegmentDirectory(segmentDir);
}

console.log(`fix-export-segments : ${moved} fichier(s) de préchargement renommé(s).`);
