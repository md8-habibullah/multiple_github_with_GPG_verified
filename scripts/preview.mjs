// Serves the built site at http://127.0.0.1:4790/ the way GitHub Pages does (folder/index.html, 404.html).
// Usage: npm run build && npm run preview
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const dir = resolve(import.meta.dirname, '..', '.site');
const port = Number(process.env.PORT) || 4790;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.gif': 'image/gif', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

if (!existsSync(dir)) {
  console.error('No .site/ folder. Run npm run build first.');
  process.exit(1);
}
createServer((req, res) => {
  let file = join(dir, normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, ''));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  const found = existsSync(file);
  res.writeHead(found ? 200 : 404, { 'content-type': types[extname(found ? file : '.html')] ?? 'application/octet-stream' });
  res.end(readFileSync(found ? file : join(dir, '404.html')));
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}/`));
