/**
 * Loader and Meta functions for the job detail route
 */

import type { Route } from "../../routes/+types/jobs.$id";
import { getJobById, formatSalary } from "../jobs";

/**
 * Loader function for the job detail page
 * Server-to-server API call - runs on the server only
 */
export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;

  if (!id) {
    throw new Response("Job ID is required", { status: 400 });
  }

  // Server-to-server API call - runs on server only
  const job = await getJobById(id);

  if (!job) {
    throw new Response("Job not found", { status: 404 });
  }

  return {
    job,
  };
}

/**
 * Meta function for SEO and social sharing
 */
export function meta({ loaderData }: Route.MetaArgs) {
  const { job } = loaderData;

  if (!job) {
    return [{ title: "Job Not Found" }];
  }

  const description = `${job.title} at ${job.company} - ${job.location}. ${job.description.substring(0, 150)}...`;

  return [
    { title: `${job.title} at ${job.company} - Job Board` },
    {
      name: "description",
      content: description,
    },
    {
      property: "og:title",
      content: `${job.title} at ${job.company}`,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: `${job.title} at ${job.company}`,
    },
    {
      name: "twitter:description",
      content: description,
    },
  ];
}

