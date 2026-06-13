// @ts-check
import { defineConfig } from 'astro/config';

// Static-first portfolio served on Cloudflare Pages (apex: puichaud.com).
export default defineConfig({
  site: 'https://puichaud.com',
  output: 'static',
});
