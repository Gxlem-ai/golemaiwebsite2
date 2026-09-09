import GolemLanding from "@/components/GolemLanding";

/**
 * Server component wrapper. Rendering the client landing component here,
 * rather than re-exporting it as the page, keeps the route's `searchParams`
 * proxy out of client props so the page can be prerendered as static HTML.
 */
export default function Page() {
  return <GolemLanding />;
}
