"use client";

import { useState } from "react";
import Image from "next/image";
import { SITE } from "@/data/lighting";
import { ThemeToggle } from "./ThemeToggle";
import { MenuIcon, CloseIcon, PhoneIcon } from "./icons";

const LINKS = [
  { href: "#plafonniers", label: "Plafonniers" },
  { href: "#appliques", label: "Appliques" },
  { href: "#magasin", label: "Le magasin" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#accueil" className="flex items-center gap-2.5">
          <Image
            src="/images/brand/logo-navbar.png"
            alt="HCA ELEC"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="font-display text-base font-semibold tracking-tight">
            {SITE.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 bg-orange px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <PhoneIcon className="h-4 w-4" />
            {SITE.phoneDisplay}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 items-center justify-center border border-line md:hidden"
        >
          {open ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-ink-soft"
              >
                {link.label}
              </a>
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
