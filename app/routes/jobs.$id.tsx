import type { Route } from "./+types/jobs.$id";
import { Link } from "react-router";
import { formatSalary, formatJobType } from "../lib/jobs";
import { loader, meta } from "../lib/loaders/jobs";

export { loader, meta };

export default function JobDetail({ loaderData }: Route.ComponentProps) {
  const { job } = loaderData;

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.id,
    },
    datePosted: job.postedDate,
    employmentType: job.type,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    ...(job.salary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: job.salary.currency,
        value: {
          "@type": "QuantitativeValue",
          minValue: job.salary.min,
          maxValue: job.salary.max,
          unitText: "YEAR",
        },
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Jobs
          </Link>

          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <header className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                    {job.company}
                  </p>
                </div>
                <span className="px-4 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {formatJobType(job.type)}
                </span>
              </div>

              <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    <span className="font-medium">
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </header>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Job Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </section>

            {job.requirements && job.requirements.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-700 dark:text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 mr-2 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <footer className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                to={`/jobs/${job.id}/apply`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Apply Now
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </footer>
          </article>
        </div>
      </main>
    </>
  );
}
