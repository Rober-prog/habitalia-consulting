import type { APIRoute } from 'astro';
// No draft URL is offered for indexing. Populate only after editorial approval.
export const GET: APIRoute = () =>
  new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
