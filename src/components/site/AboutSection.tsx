import Image from "next/image";

export function AboutSection() {
  return (
    <section id="magasin" className="border-b border-line py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:items-center md:gap-16">
        <div className="notch relative aspect-square overflow-hidden border border-line md:order-2">
          <Image
            src="/images/shop/interieur.jpg"
            alt="Rayons du magasin Home Connect Algérie"
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="md:order-1">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Le stock d&apos;un électricien, l&apos;œil d&apos;un décorateur
          </h2>
          <p className="mt-4 text-ink-soft">
            Câbles, disjoncteurs, prises et interrupteurs Legrand d&apos;un côté
            ; plafonniers et appliques pour finir une pièce de l&apos;autre. Le
            magasin est pensé pour qu&apos;un chantier ou une rénovation trouve
            tout ce qu&apos;il lui faut en une visite.
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm">
            <li className="flex items-baseline gap-3">
              <span className="text-orange-ink">—</span>
              Matériel électrique général (câblage, appareillage, protection)
            </li>
            <li className="flex items-baseline gap-3">
              <span className="text-orange-ink">—</span>
              Éclairage LED intérieur et extérieur
            </li>
            <li className="flex items-baseline gap-3">
              <span className="text-orange-ink">—</span>
              Conseil sur place pour choisir la bonne référence
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
