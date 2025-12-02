/**
 * Mock API Server-Side Module
 * 
 * This module simulates external API calls and should ONLY be imported
 * in server-side code (loaders, actions). Never expose these endpoints
 * to the client.
 * 
 * In a real application, these functions would make actual HTTP requests
 * to your backend API (e.g., fetch('https://api.example.com/jobs', {...}))
 */

import type { Job, JobFilters } from "../../app/lib/jobs";

// Mock jobs data - In production, this would come from a database or external API
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: {
      min: 120000,
      max: 180000,
      currency: "USD",
    },
    description:
      "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building modern, responsive web applications using React and TypeScript. The ideal candidate has a strong understanding of modern JavaScript, React ecosystem, and web performance optimization.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with SSR frameworks (Remix, Next.js)",
      "Knowledge of modern CSS (Tailwind CSS)",
      "Understanding of web performance optimization",
    ],
    type: "full-time",
    postedDate: "2024-01-15",
    applyUrl: "https://example.com/apply/1",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    salary: {
      min: 100000,
      max: 150000,
      currency: "USD",
    },
    description:
      "Join our fast-growing startup as a Full Stack Engineer. You'll work on both frontend and backend systems, building scalable applications that serve millions of users. We use modern technologies and best practices.",
    requirements: [
      "3+ years of full-stack development experience",
      "Proficiency in React and Node.js",
      "Experience with databases (PostgreSQL, MongoDB)",
      "Knowledge of cloud platforms (AWS)",
      "Strong problem-solving skills",
    ],
    type: "full-time",
    postedDate: "2024-01-14",
    applyUrl: "https://example.com/apply/2",
  },
  {
    id: "3",
    title: "React Developer",
    company: "Digital Agency Pro",
    location: "New York, NY",
    salary: {
      min: 90000,
      max: 130000,
      currency: "USD",
    },
    description:
      "We're seeking a talented React Developer to work on client projects. You'll collaborate with designers and backend developers to create beautiful, functional web applications. This role offers the opportunity to work on diverse projects across different industries.",
    requirements: [
      "2+ years of React experience",
      "Experience with state management (Redux, Zustand)",
      "Knowledge of RESTful APIs",
      "Strong attention to detail",
      "Portfolio demonstrating React projects",
    ],
    type: "full-time",
    postedDate: "2024-01-13",
    applyUrl: "https://example.com/apply/3",
  },
  {
    id: "4",
    title: "Frontend Engineer - Contract",
    company: "Enterprise Solutions",
    location: "Austin, TX",
    salary: {
      min: 80,
      max: 120,
      currency: "USD",
    },
    description:
      "We need a Frontend Engineer for a 6-month contract to help build our new customer portal. You'll work with our team to implement designs and ensure a great user experience. This is a great opportunity to work on a high-impact project.",
    requirements: [
      "3+ years of frontend development",
      "Strong React skills",
      "Experience with TypeScript",
      "Ability to work independently",
      "Available for 6-month contract",
    ],
    type: "contract",
    postedDate: "2024-01-12",
    applyUrl: "https://example.com/apply/4",
  },
  {
    id: "5",
    title: "Junior Frontend Developer",
    company: "Innovation Labs",
    location: "Seattle, WA",
    salary: {
      min: 70000,
      max: 90000,
      currency: "USD",
    },
    description:
      "Perfect opportunity for a junior developer looking to grow their career. You'll work alongside senior developers, learn best practices, and contribute to real projects. We provide mentorship and opportunities for professional development.",
    requirements: [
      "1+ years of React experience",
      "Understanding of JavaScript fundamentals",
      "Basic knowledge of HTML/CSS",
      "Eagerness to learn",
      "Strong communication skills",
    ],
    type: "full-time",
    postedDate: "2024-01-11",
    applyUrl: "https://example.com/apply/5",
  },
];

/**
 * Application data interface for POST requests
 */
export interface ApplicationData {
  fullName: string;
  email: string;
  phone?: string;
  resume?: string; // In production, this would be a file upload
  coverLetter?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
}

/**
 * GET /api/jobs - Fetch jobs with optional filters
 * 
 * This simulates a server-to-server API call.
 * In production, this would be: await fetch('https://api.example.com/jobs', { method: 'GET', ... })
 * 
 * @param filters - Optional filters to apply to the job list
 * @returns Promise<Job[]> - Filtered list of jobs
 */
export async function getJobs(filters?: JobFilters): Promise<Job[]> {
  // Simulate network delay (in production, this would be actual API latency)
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filteredJobs = [...mockJobs];

  if (!filters || Object.keys(filters).length === 0) {
    return filteredJobs;
  }

  // Apply filters server-side
  if (filters.type) {
    filteredJobs = filteredJobs.filter((job) => job.type === filters.type);
  }

  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    filteredJobs = filteredJobs.filter((job) =>
      job.location.toLowerCase().includes(locationLower)
    );
  }

  if (filters.minSalary !== undefined) {
    filteredJobs = filteredJobs.filter((job) => {
      if (!job.salary) return false;
      return job.salary.max >= filters.minSalary!;
    });
  }

  if (filters.maxSalary !== undefined) {
    filteredJobs = filteredJobs.filter((job) => {
      if (!job.salary) return false;
      return job.salary.min <= filters.maxSalary!;
    });
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
    );
  }

  return filteredJobs;
}

/**
 * GET /api/jobs/:id - Fetch a single job by ID
 * 
 * @param id - Job ID
 * @returns Promise<Job | null> - Job data or null if not found
 */
export async function getJobById(id: string): Promise<Job | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const job = mockJobs.find((job) => job.id === id);
  return job || null;
}

/**
 * POST /api/jobs/:id/apply - Submit a job application
 * 
 * This simulates a server-to-server POST request.
 * In production, this would be: await fetch('https://api.example.com/jobs/:id/apply', { method: 'POST', body: JSON.stringify(data), ... })
 * 
 * @param jobId - The ID of the job being applied to
 * @param data - Application data (name, email, resume, etc.)
 * @returns Promise with success status and message
 */
export async function submitApplication(
  jobId: string,
  data: ApplicationData
): Promise<{ success: boolean; message: string; applicationId?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Validate that the job exists
  const job = await getJobById(jobId);
  if (!job) {
    return {
      success: false,
      message: "Job not found",
    };
  }

  // Validate application data
  if (!data.fullName || !data.email) {
    return {
      success: false,
      message: "Full name and email are required",
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      success: false,
      message: "Invalid email format",
    };
  }

  // Simulate successful submission
  // In production, this would save to a database
  const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    success: true,
    message: `Application submitted successfully for ${job.title} at ${job.company}`,
    applicationId,
  };
}

