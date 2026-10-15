/**
 * Bandeau en haut de toutes les pages : Home Connect Algérie a cessé son
 * activité, le site reste en ligne comme réalisation de portfolio.
 *
 * Placé avant la Navbar dans le layout : il défile avec la page, et la
 * Navbar (sticky) reste collée en haut une fois le bandeau passé.
 *
 * Trois longueurs selon la largeur, pour tenir sur une ligne.
 */
export function InactiveBanner() {
  return (
    <p className="bg-orange px-3 py-1 text-center text-xs font-bold leading-snug text-on-orange">
      <span className="sm:hidden">
        Entreprise inactive : commandes non traitées.
      </span>
      <span className="hidden sm:inline">
        Home Connect Algérie a cessé son activité : les commandes ne sont plus
        traitées.
      </span>
      <span className="hidden lg:inline">
        {" "}
        Site conservé comme réalisation par Mehdi Abdi.
      </span>
    </p>
  );
}
