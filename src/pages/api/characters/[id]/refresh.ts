import type { APIRoute } from "astro";
import { refresh } from "~/lib/character";

export const GET: APIRoute = async ({ params }) => {
  if (!params.id) return new Response("Bad request", { status: 400 });

  const char = await refresh(params.id);
  if (!char) return new Response("Not found", { status: 404 });

  return Response.json(char, {
    headers: {
      "Cache-Control": "no-store",
      "Last-Modified": char.parsed_at
        ? new Date(char.parsed_at).toUTCString()
        : new Date().toUTCString(),
    },
  });
};
