import Discord from "@auth/core/providers/discord";
import { defineConfig } from "auth-astro";

export default defineConfig({
  providers: [
    Discord({
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
      clientId: import.meta.env.DISCORD_CLIENT_ID,
      clientSecret: import.meta.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ account, token }) {
      if (account) {
        token.id = account.providerAccountId;
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  trustHost: true,
});
