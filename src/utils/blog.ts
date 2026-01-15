import type { CollectionEntry } from "astro:content";

export const includeDrafts = import.meta.env.DEV;

export const normalizeTag = (tag: string): string =>
  tag.trim().toLowerCase().replace(/\s+/g, "-");

export const getPostSlug = (post: CollectionEntry<"blog">): string =>
  post.data.slug ? normalizeTag(post.data.slug) : post.slug;

export const byNewest = (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
