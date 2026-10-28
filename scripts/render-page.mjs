// Takes one prerendered kb page out of build/ and writes it as a single file the desk can open
// with no server: stylesheets inlined, hydration scripts dropped. The page itself is untouched.
//
//   node scripts/render-page.mjs kb/incidents/4471-split rendered/4471-split.html
import fs from 'node:fs';
import path from 'node:path';

const [route, out] = process.argv.slice(2);
if (!route || !out) {
  console.error('usage: node scripts/render-page.mjs <route> <out.html>');
  process.exit(1);
}

const BUILD = 'build';
const src = path.join(BUILD, `${route}.html`);
let html = fs.readFileSync(src, 'utf8');

const sheets = [...html.matchAll(/<link href="([^"]+\.css)"[^>]*rel="stylesheet"[^>]*>/g)];
for (const [tag, href] of sheets) {
  // hrefs are relative to the page, or absolute from the site root.
  const file = href.startsWith('/')
    ? path.join(BUILD, href.slice(1))
    : path.resolve(path.dirname(src), href);
  const css = fs.readFileSync(file, 'utf8');
  html = html.replace(tag, `<style>\n${css}\n</style>`);
}

// The page is read, not used: drop the module preloads and the hydration call.
html = html
  .replace(/<link rel="modulepreload"[^>]*>/g, '')
  .replace(/<script>[\s\S]*?<\/script>/g, '')
  .replace(/\n{3,}/g, '\n\n');

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`${src} -> ${out}  (${sheets.length} stylesheets inlined, ${html.length} bytes)`);
