import type { APIRoute } from "astro";
import { db, eq, Users } from "astro:db";
import { getSession } from "auth-astro/server";
import { generateToken, hashToken } from "~/lib/server";

export const GET: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);

  await db
    .update(Users)
    .set({
      api_token: hashedToken,
      updated_at: new Date(),
    })
    .where(eq(Users.id, session.user.id));

  return new Response(rawToken, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
};

export const DELETE: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  await db
    .update(Users)
    .set({
      api_token: null,
      updated_at: new Date(),
    })
    .where(eq(Users.id, session.user.id));

  return new Response("Token revoked", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
};
