/**
 * Job Filters Component
 *
 * Uses Zustand store to manage filter state and syncs with URL.
 * When filters change, the store updates and triggers URL update,
 * which causes React Router to re-run the loader server-side.
 */

import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useFiltersStore } from "../lib/stores/useFiltersStore";

export function JobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilter, clearFilters, hydrateFromUrl, getUrlParams } =
    useFiltersStore();
  const isInitialMount = useRef(true);

  // Hydrate store from URL on mount
  useEffect(() => {
    hydrateFromUrl(searchParams);
    isInitialMount.current = false;
  }, []); // Only on mount

  // Sync URL when filters change (but not on initial hydration)
  useEffect(() => {
    if (isInitialMount.current) return;

    const urlParams = getUrlParams();
    const currentParamsString = searchParams.toString();
    const newParamsString = urlParams.toString();

    // Only update URL if filters actually changed
    if (newParamsString !== currentParamsString) {
      setSearchParams(urlParams, { replace: false });
    }
  }, [filters]); // Only depend on filters, not searchParams to avoid loops

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={() => {
              clearFilters();
              setSearchParams({});
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Filter */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Job title, company..."
            value={filters.search || ""}
            onChange={(e) => setFilter("search", e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Job Type Filter */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Job Type
          </label>
          <select
            id="type"
            value={filters.type || ""}
            onChange={(e) => setFilter("type", e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="City, State..."
            value={filters.location || ""}
            onChange={(e) => setFilter("location", e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Min Salary Filter */}
        <div>
          <label
            htmlFor="minSalary"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Min Salary ($)
          </label>
          <input
            id="minSalary"
            type="number"
            placeholder="Min"
            value={filters.minSalary || ""}
            onChange={(e) =>
              setFilter(
                "minSalary",
                e.target.value ? parseInt(e.target.value, 10) : undefined
              )
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
