// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  imageService: "compile",
  integrations: [react(), robotsTxt()],
  vite: {
    plugins: [tailwindcss()]
  }
});
