// Renders every image in docs/images from the HTML sources in site/, so the pictures always match the site style:
//   social-preview.png         site/og.html (GitHub social preview and og:image, 1280x640)
//   overview(-dark).png        site/chain.html (README "What you end up with")
//   diagram-*(-dark).png       site/diagrams.html (docs/how-it-works.md)
//   demo.gif                   site/demo.html (README terminal demo; needs ffmpeg)
//   icon-180.png               site/icon.svg (apple-touch-icon)
// Usage: npm run images   (uses a local Chrome/Chromium; set CHROME_PATH if it isn't found)
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const site = resolve(root, 'site');
const images = resolve(root, 'docs/images');
const executablePath = process.env.CHROME_PATH || ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
if (!executablePath) throw new Error('No Chrome found. Set CHROME_PATH.');

// The pages fetch chain.html, which needs http rather than file://.
const types = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  const file = join(site, new URL(req.url, 'http://x').pathname.replace(/\.\./g, ''));
  if (!existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
}).listen(0, '127.0.0.1');
await new Promise((r) => server.once('listening', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
async function open(file, { width = 1000, height = 800, scale = 2, scheme = 'light' } = {}) {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width, height, deviceScaleFactor: scale });
  await page.goto(base + file, { waitUntil: 'networkidle0' });
  await page.waitForSelector('body[data-ready]', { timeout: 10000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
}
const shot = async (selector, name) => {
  await (await page.$(selector)).screenshot({ path: resolve(images, name), omitBackground: false });
  console.log('docs/images/' + name);
};

// Social preview
await open('og.html', { width: 1280, height: 640, scale: 1 });
await page.screenshot({ path: resolve(images, 'social-preview.png') });
console.log('docs/images/social-preview.png');

// Overview and diagrams, light and dark
for (const scheme of ['light', 'dark']) {
  const suffix = scheme === 'dark' ? '-dark' : '';
  await open('diagrams.html', { scheme });
  await shot('#overview', `overview${suffix}.png`);
  for (const id of ['verified', 'email', 'login']) await shot(`#diagram-${id}`, `diagram-${id}${suffix}.png`);
}

// Apple touch icon
await page.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 });
await page.setContent(`<body style="margin:0">${readFileSync(resolve(site, 'icon.svg'), 'utf8').replace('<svg ', '<svg width="180" height="180" ')}</body>`);
await page.screenshot({ path: resolve(images, 'icon-180.png'), clip: { x: 0, y: 0, width: 180, height: 180 }, omitBackground: true });
console.log('docs/images/icon-180.png');

// Terminal demo GIF: one PNG per state, then ffmpeg with a shared palette and per-frame durations.
const work = mkdtempSync(join(tmpdir(), 'demo-'));
await open('demo.html', { width: 880, height: 500, scale: 1, scheme: 'dark' });
const count = await page.evaluate(() => window.frames);
let list = '';
for (let i = 0; i < count; i++) {
  const ms = await page.evaluate((n) => window.render(n), i);
  const file = join(work, `f${String(i).padStart(4, '0')}.png`);
  await (await page.$('#term')).screenshot({ path: file });
  list += `file '${file}'\nduration ${(ms / 1000).toFixed(3)}\n`;
}
list += `file '${join(work, `f${String(count - 1).padStart(4, '0')}.png`)}'\n`;
writeFileSync(join(work, 'list.txt'), list);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(work, 'list.txt'),
  '-vf', 'split[a][b];[a]palettegen=max_colors=48:stats_mode=full[p];[b][p]paletteuse=dither=none',
  '-fps_mode', 'vfr', '-loop', '0', resolve(images, 'demo.gif')]);
rmSync(work, { recursive: true, force: true });
console.log(`docs/images/demo.gif (${count} frames)`);

await browser.close();
server.close();
