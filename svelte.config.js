import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

// The kb export is src/ only. This is the frame it was exported out of: mdsvex for the .svx
// pages, the runbook layout every page names in its frontmatter, and the #lib alias the pages
// import through. Nothing here changes a page.
// mdsvex resolves a layout against the page that uses it, so the path has to be absolute.
const layout = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook: layout, _: layout } })],
  kit: {
    adapter: adapter({ fallback: null }),
    alias: { '#lib': './src/lib' },
    prerender: { entries: ['*'] }
  }
};
