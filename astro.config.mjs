// @ts-check
import { defineConfig } from "astro/config";

import solid from "@astrojs/solid-js";
import tailwind from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import auth from "auth-astro";
import db from "@astrojs/db";

export default defineConfig({
  adapter: netlify(),
  integrations: [solid({ devtools: true }), auth(), db()],
  output: "server",
  redirects: {
    "/chat": "https://discord.gg/x9Y7FbMrRZ",
    "/github": "https://github.com/xivselch",
    "/support": "/chat",
  },
  site: "https://emetselch.xyz",
  vite: { plugins: [tailwind()] },
});
