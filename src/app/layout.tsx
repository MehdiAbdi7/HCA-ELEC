import type { Metadata } from "next";
import { preload } from "react-dom";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SITE } from "@/config/site";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  // Pas de préchargement : ce fichier (47 Ko) ralentissait l'image LCP.
  // Le texte s'affiche d'abord dans la police de secours, que next/font
  // ajuste aux dimensions d'Inter : pas de décalage quand Inter arrive.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "HCA ELEC — Home Connect Algérie",
    // Chaque page ne définit que son titre : "Catalogue" → "Catalogue — HCA ELEC"
    template: "%s — HCA ELEC",
  },
  description:
    "Électricité générale, éclairage LED et domotique à Alger. Plafonniers, appliques murales et matériel électrique en stock.",
};

const themeInitScript = `
(function() {
  try {
    const stored = localStorage.getItem("theme");
    const mode = stored || "system";
    const isDark = mode === "dark" ||
      (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  } catch {
    // localStorage indisponible → mode clair par défaut
  }
})();
`;

/**
 * Fond de page (classe .background de globals.css) préchargé dès le HTML.
 * Sur l'accueil, c'est l'élément LCP (la plus grande image visible au
 * chargement) : sans préchargement, le navigateur ne le découvre qu'après
 * avoir téléchargé le CSS, puis l'affiche après l'exécution du JS.
 *
 * Les media queries reprennent les règles de globals.css : variante 640 sous
 * 768 px de large, 1280 au-delà ; fond clair ou sombre selon le système.
 * Un visiteur qui a forcé l'autre thème télécharge un fond pour rien
 * (~15 Ko) : compromis accepté.
 */
const BACKGROUND_PRELOADS = [
  {
    href: "/images-opt/bg-white-640.webp",
    media: "(max-width: 767px) and (prefers-color-scheme: light)",
  },
  {
    href: "/images-opt/bg-dark-640.webp",
    media: "(max-width: 767px) and (prefers-color-scheme: dark)",
  },
  {
    href: "/images-opt/bg-white-1280.webp",
    media: "(min-width: 768px) and (prefers-color-scheme: light)",
  },
  {
    href: "/images-opt/bg-dark-1280.webp",
    media: "(min-width: 768px) and (prefers-color-scheme: dark)",
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // preload() de React ajoute un <link rel="preload"> dans le <head>, avant le CSS.
  for (const { href, media } of BACKGROUND_PRELOADS) {
    preload(href, { as: "image", fetchPriority: "high", media });
  }

  return (
    <html
      lang="fr"
      // overflow-x-clip (pas overflow-x-hidden) : "hidden" force overflow-y à
      // "auto" et casse position:sticky (navbar, filtres, résumé panier).
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased overflow-x-clip`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col overflow-x-clip font-sans text-ink">
        <Providers>
          {/* Navbar et Footer communs à toutes les pages. */}
          <Navbar />
          <div className="flex-1 background">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
