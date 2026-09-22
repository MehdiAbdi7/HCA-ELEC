const ITEMS = [
  { value: "40+", label: "références d'éclairage en stock" },
  { value: "3", label: "positions de couleur sur la plupart des modèles" },
  { value: "Alger", label: "retrait en magasin, Tixeraine, birkhadem" },
];

export function TrustStrip() {
  return (
    <section className="border-b border-line bg-surface-2">
      <div className="mx-auto grid max-w-6xl divide-y divide-line px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {ITEMS.map((item) => (
          <div key={item.label} className="py-6 sm:px-6 sm:py-8">
            <p className="font-display text-2xl font-semibold text-orange-ink">
              {item.value}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
