import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("jobs/:id", "routes/jobs.$id.tsx"),
  route("jobs/:id/apply", "routes/jobs.apply.$id.tsx"),
  route("health", "routes/health.tsx"),
  route("*", "routes/$.tsx"), // Catch-all route for unmatched paths
] satisfies RouteConfig;
