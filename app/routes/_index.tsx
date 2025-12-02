import type { Route } from "./+types/_index";
import { useEffect } from "react";
import { useNavigation } from "react-router";
import { JobFilters as JobFiltersComponent } from "../components/JobFilters";
import { useFiltersStore } from "../lib/stores/useFiltersStore";
import { JobCard } from "~/components/JobCard";
import { loader, meta } from "../lib/loaders/index";

export { loader, meta };

export default function JobsIndex({ loaderData }: Route.ComponentProps) {
  const { jobs, filters } = loaderData;
  const { hydrateFromLoader } = useFiltersStore();
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";
  const hasActiveFilters = Object.keys(filters).length > 0;

  useEffect(() => {
    hydrateFromLoader(filters);
  }, [filters, hydrateFromLoader]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Job Board
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover your next career opportunity
          </p>
        </header>

        <JobFiltersComponent />

        {isLoading && hasActiveFilters && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Searching jobs...
            </p>
          </div>
        )}

        {!isLoading && (
          <>
            {hasActiveFilters && (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Found {jobs.length} job{jobs.length !== 1 ? "s" : ""} matching
                your filters
              </div>
            )}

            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {hasActiveFilters
                    ? "No jobs match your filters. Try adjusting your search criteria."
                    : "No jobs available at the moment. Check back soon!"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
