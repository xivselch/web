import { defineCollection, z } from "astro:content";

const legal = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),
  }),
});

const tools = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { legal, tools };
