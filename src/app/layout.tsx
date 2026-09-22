import type { Metadata } from "next";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
      <body className="flex min-h-full flex-col overflow-x-clip font-sans background text-ink">
        <Providers>
          {/* Navbar et Footer communs à toutes les pages. */}
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
