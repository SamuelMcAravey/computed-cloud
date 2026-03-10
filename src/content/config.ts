import { defineCollection, z } from "astro:content";

// Only files under src/content/blog are part of the published content graph.
// Rougher drafts can live in src/content_inprogress without being built.
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
  }),
});

const noteLink = z.object({
  label: z.string(),
  href: z.string(),
});

const noteEntry = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  body: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  context: z.string().optional(),
  published: z.string(),
  links: z.array(noteLink).default([]),
});

const notes = defineCollection({
  type: "data",
  schema: z.object({
    month: z.string(),
    entries: z.array(noteEntry),
  }),
});

export const collections = { blog, notes };
