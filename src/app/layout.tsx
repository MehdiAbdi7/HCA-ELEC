import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
  title: "HCA ELEC — Home Connect Algérie",
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
    // localStorage indisponible (navigation privée stricte, cookies bloqués...)
    // → on ignore, la page reste simplement en mode clair par défaut
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      // overflow-x-clip (pas overflow-x-hidden) : "hidden" force silencieusement
      // overflow-y à "auto" quand overflow-y n'est pas précisé (règle CSS peu
      // connue) — html/body deviennent alors des conteneurs de scroll, ce qui
      // casse position:sticky pour la sidebar et la topbar.
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased overflow-x-clip`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col overflow-x-clip font-sans background text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
