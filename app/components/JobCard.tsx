import { Link } from "react-router";
import { formatJobType, formatSalary, type Job } from "../lib/jobs";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {job.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {job.company}
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
          {formatJobType(job.type)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm">{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              {formatSalary(job.salary)}
            </span>
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
        {job.description}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
          View Details →
        </span>
      </div>
    </Link>
  );
}
