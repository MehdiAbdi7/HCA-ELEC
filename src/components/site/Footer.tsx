import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/config/site";
import {
  categoryHref,
  getCategoryList,
} from "@/features/catalog/catalog.queries";
import { PhoneIcon, WhatsappIcon } from "./icons";

const NAV_LINKS = [
  { href: "/produits", label: "Catalogue" },
  { href: "/panier", label: "Mon panier" },
  { href: "/#magasin", label: "Le magasin" },
  { href: "/#contact", label: "Contact" },
];

// Ouvre l'adresse dans l'app de cartes du téléphone (Maps, Plans…).
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.fullName} ${SITE.address}`,
)}`;

export function Footer() {
  const categories = getCategoryList();

  return (
    <footer className="mt-4 border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marque */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/brand/logo-navbar.png"
                alt=""
                width={32}
                height={32}
                className=" object-contain"
              />
              <span className="font-display text-base font-semibold tracking-tight text-ink">
                {SITE.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-ink-soft">
              {SITE.fullName} — {SITE.tagline}, éclairage LED et domotique à{" "}
              {SITE.city}. Matériel en stock, prix affichés, conseil sur place.
            </p>
          </div>

          {/* Catalogue : alimenté par les catégories, donc jamais à jour "à la main" */}
          <nav aria-labelledby="footer-catalogue">
            <h2
              id="footer-catalogue"
              className="text-sm font-semibold text-ink"
            >
              Catalogue
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={categoryHref(category.id)}
                    className="transition-colors hover:text-orange-ink"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/produits"
                  className="transition-colors hover:text-orange-ink"
                >
                  Tous les produits
                </Link>
              </li>
            </ul>
          </nav>

          {/* Navigation + adresse */}
          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="text-sm font-semibold text-ink">
              À propos
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-orange-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-orange-ink"
                >
                  {SITE.address}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. Tous droits réservés.
          </p>
          <p>
            Développé par{" "}
            <a
              href="https://www.linkedin.com/in/mehdi-abdi-7b00353b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-orange-ink underline underline-offset-2 transition-colors hover:text-orange"
            >
              Mehdi Abdi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
