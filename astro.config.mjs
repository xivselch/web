// @ts-check
import { defineConfig } from "astro/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import solid from "@astrojs/solid-js";
import tailwind from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import auth from "auth-astro";
import db from "@astrojs/db";
import mdx from "@astrojs/mdx";

export default defineConfig({
  adapter: netlify(),
  integrations: [solid({ devtools: true }), auth(), db(), mdx()],
  output: "server",
  redirects: {
    "/chat": "https://discord.gg/x9Y7FbMrRZ",
    "/github": "https://github.com/xivselch",
    "/support": "/chat",
  },
  site: "https://emetselch.xyz",
  vite: {
    plugins: [tailwind()],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "src"),
      },
    },
  },
});
