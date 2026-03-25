// @ts-check
import { defineConfig } from "astro/config";
import { execSync } from "node:child_process";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import mermaid from "astro-mermaid";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { remarkCallouts } from "./src/utils/remark-callouts.js";
import { rehypeImageFigure } from "./src/utils/rehype-figure.js";
import pagefind from "astro-pagefind";

// Content-first blog defaults:
// - missing images fall back to a visible placeholder instead of silently vanishing
// - Markdown supports callouts, Mermaid, and figure wrapping for article content
const USE_MISSING_IMAGE_PLACEHOLDER = true;
const MISSING_IMAGE_PLACEHOLDER_SRC = "/assets/image-missing.svg";

const buildSha = (() => {
  const candidate =
    process.env.WORKERS_CI_COMMIT_SHA ??
    process.env.CF_PAGES_COMMIT_SHA ??
    process.env.GITHUB_SHA;

  if (candidate) {
    return candidate.trim();
  }

  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
})();

// https://astro.build/config
export default defineConfig({
  site: "https://computedcloud.com",
  adapter: cloudflare(),
  imageService: "compile",
  image: {
    service: {
      entrypoint: "astro/assets/services/compile",
    },
  },
  vite: {
    define: {
      "import.meta.env.PUBLIC_BUILD_SHA": JSON.stringify(buildSha),
    },
    plugins: [tailwindcss()],
  },
  integrations: [
    robotsTxt(),
    sitemap(),
    expressiveCode({
      themes: ["github-dark"],
      frames: {
        showCopyToClipboardButton: true,
      },
      defaultProps: {
        frame: "terminal",
      },
    }),
    mermaid({
      theme: "neutral",
      autoTheme: true,
    }),
    pagefind(),
  ],
  markdown: {
    remarkPlugins: [remarkGfm, remarkDirective, remarkCallouts],
    rehypePlugins: [
      [
        rehypeImageFigure,
        {
          missingImage: USE_MISSING_IMAGE_PLACEHOLDER ? "placeholder" : "remove",
          placeholderSrc: MISSING_IMAGE_PLACEHOLDER_SRC,
        },
      ],
    ],
  },
});
