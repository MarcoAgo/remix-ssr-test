import { create } from "zustand";
import type { JobFilters } from "../jobs";

interface FiltersState {
  filters: JobFilters;
  setFilter: (
    key: keyof JobFilters,
    value: string | number | undefined
  ) => void;
  clearFilters: () => void;
  reset: (filters: JobFilters) => void;
  hydrateFromUrl: (searchParams: URLSearchParams) => void;
  hydrateFromLoader: (filters: JobFilters) => void;
  getUrlParams: () => URLSearchParams;
}

/**
 * Zustand store for managing job filters
 *
 * The store maintains filter state and provides methods to:
 * - Update individual filters
 * - Clear all filters
 * - Hydrate from URL parameters (on initial load)
 * - Hydrate from loader data (after server response)
 * - Generate URL search params from current filter state
 */
export const useFiltersStore = create<FiltersState>((set, get) => ({
  filters: {},

  setFilter: (key, value) => {
    set((state) => {
      const newFilters = { ...state.filters };

      if (value === undefined || value === "" || value === null) {
        delete newFilters[key];
      } else {
        if (key === "minSalary" || key === "maxSalary") {
          const numValue =
            typeof value === "string" ? parseInt(value, 10) : value;
          if (!isNaN(numValue)) {
            newFilters[key] = numValue;
          }
        } else {
          newFilters[key] = value as any;
        }
      }

      return { filters: newFilters };
    });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  reset: (filters) => {
    set({ filters });
  },

  hydrateFromUrl: (searchParams) => {
    const filters: JobFilters = {};

    const type = searchParams.get("type");
    if (
      type &&
      ["full-time", "part-time", "contract", "internship"].includes(type)
    ) {
      filters.type = type as JobFilters["type"];
    }

    const location = searchParams.get("location");
    if (location) {
      filters.location = location;
    }

    const minSalary = searchParams.get("minSalary");
    if (minSalary) {
      const parsed = parseInt(minSalary, 10);
      if (!isNaN(parsed)) {
        filters.minSalary = parsed;
      }
    }

    const maxSalary = searchParams.get("maxSalary");
    if (maxSalary) {
      const parsed = parseInt(maxSalary, 10);
      if (!isNaN(parsed)) {
        filters.maxSalary = parsed;
      }
    }

    const search = searchParams.get("search");
    if (search) {
      filters.search = search;
    }

    set({ filters });
  },

  hydrateFromLoader: (filters) => {
    set({ filters });
  },

  getUrlParams: () => {
    const { filters } = get();
    const params = new URLSearchParams();

    if (filters.type) {
      params.set("type", filters.type);
    }

    if (filters.location) {
      params.set("location", filters.location);
    }

    if (filters.minSalary !== undefined) {
      params.set("minSalary", filters.minSalary.toString());
    }

    if (filters.maxSalary !== undefined) {
      params.set("maxSalary", filters.maxSalary.toString());
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    return params;
  },
}));
