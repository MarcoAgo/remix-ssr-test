/**
 * Loader, Action and Meta functions for the job application route
 * 
 * Demonstrates server-to-server POST request flow
 */

import type { Route } from "../../routes/+types/jobs.apply.$id";
import { getJobById, submitApplication, type ApplicationData } from "../jobs";

/**
 * Loader function for the job application page
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
 * Action function for form submission (POST)
 * Server-to-server POST request - runs on the server only
 */
export async function action({ request, params }: Route.ActionArgs) {
  const { id } = params;

  if (!id) {
    return {
      success: false,
      message: "Job ID is required",
    };
  }

  // Parse form data
  const formData = await request.formData();
  const applicationData: ApplicationData = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string || undefined,
    resume: formData.get("resume") as string || undefined,
    coverLetter: formData.get("coverLetter") as string || undefined,
    linkedInUrl: formData.get("linkedInUrl") as string || undefined,
    portfolioUrl: formData.get("portfolioUrl") as string || undefined,
  };

  // Server-to-server POST request - this runs on the server
  // The API endpoint is NEVER exposed to the client
  const result = await submitApplication(id, applicationData);

  return result;
}

/**
 * Meta function for SEO
 */
export function meta({ loaderData }: Route.MetaArgs) {
  const { job } = loaderData;

  if (!job) {
    return [{ title: "Job Not Found" }];
  }

  return [
    { title: `Apply to ${job.title} at ${job.company} - Job Board` },
    {
      name: "description",
      content: `Apply for ${job.title} at ${job.company}`,
    },
  ];
}

