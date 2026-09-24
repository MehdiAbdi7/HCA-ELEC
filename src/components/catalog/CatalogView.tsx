"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Product } from "@/features/catalog/catalog.types";
import {
  DEFAULT_FILTERS,
  SORT_LABELS,
  SORT_VALUES,
  applyCatalogFilters,
  countActiveFilters,
  toSearchParams,
  type CatalogFilters as Filters,
  type SortValue,
} from "@/features/catalog/catalog.filters";
import { useCatalogFilters } from "@/features/catalog/useCatalogFilters";
import { CloseIcon, SlidersIcon } from "@/components/site/icons";
import { CatalogFilters } from "./CatalogFilters";
import { ProductCard } from "./ProductCard";

/** Hauteur de la navbar sticky (h-16 = 64px) : la barre de tri se colle juste en dessous. */
const NAVBAR_HEIGHT_PX = 64;
const DESKTOP_QUERY = "(min-width: 1024px)";

const productsLabel = (count: number) =>
  `${count} produit${count > 1 ? "s" : ""}`;

const subscribeToDesktop = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * Vrai à partir de lg. Le CSS suffit pour l'apparence ; ce hook sert au
 * comportement : desktop = filtrage immédiat, mobile = brouillon + "Appliquer".
 * Snapshot serveur à `false` (export statique) → premier rendu identique
 * côté serveur et client, puis React réévalue.
 */
function useIsDesktop() {
  return useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

export function CatalogView({ products }: { products: Product[] }) {
  const { filters, applyFilters, setFilters, resetFilters, activeCount } =
    useCatalogFilters();
  const [drawerRequested, setDrawerRequested] = useState(false);
  const isDesktop = useIsDesktop();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Le tiroir n'existe qu'en mobile : on dérive son état au lieu de le
  // synchroniser dans un effet (rendus en cascade). Si la fenêtre s'élargit
  // alors qu'il est ouvert, il redevient simplement la sidebar.
  const drawerOpen = drawerRequested && !isDesktop;

  const results = useMemo(
    () => applyCatalogFilters(products, filters),
    [products, filters],
  );

  /**
   * Identité des filtres APPLIQUÉS, hors tri. Sert de `key` au panneau en
   * mobile : dès que les filtres appliqués changent (Appliquer, réinitialisation,
   * bouton retour du navigateur), le brouillon repart de ces valeurs.
   * Le tri est exclu : le changer ne doit pas effacer une sélection en cours.
   * En desktop la clé est fixe : le panneau lit directement les filtres
   * appliqués, donc il n'a rien à resynchroniser — et le remonter à chaque
   * frappe ferait perdre le focus du champ de recherche.
   */
  const appliedKey = useMemo(
    () => toSearchParams({ ...filters, tri: DEFAULT_FILTERS.tri }).toString(),
    [filters],
  );

  /**
   * Si le client trie/filtre alors qu'il est descendu dans la liste, on le
   * ramène en haut des résultats : sinon il reste "dans le vide" sous une
   * liste qui vient de rétrécir.
   */
  const scrollToResultsIfNeeded = () => {
    const resultsElement = resultsRef.current;
    if (!resultsElement) return;
    const top =
      resultsElement.getBoundingClientRect().top +
      window.scrollY -
      NAVBAR_HEIGHT_PX;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  };

  const handleApply = (next: Filters) => {
    // Le tri vient de la barre du haut, pas du panneau : on garde celui en cours.
    applyFilters({ ...next, tri: filters.tri });
    setDrawerRequested(false);
    scrollToResultsIfNeeded();
  };

  const handleSort = (tri: SortValue) => {
    setFilters({ tri });
    scrollToResultsIfNeeded();
  };

  const handleResetAll = () => {
    resetFilters();
    scrollToResultsIfNeeded();
  };

  // Tiroir mobile ouvert : on bloque le scroll de la page derrière et
  // la touche Échap le ferme. (Rien à faire sur desktop : c'est une sidebar.)
  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerRequested(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-12">
      <FiltersPanel
        key={isDesktop ? "sidebar" : appliedKey}
        products={products}
        appliedFilters={filters}
        isDesktop={isDesktop}
        open={drawerOpen}
        onClose={() => setDrawerRequested(false)}
        onApply={handleApply}
      />

      <div ref={resultsRef}>
        {/*
          Barre de tri collée sous la navbar : toujours accessible pendant le scroll.
          -mx-5 px-5 sur mobile : le fond couvre toute la largeur, les cartes
          ne dépassent pas sur les côtés en passant dessous.
        */}
        <div className="sticky top-16 z-30 -mx-5 flex items-center gap-3 border-b border-line bg-bg/95 px-5 py-3 backdrop-blur lg:mx-0">
          <button
            type="button"
            onClick={() => setDrawerRequested(true)}
            aria-expanded={drawerOpen}
            aria-controls="catalog-filters"
            className="flex h-9 shrink-0 items-center gap-2 border border-line px-3 text-sm font-medium transition-colors hover:border-orange lg:hidden"
          >
            <SlidersIcon className="h-4 w-4" />
            Filtrer
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[11px] font-semibold text-white">
                {activeCount}
              </span>
            )}
          </button>

          <p
            className="hidden text-sm text-ink-soft sm:block"
            aria-live="polite"
          >
            {productsLabel(results.length)}
          </p>

          <label className="ml-auto flex min-w-0 items-center gap-2 text-sm">
            <span className="hidden text-ink-soft sm:inline">Trier par</span>
            <span className="sr-only sm:hidden">Trier par</span>
            <select
              value={filters.tri}
              onChange={(e) => handleSort(e.target.value as SortValue)}
              className="h-9 min-w-0 border border-line bg-surface px-2 text-sm outline-none focus:border-orange"
            >
              {SORT_VALUES.map((value) => (
                <option key={value} value={value}>
                  {SORT_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="mt-10 border border-dashed border-line px-6 py-14 text-center">
            <p className="font-display text-lg font-semibold">
              Aucun produit ne correspond à ces filtres
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              Élargissez votre recherche, ou demandez au magasin : tout le stock
              n&apos;est pas en ligne.
            </p>
            <button
              type="button"
              onClick={handleResetAll}
              className="mt-6 bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 dark:bg-orange dark:text-ink"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type FiltersPanelProps = {
  products: Product[];
  /** Filtres actuellement appliqués (= ceux de l'URL). */
  appliedFilters: Filters;
  /** À partir de lg : sidebar sticky + filtrage immédiat au lieu du tiroir. */
  isDesktop: boolean;
  open: boolean;
  onClose: () => void;
  onApply: (next: Filters) => void;
};

/** Marge laissée sous la colonne une fois collée. */
const SIDEBAR_BOTTOM_GAP_PX = 16;

/**
 * Un composant, deux comportements :
 *
 *  - desktop : sidebar sticky, les résultats sont visibles à côté des filtres,
 *    donc chaque changement s'applique immédiatement. Pas de bouton, donc plus
 *    de bouton hors écran tant que la colonne n'est pas collée.
 *  - mobile : tiroir plein écran. Les résultats sont masqués pendant la
 *    sélection, d'où le brouillon local validé par "Appliquer", qui annonce à
 *    l'avance combien de produits seront affichés.
 */
function FiltersPanel({
  products,
  appliedFilters,
  isDesktop,
  open,
  onClose,
  onApply,
}: FiltersPanelProps) {
  const [draft, setDraft] = useState<Filters>(appliedFilters);
  const [searchKey, setSearchKey] = useState(0);
  const asideRef = useRef<HTMLElement>(null);

  const instantApply = isDesktop;

  /**
   * Hauteur disponible réelle de la colonne.
   *
   * `max-h-[calc(100dvh-…)]` ne suffit pas : il suppose que la colonne
   * commence en haut de la fenêtre. Tant qu'elle n'est pas collée, elle est à
   * sa position naturelle (sous le titre de page), donc elle dépasse d'autant
   * par le bas — et ce qui dépasse est hors écran, inatteignable au scroll
   * interne. On mesure donc sa distance au haut de la fenêtre et on en déduit
   * la hauteur restante.
   *
   * Écriture directe dans le style : c'est une mesure de mise en page, pas un
   * état applicatif. Passer par useState déclencherait un rendu par frame de
   * scroll pour rien.
   */
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside || !isDesktop) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const { top } = aside.getBoundingClientRect();
      const available =
        window.innerHeight - Math.max(top, 0) - SIDEBAR_BOTTOM_GAP_PX;
      aside.style.maxHeight = `${Math.max(available, 200)}px`;
    };
    // Une seule mesure par frame : getBoundingClientRect force un recalcul
    // de mise en page, à ne pas déclencher à chaque événement de scroll.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      aside.style.maxHeight = "";
    };
  }, [isDesktop]);

  // En desktop, la source de vérité reste l'URL : rien à synchroniser, et le
  // bouton retour du navigateur remet les cases dans le bon état tout seul.
  const values = instantApply ? appliedFilters : draft;

  const commit = (next: Filters) =>
    instantApply ? onApply(next) : setDraft(next);

  const previewCount = useMemo(
    () => applyCatalogFilters(products, values).length,
    [products, values],
  );

  // Comparaison par l'URL qu'ils produiraient : plus simple et plus sûr
  // qu'un champ-à-champ à maintenir quand un filtre sera ajouté.
  const hasChanges = useMemo(
    () =>
      toSearchParams(values).toString() !==
      toSearchParams(appliedFilters).toString(),
    [values, appliedFilters],
  );

  const updateValues = (patch: Partial<Filters>) => {
    const next = { ...values, ...patch };
    // Une gamme appartient à une catégorie : changer de catégorie la réinitialise.
    if ("categorie" in patch && patch.categorie !== values.categorie) {
      next.collection = undefined;
    }
    commit(next);
  };

  const resetValues = () => {
    commit({ ...DEFAULT_FILTERS, tri: values.tri });
    setSearchKey((key) => key + 1); // remonte le champ de recherche vide
  };

  return (
    <aside
      ref={asideRef}
      id="catalog-filters"
      role={open ? "dialog" : undefined}
      aria-modal={open || undefined}
      aria-label="Filtres du catalogue"
      className={`${open ? "fixed inset-0 z-60 flex" : "hidden"} flex-col bg-bg lg:sticky lg:inset-auto lg:top-16 lg:z-auto lg:flex lg:max-h-[calc(100dvh-5rem)] lg:self-start lg:bg-transparent`}
    >
      {/* En-tête du tiroir (mobile uniquement) */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5 lg:hidden">
        <p className="font-display text-lg font-semibold">Filtres</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer les filtres"
          className="flex h-9 w-9 items-center justify-center border border-line"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      {/*
        min-h-0 : indispensable pour que le scroll interne s'active dans un conteneur flex.
        overscroll-contain est réservé au tiroir mobile (la page ne doit pas défiler
        derrière). En desktop il doit être désactivé : sinon la molette est absorbée
        par cette zone, la page ne descend jamais, et la colonne n'atteint jamais son
        point de collage — son bas reste hors écran en permanence.
      */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 [scrollbar-color:var(--line)_transparent] scrollbar-thin lg:overscroll-auto lg:px-0 lg:py-0 lg:pr-3 lg:pb-6">
        <CatalogFilters
          products={products}
          filters={values}
          onChange={updateValues}
          onReset={resetValues}
          activeCount={countActiveFilters(values)}
          searchKey={searchKey}
        />
      </div>

      {/* Validation du brouillon : mobile seulement (desktop filtre à la volée). */}
      <div className="shrink-0 border-t border-line p-5 lg:hidden">
        <button
          type="button"
          onClick={() => onApply(draft)}
          disabled={!hasChanges}
          className="w-full bg-orange py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {hasChanges
            ? `Appliquer — ${productsLabel(previewCount)}`
            : "Filtres appliqués"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full border border-line py-2.5 text-sm font-medium transition-colors hover:border-orange"
        >
          Fermer
        </button>
      </div>
    </aside>
  );
}

export function CatalogSkeleton() {
  return (
    <div
      className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-12"
      aria-busy="true"
    >
      <div className="hidden h-96 animate-pulse bg-surface-2 lg:block" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="notch aspect-3/4 animate-pulse bg-surface-2"
          />
        ))}
      </div>
    </div>
  );
}
