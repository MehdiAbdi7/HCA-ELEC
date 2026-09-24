"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/config/site";
import { CartButton } from "@/components/cart/CartButton";
import { ThemeToggle } from "./ThemeToggle";
import { MenuIcon, CloseIcon, PhoneIcon } from "./icons";

// Liens absolus ("/#magasin" et non "#magasin") : la navbar est aussi
// affichée sur /produits et /panier, où ces sections n'existent pas.
const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Catalogue" },
  { href: "/#magasin", label: "À propos" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5"
          onClick={close}
        >
          <Image
            src="/images/brand/logo-navbar.png"
            alt="Home Connect Algérie"
            width={50}
            height={50}
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-base font-semibold tracking-tight sm:inline">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <CartButton />
          <a
            href={SITE.phoneHref}
            className="hidden items-center gap-2 bg-orange px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 lg:flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {SITE.phoneDisplay}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-9 w-9 items-center justify-center border border-line md:hidden"
          >
            {open ? (
              <CloseIcon className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-surface px-5 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-sm text-ink-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <ThemeToggle />
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-2 bg-orange px-4 py-2 text-sm font-medium text-white"
            >
              <PhoneIcon className="h-4 w-4" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
