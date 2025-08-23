import type { APIRoute } from "astro";
import { Lodestone } from "nodecollect";

const parser = new Lodestone();

export const GET: APIRoute = async ({ url }) => {
  const params = Object.fromEntries(url.searchParams) as Lodestone.SearchParams;

  if (!params || !params.q) {
    return Response.json(
      {
        error: "Bad Request",
        message: "Missing required query parameter `q`.",
        params,
      },
      { status: 400 }
    );
  }

  try {
    const results = await parser.getCharacter(params);

    return Response.json(results, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
