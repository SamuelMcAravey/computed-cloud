import type { CollectionEntry } from "astro:content";

export interface SiteNoteLink {
  label: string;
  href: string;
}

export interface SiteNote {
  id: string;
  permalink?: string;
  title: string;
  summary: string;
  body: string[];
  tags: string[];
  context?: string;
  published: string;
  links: SiteNoteLink[];
}

const publishedTime = (published: string): number => Date.parse(published);

const normalizeNoteSlug = (value: string): string =>
  value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^notes\/?/i, "");

export const flattenNotes = (entries: CollectionEntry<"notes">[]): SiteNote[] =>
  entries
    .flatMap((entry) => entry.data.entries)
    .sort((a, b) => publishedTime(b.published) - publishedTime(a.published));

export const getNoteAnchor = (note: Pick<SiteNote, "id">): string => note.id;

export const getNoteSlug = (
  note: Pick<SiteNote, "id"> & Partial<Pick<SiteNote, "permalink">>,
): string => {
  const candidate = note.permalink ?? note.id;
  return normalizeNoteSlug(candidate);
};

export const getNoteHref = (note: Pick<SiteNote, "id">): string =>
  `/notes#${getNoteAnchor(note)}`;

export const getNotePermalink = (
  note: Pick<SiteNote, "id"> & Partial<Pick<SiteNote, "permalink">>,
): string => `/notes/${getNoteSlug(note)}`;

export const formatNotePublished = (published: string): string =>
  new Date(`${published}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

export const formatNotePublishedExact = (published: string): string =>
  new Date(`${published}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
