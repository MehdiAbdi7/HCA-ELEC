"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/features/catalog/catalog.types";
import { getCategoryList, getCollectionsByCategory } from "@/features/catalog/catalog.queries";
import { PRICE_RANGE_IDS, PRICE_RANGES, type CatalogFilters as Filters } from "@/features/catalog/catalog.filters";
import { SearchIcon } from "@/components/site/icons";

type CatalogFiltersProps = {
  products: Product[];
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  activeCount: number;
  /** Change à chaque réinitialisation → remonte le champ de recherche vide. */
  searchKey: number;
};

export function CatalogFilters({ products, filters, onChange, onReset, activeCount, searchKey }: CatalogFiltersProps) {
  const countIn = (predicate: (p: Product) => boolean) => products.filter(predicate).length;

  const categoryOptions = getCategoryList().map((c) => ({
    value: c.id,
    label: c.shortLabel,
    count: countIn((p) => p.category === c.id),
  }));

  const collectionOptions = filters.categorie
    ? getCollectionsByCategory(filters.categorie).map((c) => ({
        value: c.id,
        label: c.title,
        count: countIn((p) => p.collectionId === c.id),
      }))
    : [];

  const priceOptions = PRICE_RANGE_IDS.map((id) => ({ value: id, label: PRICE_RANGES[id].label }));

  return (
    <div className="flex flex-col gap-7">
      <SearchField key={searchKey} initialValue={filters.q} onSearch={(q) => onChange({ q })} />

      <RadioFilter
        legend="Catégorie"
        name="categorie"
        allLabel="Toutes"
        options={categoryOptions}
        value={filters.categorie}
        onChange={(categorie) => onChange({ categorie })}
      />

      {collectionOptions.length > 0 && (
        <RadioFilter
          legend="Gamme"
          name="collection"
          allLabel="Toutes les gammes"
          options={collectionOptions}
          value={filters.collection}
          onChange={(collection) => onChange({ collection })}
        />
      )}

      <RadioFilter
        legend="Prix"
        name="prix"
        allLabel="Tous les prix"
        options={priceOptions}
        value={filters.prix}
        onChange={(prix) => onChange({ prix })}
      />

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Usage</legend>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={filters.exterieur}
            onChange={(e) => onChange({ exterieur: e.target.checked })}
            className="h-4 w-4 accent-orange"
          />
          Utilisable en extérieur
        </label>
      </fieldset>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="self-start text-sm font-medium text-orange-ink underline-offset-4 hover:underline"
        >
          Effacer les filtres ({activeCount})
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

type RadioFilterProps<T extends string> = {
  legend: string;
  name: string;
  allLabel: string;
  options: { value: T; label: string; count?: number }[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
};

/** Groupe de boutons radio avec une option "Tous" (= filtre désactivé). */
function RadioFilter<T extends string>({ legend, name, allLabel, options, value, onChange }: RadioFilterProps<T>) {
  const all = { value: "" as const, label: allLabel, count: undefined };
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-col gap-2">
        {[all, ...options].map((option) => (
          <label key={option.value || "all"} className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="radio"
              name={name}
              checked={(value ?? "") === option.value}
              onChange={() => onChange(option.value === "" ? undefined : (option.value as T))}
              className="h-4 w-4 accent-orange"
            />
            <span className="flex-1">{option.label}</span>
            {option.count !== undefined && <span className="text-xs text-ink-soft">{option.count}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Champ de recherche avec debounce : l'URL n'est mise à jour que 300 ms
 * après la dernière frappe (pas un router.replace par caractère).
 */
function SearchField({ initialValue, onSearch }: { initialValue: string; onSearch: (q: string) => void }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === initialValue) return;
    const timer = window.setTimeout(() => onSearch(trimmed), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [value, initialValue, onSearch]);

  return (
    <div>
      <label htmlFor="catalog-search" className="mb-3 block text-sm font-semibold">
        Rechercher
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          id="catalog-search"
          type="search"
          value={value}
          maxLength={60}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Crystal, noir, 12W…"
          className="w-full border border-line bg-bg py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-orange"
        />
      </div>
    </div>
  );
}
