---
title: "Why Content Collections"
description: "Typed frontmatter makes content safer, clearer, and easier to scale."
pubDate: 2026-01-05
tags: ["Astro", "Content", "TypeScript"]
---

Astro Content Collections help enforce structure without getting in the way.

## Benefits

1. Frontmatter stays consistent.
2. Your editor can autocomplete fields.
3. You can validate dates, tags, and metadata early.

## A quick example

```ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
  }),
});
```

That is enough to keep your content sane.
