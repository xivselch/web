import type { Session } from "@auth/core/types";
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";

export const GET: APIRoute = async ({ request }) => {
  const session: (Session & { accessToken?: string }) | null = await getSession(request);

  if (!session?.user?.id || !session.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const res = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      return new Response("Failed to fetch user from Discord", { status: 500 });
    }
    const { email, ...safeUser } = await res.json();

    safeUser.avatar =
      `https://cdn.discordapp.com/avatars/${safeUser.id}/${safeUser.avatar}.${
        safeUser.avatar?.startsWith("a_") ? "gif" : "png"
      }` || null;
    safeUser.banner =
      `https://cdn.discordapp.com/banners/${safeUser.id}/${safeUser.banner}.${
        safeUser.banner?.startsWith("a_") ? "gif" : "png"
      }` || null;
    safeUser.avatar_decoration_data.asset = `https://cdn.discordapp.com/avatar-decoration-presets/${safeUser.avatar_decoration_data.asset}.png`;

    return Response.json(safeUser);
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
