import type { Route } from "./+types/$";

// Catch-all route for unmatched paths
// This handles requests like /.well-known/appspecific/com.chrome.devtools.json
// (Chrome DevTools automatic requests) and other unknown routes
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Handle Chrome DevTools and other well-known paths silently
  if (url.pathname.startsWith("/.well-known/")) {
    return new Response(null, { status: 404 });
  }

  // For other unmatched routes, return 404
  throw new Response("Not Found", { status: 404 });
}

export default function CatchAll() {
  return null;
}
