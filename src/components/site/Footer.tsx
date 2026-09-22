import Image from "next/image";
import { SITE } from "@/data/lighting";

export function Footer() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/brand/logo-navbar.png"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 object-contain opacity-80"
          />
          <span>
            {SITE.name} — {SITE.fullName}
          </span>
        </div>
        <p>© {new Date().getFullYear()} {SITE.fullName}. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
