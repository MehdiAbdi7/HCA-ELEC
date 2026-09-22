import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/config/site";
import { BoltShape } from "./icons";

export function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-10 md:grid-cols-2 md:items-center md:py-16">
        <div>
          <p className="text-sm text-orange-ink">
            {SITE.tagline} · {SITE.city}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            Tout le matériel électrique et l&apos;éclairage de votre maison, au même endroit.
          </h1>
          <p className="mt-5 max-w-md text-ink-soft">
            Plafonniers LED, appliques murales, câblage et domotique : {SITE.fullName} équipe les maisons d&apos;Alger
            avec du matériel en stock et des prix affichés en magasin.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/produits"
              className="bg-ink px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 dark:bg-orange dark:text-ink"
            >
              Voir le catalogue
            </Link>
            <a
              href={SITE.phoneHref}
              className="border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-orange hover:text-orange-ink"
            >
              Appeler le magasin
            </a>
          </div>
        </div>

        <div className="relative">
          <BoltShape className="absolute -right-6 -top-10 h-100 w-40 text-orange/15 md:-right-10 md:h-80 md:w-48" />
          {/* Photo source carrée (1080x1080) : le conteneur garde ce ratio. */}
          <div className="notch relative aspect-square overflow-hidden border border-line">
            <Image
              src="/images/shop/exterieur.jpg"
              alt="Devanture du magasin Home Connect Algérie"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
