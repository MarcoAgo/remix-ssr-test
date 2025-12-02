/**
 * Loader and Meta functions for the index route (job list)
 */

import type { Route } from "../../routes/+types/_index";
import { getAllJobs, type JobFilters, type Job } from "../jobs";

/**
 * Parse filters from URL query parameters
 */
function parseFiltersFromUrl(url: URL): JobFilters {
  const filters: JobFilters = {};

  const type = url.searchParams.get("type");
  if (
    type &&
    ["full-time", "part-time", "contract", "internship"].includes(type)
  ) {
    filters.type = type as Job["type"];
  }

  const location = url.searchParams.get("location");
  if (location) {
    filters.location = location;
  }

  const minSalary = url.searchParams.get("minSalary");
  if (minSalary) {
    const parsed = parseInt(minSalary, 10);
    if (!isNaN(parsed)) {
      filters.minSalary = parsed;
    }
  }

  const maxSalary = url.searchParams.get("maxSalary");
  if (maxSalary) {
    const parsed = parseInt(maxSalary, 10);
    if (!isNaN(parsed)) {
      filters.maxSalary = parsed;
    }
  }

  const search = url.searchParams.get("search");
  if (search) {
    filters.search = search;
  }

  return filters;
}

/**
 * Loader function for the job list page
 * Server-to-server API call - runs on the server only
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const filters = parseFiltersFromUrl(url);
  const hasFilters = Object.keys(filters).length > 0;

  // Simulate loading delay when filters are applied (fake API latency)
  if (hasFilters) {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  // Server-to-server API call - this runs on the server
  // getAllJobs now calls server/api/jobs.ts which simulates external API calls
  const jobs = await getAllJobs(hasFilters ? filters : undefined);

  return {
    jobs,
    filters,
  };
}

/**
 * Meta function for SEO and social sharing
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Job Board - Find Your Next Opportunity" },
    {
      name: "description",
      content:
        "Browse our latest job openings. Find your next career opportunity with top companies.",
    },
    {
      property: "og:title",
      content: "Job Board - Find Your Next Opportunity",
    },
    {
      property: "og:description",
      content:
        "Browse our latest job openings. Find your next career opportunity with top companies.",
    },
    { property: "og:type", content: "website" },
  ];
}
