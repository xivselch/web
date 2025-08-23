import type { APIRoute } from "astro";
import { Characters, db, eq, inArray, Users } from "astro:db";
import { getSession } from "auth-astro/server";
import { refresh } from "~/lib/character";

export const GET: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const user = await db.select().from(Users).where(eq(Users.id, session.user.id)).get();
  if (!user) return new Response("User not found", { status: 404 });

  const linkedIds = (user.linked as string[]) || [];
  const characters = await db.select().from(Characters).where(inArray(Characters.id, linkedIds));

  if (!characters || characters.length === 0) {
    return new Response("No characters found", { status: 404 });
  }

  const now = new Date();
  const staleCharacters = characters.filter((char) => {
    const parsedAt = char.parsed_at ? new Date(char.parsed_at) : new Date(0);
    return now.getTime() - parsedAt.getTime() > 24 * 60 * 60 * 1000; // 24 hours
  });

  if (staleCharacters.length > 0) {
    await Promise.all(staleCharacters.map((char) => refresh(char.id)));
  }

  return Response.json(characters, {
    headers: {
      "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
    },
  });
};
