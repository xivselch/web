import type { APIRoute } from "astro";
import { db, eq, Users } from "astro:db";
import { getSession } from "auth-astro/server";

export const GET: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const user = await db.select().from(Users).where(eq(Users.id, session.user.id)).get();

  if (!user) return new Response("Not found", { status: 404 }); // should not return

  user.api_token = user.api_token ? "" : null;

  return Response.json(user, {
    headers: {
      "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
    },
  });
};
