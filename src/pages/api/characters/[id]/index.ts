import type { APIRoute } from "astro";
import { db, eq, Characters } from "astro:db";
import { refresh } from "~/lib/character";

export const GET: APIRoute = async ({ params, request }) => {
  if (!params.id) return new Response("Missing character ID", { status: 400 });

  let char = await db.select().from(Characters).where(eq(Characters.id, params.id)).get();

  if (char && char.parsed_at && Date.now() - char.parsed_at.getTime() > 1000 * 60 * 60) {
    refresh(params.id).catch((err) => console.error("Background refresh failed:", err));
  }

  if (!char) {
    char = await refresh(params.id);
    if (!char) {
      return new Response("Not found", { status: 404 });
    }
  }

  const lastModified = char.parsed_at
    ? new Date(char.parsed_at).toUTCString()
    : new Date().toUTCString();

  const ifModifiedSince = request.headers.get("If-Modified-Since");
  if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastModified)) {
    return new Response(null, { status: 304 });
  }

  return Response.json(char, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      "Last-Modified": lastModified,
    },
  });
};
