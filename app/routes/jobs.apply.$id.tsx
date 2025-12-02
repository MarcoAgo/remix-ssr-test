/**
 * Job Application Form Route
 * 
 * Demonstrates server-to-server POST request flow:
 * 1. User submits form → React Router action (POST) on server
 * 2. Action calls mock API POST server-to-server
 * 3. Response updates UI and state
 * 
 * All API calls happen server-side, never exposed to client.
 */

import type { Route } from "./+types/jobs.apply.$id";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { formatSalary, formatJobType } from "../lib/jobs";
import { loader, action, meta } from "../lib/loaders/jobs.apply";

export { loader, action, meta };

export default function JobApply({ loaderData }: Route.ComponentProps) {
  const { job } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          to={`/jobs/${job.id}`}
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
          Back to Job Details
        </Link>

        {/* Success Message */}
        {actionData?.success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-semibold">{actionData.message}</p>
                {actionData.applicationId && (
                  <p className="text-sm mt-1">
                    Application ID: {actionData.applicationId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {actionData && !actionData.success && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-semibold">{actionData.message}</p>
            </div>
          </div>
        )}

        {/* Job Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Applying for
          </h2>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {job.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{job.location}</span>
              <span>{formatJobType(job.type)}</span>
              {job.salary && (
                <span className="font-medium">{formatSalary(job.salary)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Application Form
          </h2>

          <Form method="post" className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                defaultValue={actionData?.success ? "" : undefined}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={actionData?.success ? "" : undefined}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john.doe@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={actionData?.success ? "" : undefined}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label
                htmlFor="linkedInUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                LinkedIn Profile URL
              </label>
              <input
                id="linkedInUrl"
                name="linkedInUrl"
                type="url"
                defaultValue={actionData?.success ? "" : undefined}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>

            {/* Portfolio URL */}
            <div>
              <label
                htmlFor="portfolioUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Portfolio URL
              </label>
              <input
                id="portfolioUrl"
                name="portfolioUrl"
                type="url"
                defaultValue={actionData?.success ? "" : undefined}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://johndoe.dev"
              />
            </div>

            {/* Resume/CV */}
            <div>
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Resume/CV (URL or text)
              </label>
              <textarea
                id="resume"
                name="resume"
                rows={4}
                defaultValue={actionData?.success ? "" : undefined}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste your resume text or provide a URL to your resume"
              />
            </div>

            {/* Cover Letter */}
            <div>
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={6}
                defaultValue={actionData?.success ? "" : undefined}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us why you're interested in this position..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to={`/jobs/${job.id}`}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}

