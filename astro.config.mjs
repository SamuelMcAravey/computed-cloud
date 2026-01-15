// @ts-check
import { defineConfig } from "astro/config";
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

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  adapter: cloudflare(),
  imageService: "compile",
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
  ],
  markdown: {
    remarkPlugins: [remarkGfm, remarkDirective, remarkCallouts],
    rehypePlugins: [rehypeImageFigure],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
