// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static-first portfolio served on Cloudflare Pages (apex: puichaud.com).
export default defineConfig({
  site: 'https://puichaud.com',
  output: 'static',
  integrations: [sitemap()],
});
