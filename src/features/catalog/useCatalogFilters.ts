"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  parseCatalogFilters,
  toSearchParams,
  type CatalogFilters,
} from "./catalog.filters";

/**
 * Pont entre l'URL et les filtres du catalogue.
 * L'URL est la source de vérité : pas de state local dupliqué qui pourrait
 * se désynchroniser.
 */
export function useCatalogFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(
    () => parseCatalogFilters(searchParams),
    [searchParams],
  );

  /** Remplace TOUS les filtres d'un coup (bouton "Appliquer"). */
  const applyFilters = useCallback(
    (next: CatalogFilters) => {
      const query = toSearchParams(next).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  /** Modifie une partie des filtres (tri, qui s'applique immédiatement). */
  const setFilters = useCallback(
    (patch: Partial<CatalogFilters>) => applyFilters({ ...filters, ...patch }),
    [filters, applyFilters],
  );

  const resetFilters = useCallback(
    () => applyFilters({ ...DEFAULT_FILTERS, tri: filters.tri }),
    [filters.tri, applyFilters],
  );

  return {
    filters,
    applyFilters,
    setFilters,
    resetFilters,
    activeCount: countActiveFilters(filters),
  };
}
