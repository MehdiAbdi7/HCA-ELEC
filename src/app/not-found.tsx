import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 py-24">
      <p className="text-sm text-orange-ink">Erreur 404</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Cette page n&apos;existe pas</h1>
      <p className="text-ink-soft">Le produit a peut-être été retiré du catalogue.</p>
      <Link
        href="/produits"
        className="mt-2 bg-ink px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 dark:bg-orange dark:text-ink"
      >
        Voir le catalogue
      </Link>
    </main>
  );
}
