// Job data types and utilities

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

// Mock jobs data - In a real application, this would fetch from an API
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
 * Fetch all jobs (SSR-friendly)
 * In a real application, this would make an API call
 */
export async function getAllJobs(): Promise<Job[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [...mockJobs];
}

/**
 * Fetch a single job by ID (SSR-friendly)
 * In a real application, this would make an API call
 */
export async function getJobById(id: string): Promise<Job | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockJobs.find((job) => job.id === id) || null;
}

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
