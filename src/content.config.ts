import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const legal = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),
  }),
});

export const collections = { legal };
