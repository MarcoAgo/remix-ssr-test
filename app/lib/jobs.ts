export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  type: "full-time" | "part-time" | "contract" | "internship";
  postedDate: string;
  applyUrl?: string;
}

export interface JobFilters {
  type?: Job["type"];
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  search?: string;
}

/**
 * Re-export server API functions for use in loaders/actions
 *
 * IMPORTANT: These functions should ONLY be called in server-side code
 * (loaders, actions). They will make server-to-server API calls.
 *
 * In loaders/actions, import like this:
 * import { getAllJobs, getJobById, submitApplication } from "../lib/jobs";
 */
export {
  getJobs as getAllJobs,
  getJobById,
  submitApplication,
} from "../../server/api/jobs";

export type { ApplicationData } from "../../server/api/jobs";

/**
 * Format salary for display
 */
export function formatSalary(salary: Job["salary"]): string {
  if (!salary) return "Salary not specified";

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (salary.currency === "USD") {
    return `$${formatNumber(salary.min)} - $${formatNumber(salary.max)}`;
  }

  return `${formatNumber(salary.min)} - ${formatNumber(salary.max)} ${salary.currency}`;
}

/**
 * Format job type for display
 */
export function formatJobType(type: Job["type"]): string {
  const typeMap: Record<Job["type"], string> = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    contract: "Contract",
    internship: "Internship",
  };
  return typeMap[type];
}
