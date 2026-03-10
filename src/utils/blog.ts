import type { CollectionEntry } from "astro:content";

// Collection drafts are previewable only in local development.
export const includeDrafts =
  import.meta.env.DEV && import.meta.env.PUBLIC_SHOW_DRAFTS === "true";

export const normalizeTag = (tag: string): string =>
  tag.trim().toLowerCase().replace(/\s+/g, "-");

const stripDatePrefix = (value: string): string =>
  value.replace(/^\d{4}-\d{2}-\d{2}-/, "");

// Allow a stable custom slug while still supporting dated filenames.
export const getPostSlug = (post: CollectionEntry<"blog">): string =>
  post.data.slug ? normalizeTag(post.data.slug) : stripDatePrefix(post.slug);

export const byNewest = (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
