#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import * as YAML from "js-yaml";

const ROOT = process.cwd();
const NOTES_DIR = path.join(ROOT, "src", "content", "notes");
const PERMALINK_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const PERMALINK_LENGTH = 8;

const helpText = `Usage:
  node scripts/new-note.mjs [--input <file>] [--dry-run]

Input:
  JSON note object with these fields:
    title (required)
    summary (required)
    body (required, string or array of strings)
    tags (required, string array or comma-separated string)
    published (optional, YYYY-MM-DD)
    context (optional)
    links (optional, array of { label, href })
    id (optional)
    permalink (optional)

Behavior:
  - Defaults to the current local date for published.
  - Picks the monthly notes file for the published month.
  - Generates a short opaque permalink when one is not provided.
  - Validates uniqueness for id and permalink across all notes files.
  - Normalizes and appends the note entry to the monthly YAML file.

Examples:
  node scripts/new-note.mjs --input note.json
  Get-Content note.json | node scripts/new-note.mjs --dry-run
`;

function parseArgs(argv) {
  const options = {
    inputPath: null,
    dryRun: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--input") {
      index += 1;
      if (index >= argv.length) {
        throw new Error("Missing value for --input.");
      }
      options.inputPath = argv[index];
      continue;
    }

    if (arg.startsWith("--input=")) {
      options.inputPath = arg.slice("--input=".length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthFromDate(value) {
  return value.slice(0, 7);
}

function normalizeWhitespace(value) {
  return String(value)
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function normalizeLine(value) {
  return normalizeWhitespace(value).replace(/\n+/g, " ");
}

function normalizeBodyBlock(value) {
  return String(value).replace(/\r\n/g, "\n").trim();
}

function slugify(value) {
  const normalized = String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "note";
}

function normalizeTag(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function uniqueSlug(base, takenIds) {
  let candidate = base || "note";
  let suffix = 2;

  while (takenIds.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function randomPermalink() {
  const bytes = crypto.randomBytes(PERMALINK_LENGTH);
  let value = "";

  for (let index = 0; index < PERMALINK_LENGTH; index += 1) {
    value += PERMALINK_ALPHABET[bytes[index] % PERMALINK_ALPHABET.length];
  }

  return value;
}

function validatePermalink(value) {
  return /^[a-z0-9]{6,12}$/.test(value);
}

function normalizeBody(body) {
  const items = Array.isArray(body)
    ? body
    : typeof body === "string"
      ? body.split(/\n{2,}/)
      : [];

  const normalized = items
    .map((item) => normalizeBodyBlock(item))
    .filter((item) => item.length > 0);

  if (normalized.length === 0) {
    throw new Error("body must contain at least one paragraph.");
  }

  if (normalized.length > 3) {
    throw new Error("body should stay within 1-3 short paragraphs.");
  }

  return normalized;
}

function normalizeTags(tags) {
  const rawTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags.split(/[,;\n]/)
      : [];

  const normalized = [];
  const seen = new Set();

  for (const tag of rawTags) {
    const value = normalizeTag(tag);
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    normalized.push(value);
  }

  return normalized;
}

function normalizeLinks(links) {
  if (links == null) {
    return [];
  }

  if (!Array.isArray(links)) {
    throw new Error("links must be an array when provided.");
  }

  const normalized = [];
  const seen = new Set();

  for (const link of links) {
    if (!link || typeof link !== "object") {
      throw new Error("each link must be an object with label and href.");
    }

    const label = normalizeWhitespace(link.label ?? "");
    const href = normalizeWhitespace(link.href ?? "");

    if (!label || !href) {
      throw new Error("each link must include a non-empty label and href.");
    }

    const key = `${label}\u0000${href}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push({ label, href });
  }

  if (normalized.length > 2) {
    throw new Error("keep links to two or fewer items.");
  }

  return normalized;
}

function normalizeNoteInput(raw, existingIds, existingPermalinks) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Input must be a JSON object.");
  }

  const title = normalizeLine(raw.title ?? "");
  if (!title) {
    throw new Error("title is required.");
  }

  const summary = normalizeLine(raw.summary ?? "");
  if (!summary) {
    throw new Error("summary is required.");
  }

  const body = normalizeBody(raw.body);
  const tags = normalizeTags(raw.tags);
  const published = normalizeLine(raw.published ?? todayString());

  if (!/^\d{4}-\d{2}-\d{2}$/.test(published)) {
    throw new Error("published must use YYYY-MM-DD format.");
  }

  const context = raw.context == null ? undefined : normalizeLine(raw.context);
  const links = normalizeLinks(raw.links);

  const providedId = raw.id == null ? "" : normalizeLine(raw.id);
  const idBase = providedId ? slugify(providedId) : slugify(title);
  const id = providedId
    ? (() => {
        if (existingIds.has(idBase)) {
          throw new Error(`id already exists: ${idBase}`);
        }
        return idBase;
      })()
    : uniqueSlug(idBase, existingIds);

  const providedPermalink =
    raw.permalink == null ? "" : normalizeLine(raw.permalink).toLowerCase();
  let permalink;

  if (providedPermalink) {
    if (!validatePermalink(providedPermalink)) {
      throw new Error(
        "permalink must be 6-12 lowercase letters or digits when provided.",
      );
    }
    if (existingPermalinks.has(providedPermalink)) {
      throw new Error(`permalink already exists: ${providedPermalink}`);
    }
    permalink = providedPermalink;
  } else {
    do {
      permalink = randomPermalink();
    } while (existingPermalinks.has(permalink));
  }

  return {
    id,
    permalink,
    title,
    summary,
    ...(context ? { context } : {}),
    published,
    tags,
    body,
    ...(links.length ? { links } : {}),
  };
}

async function readInput(options) {
  if (options.inputPath) {
    return fs.readFile(options.inputPath, "utf8");
  }

  if (!process.stdin.isTTY) {
    return new Promise((resolve, reject) => {
      let data = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => {
        data += chunk;
      });
      process.stdin.on("end", () => resolve(data));
      process.stdin.on("error", reject);
    });
  }

  throw new Error("Pass --input <file> or pipe JSON through stdin.");
}

async function loadExistingNotes() {
  const files = await fs.readdir(NOTES_DIR);
  const noteFiles = files.filter((file) => file.endsWith(".yml"));
  const ids = new Set();
  const permalinks = new Set();

  for (const file of noteFiles) {
    const filePath = path.join(NOTES_DIR, file);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = YAML.load(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`Invalid YAML document in ${file}.`);
    }

    if (!Array.isArray(parsed.entries)) {
      throw new Error(`Missing entries array in ${file}.`);
    }

    for (const entry of parsed.entries) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        throw new Error(`Invalid note entry in ${file}.`);
      }

      if (typeof entry.id === "string" && entry.id.trim()) {
        ids.add(entry.id.trim());
      }

      if (typeof entry.permalink === "string" && entry.permalink.trim()) {
        permalinks.add(entry.permalink.trim());
      }
    }
  }

  return { ids, permalinks };
}

function buildEntrySnippet(note) {
  const entry = YAML.dump(note, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
  }).trimEnd();
  const lines = entry.split("\n");

  return lines
    .map((line, index) => (index === 0 ? `  - ${line}` : `    ${line}`))
    .join("\n");
}

async function appendEntry(filePath, month, note) {
  let fileText = "";

  try {
    fileText = await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      fileText = `month: ${JSON.stringify(month)}\nentries:\n`;
    } else {
      throw error;
    }
  }

  const separator = fileText.endsWith("\n\n")
    ? ""
    : fileText.endsWith("\n")
      ? "\n"
      : "\n\n";
  const nextText = `${fileText}${separator}${buildEntrySnippet(note)}\n`;

  await fs.writeFile(filePath, nextText, "utf8");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    process.stdout.write(`${helpText}\n`);
    return;
  }

  const inputText = await readInput(options);
  let input;

  try {
    input = JSON.parse(inputText);
  } catch (error) {
    throw new Error("Input must be valid JSON.");
  }

  const { ids, permalinks } = await loadExistingNotes();
  const note = normalizeNoteInput(input, ids, permalinks);
  const month = monthFromDate(note.published);
  const filePath = path.join(NOTES_DIR, `${month}.yml`);

  if (options.dryRun) {
    process.stdout.write(`${filePath}\n`);
    process.stdout.write(`/notes/${note.permalink}\n`);
    process.stdout.write(
      `\n${YAML.dump(note, { indent: 2, lineWidth: -1, noRefs: true, sortKeys: false }).trimEnd()}\n`,
    );
    return;
  }

  await appendEntry(filePath, month, note);

  process.stdout.write(`Wrote ${path.relative(ROOT, filePath)}\n`);
  process.stdout.write(`Note URL: /notes/${note.permalink}\n`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
