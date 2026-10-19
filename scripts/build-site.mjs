// Builds the GitHub Pages site into .site/ from README.md and docs/*.md, so the guide has one source.
// Every page gets its own URL, title, description, Open Graph tags and JSON-LD; the build also writes
// sitemap.xml, robots.txt, llms.txt and 404.html, and fails on any broken internal link or anchor.
// Usage: npm run build
import { Marked, Renderer } from 'marked';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, '.site');
const REPO = 'md8-habibullah/multiple-github-accounts-gpg-verified';
const SITE_URL = 'https://multi-github.habibullah.dev/';
const REPO_URL = `https://github.com/${REPO}`;
const SITE_NAME = 'One Key, Two Accounts';
const AUTHOR = { '@type': 'Person', name: 'MD. Habibullah Sharif', url: 'https://habibullah.dev', sameAs: ['https://github.com/md8-habibullah', 'https://dev.to/md8_habibullah'] };
const PUBLISHED = '2026-10-16';
const today = new Date().toISOString().slice(0, 10);

// Page order is the reading order. `group` builds the sidebar; `n` is the step number when the page is a step.
const DOCS = [
  { file: 'install', slug: 'install', group: 'Setup', label: 'Install', title: 'Install Git, GitHub CLI and GnuPG on Linux, macOS, Windows', description: 'Install git, the GitHub CLI (gh 2.40+) and GnuPG on Arch, Ubuntu, Fedora, macOS and Windows, ready to use two GitHub accounts with signed commits.' },
  { file: '1-login', slug: 'login-multiple-github-accounts', group: 'Setup', n: 1, label: 'Log in to both accounts', title: 'Log In to Two GitHub Accounts with gh auth login', description: 'Log in to a personal and a work GitHub account on the same machine with gh auth login, then switch between them with gh auth switch.' },
  { file: '2-gpg-key', slug: 'create-gpg-key', group: 'Setup', n: 2, label: 'Create the GPG key', title: 'Create One GPG Key with Two Emails for GitHub', description: 'Create a GPG key with gpg --full-generate-key and add your work email with --quick-add-uid, so one key signs commits for both GitHub accounts.' },
  { file: '3-upload-key', slug: 'add-gpg-key-to-github', group: 'Setup', n: 3, label: 'Add the key to GitHub', title: 'Add a GPG Key to GitHub on Both Accounts', description: 'Export your public GPG key and add it to both GitHub accounts, in the browser or with gh gpg-key add, so GitHub can mark your commits Verified.' },
  { file: '4-git-setup', slug: 'sign-git-commits', group: 'Setup', n: 4, label: 'Sign every commit', title: 'Sign Every Git Commit with GPG (commit.gpgsign)', description: 'Configure user.signingkey, commit.gpgsign and tag.gpgsign, set GPG_TTY for bash, zsh or fish, and test GPG commit signing in one minute.' },
  { file: '5-work-folder', slug: 'git-work-email-includeif', group: 'Setup', n: 5, label: 'Work email by folder', title: 'Use a Work Email per Folder with Git includeIf', description: 'Make Git use your work email automatically for every repo inside ~/work/ with includeIf gitdir, and your personal email everywhere else.' },
  { file: '6-daily-use', slug: 'switch-github-accounts', group: 'Setup', label: 'Daily use', title: 'Switch GitHub Accounts and Check Verified Commits', description: 'Push to the right GitHub account with gh auth switch, then confirm the signature with git log --show-signature and the Verified badge.' },
  { file: 'troubleshooting', slug: 'troubleshooting', group: 'Reference', label: 'Troubleshooting', title: 'Fix "gpg failed to sign the data" and Unverified Commits', description: 'Fixes for gpg failed to sign the data, Inappropriate ioctl for device, No secret key, No pinentry, Unverified commits and 403 errors on push.' },
  { file: 'faq', slug: 'faq', group: 'Reference', label: 'FAQ', title: 'FAQ: Multiple GitHub Accounts, SSH vs HTTPS, GPG Signing', description: 'Answers on using two GitHub accounts on one computer: SSH vs HTTPS, one GPG key on two accounts, SSH signing, VS Code, Windows and more.' },
  { file: 'cheatsheet', slug: 'cheatsheet', group: 'Reference', label: 'Cheat sheet', title: 'Cheat Sheet: gh auth, GPG and Git Signing Commands', description: 'Every command for multiple GitHub accounts on one page: gh auth login and switch, GPG key creation and export, Git signing and backup.' },
  { file: 'backup', slug: 'backup-gpg-key', group: 'Reference', label: 'Back up your key', title: 'Back Up, Restore, Renew and Revoke a GPG Key', description: 'Back up your GPG private key, restore it on a new laptop, extend its expiry with --quick-set-expire, and revoke it if the laptop is lost.' },
  { file: 'how-it-works', slug: 'how-it-works', group: 'Reference', label: 'How it works', title: 'How Verified Commits and Multiple Accounts Work', description: 'Diagrams of when GitHub shows Verified, how Git picks the commit email per folder, and how the gh device login flow works.' },
];
const HOME = {
  slug: '', title: 'Multiple GitHub Accounts on One Machine, Verified Commits',
  description: 'Use a personal and a work GitHub account on one computer: switch with gh auth switch, sign with one GPG key, pick the email by folder, Verified on every commit.',
};
const bySource = new Map(DOCS.map((d) => [`docs/${d.file}.md`, d]));
bySource.set('README.md', HOME);

// ---------- helpers ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const stripTags = (s) => decode(s.replace(/<[^>]+>/g, ''));
// GitHub-compatible heading ids, so #anchors work the same on github.com and on the site.
const ghSlug = (text) => text.toLowerCase().trim().replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '').replace(/ /g, '-');
const pageUrl = (page) => SITE_URL + (page.slug ? `${page.slug}/` : '');

// Identity colouring inside code: personal = cobalt, work = ochre, placeholders underlined.
function colourIdentities(html) {
  return html
    .replace(/you@personal\.dev|you-personal/g, '<span class="p">$&</span>')
    .replace(/you@company\.com|you-work/g, '<span class="w">$&</span>')
    .replace(/&lt;(?:WORK_)?KEY_ID&gt;/g, '<span class="ph">$&</span>');
}
function highlight(code, lang) {
  let html = esc(code);
  if (lang === 'bash' || lang === 'ini') {
    html = html.split('\n').map((line) => line.replace(/(^|\s)(#(?:\s.*)?)$/, (_, s, c) => `${s}<span class="c">${c}</span>`)).join('\n');
  }
  return colourIdentities(html);
}

// ---------- markdown -> html with link rewriting ----------
const links = []; // { from, href } for validation
function makeRenderer(source, base) {
  const ids = new Map();
  const renderer = new Renderer();
  const rewrite = (href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    const [path, hash] = href.split('#');
    const resolved = source.startsWith('docs/') && !path.startsWith('../') && path ? `docs/${path}` : path.replace(/^\.\.\//, '');
    if (resolved.startsWith('docs/images/') || resolved.startsWith('images/')) return base + 'images/' + resolved.split('images/')[1];
    const target = bySource.get(resolved);
    if (target) {
      links.push({ from: source, target, hash });
      return base + (target.slug ? `${target.slug}/` : '') + (hash ? `#${hash}` : '');
    }
    if (existsSync(resolve(root, resolved))) return `${REPO_URL}/blob/main/${resolved}${hash ? `#${hash}` : ''}`;
    throw new Error(`${source}: link to missing file ${href}`);
  };
  renderer.heading = function ({ tokens, depth }) {
    const inner = this.parser.parseInline(tokens);
    let id = ghSlug(stripTags(inner));
    const seen = ids.get(id) ?? 0;
    ids.set(id, seen + 1);
    if (seen) id = `${id}-${seen}`;
    if (depth === 1) return `<h1 id="${id}">${inner}</h1>\n`;
    return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-label="Link to this section">#</a>${inner}</h${depth}>\n`;
  };
  renderer.code = ({ text, lang }) =>
    `<div class="code"><pre><code${lang ? ` class="language-${esc(lang)}"` : ''}>${highlight(text, lang)}</code></pre><button class="copy" type="button">Copy</button></div>\n`;
  renderer.codespan = ({ text }) => `<code>${colourIdentities(esc(text))}</code>`;
  renderer.table = function (token) {
    return `<div class="table">${Renderer.prototype.table.call(this, token)}</div>\n`;
  };
  renderer.link = function (token) {
    return Renderer.prototype.link.call(this, { ...token, href: rewrite(token.href) });
  };
  renderer.image = function (token) {
    return Renderer.prototype.image.call(this, { ...token, href: rewrite(token.href) }).replace('<img ', '<img loading="lazy" ');
  };
  renderer.html = ({ text }) =>
    text.replace(/(src|srcset)="([^"]+)"/g, (_, attr, url) => `${attr}="${rewrite(url)}"`).replace(/<img (?![^>]*loading=)/g, '<img loading="lazy" ');
  return { renderer, ids };
}
const ANCHORS = new Map(); // page -> Set(ids)
function render(source, md, page, base) {
  const { renderer, ids } = makeRenderer(source, base);
  const html = new Marked({ gfm: true, renderer }).parse(md);
  ANCHORS.set(page, new Set([...(ANCHORS.get(page) ?? []), ...ids.keys()]));
  return html;
}

// Splits a docs page into its step label, body and drops the trailing prev/next line (the site has its own).
function splitDoc(md) {
  const lines = md.split('\n');
  let step = '';
  if (lines[0].startsWith('[Home]')) {
    step = lines.shift().split('·').slice(1).join('·').trim();
    while (lines[0] === '') lines.shift();
  }
  const navLine = /^(\[[^\]]+\]\([^)]+\)( · )?)+$|^(Previous|Next):/;
  while (lines.length && (lines.at(-1) === '' || navLine.test(lines.at(-1)))) lines.pop();
  if (lines.at(-1) === '---') lines.pop();
  return { step, body: lines.join('\n') };
}

// ---------- page chrome ----------
function sidebar(current, base) {
  const groups = Map.groupBy(DOCS, (d) => d.group);
  let html = `<details class="pages" open><summary>All pages</summary>`;
  html += `<h2>Start</h2><ol><li><a href="${base}"${current === HOME ? ' aria-current="page"' : ''}><span class="n"></span>Quick setup</a></li></ol>`;
  for (const [group, pages] of groups) {
    html += `<h2>${group}</h2><ol>`;
    for (const d of pages) html += `<li><a href="${base}${d.slug}/"${d === current ? ' aria-current="page"' : ''}><span class="n">${d.n ?? ''}</span>${esc(d.label)}</a></li>`;
    html += '</ol>';
  }
  return `<aside class="side" aria-label="Guide pages">${html}</details></aside>`;
}

function layout({ page, base, body, jsonld, hero = '' }) {
  const url = pageUrl(page);
  const image = `${SITE_URL}images/social-preview.png`;
  const isHome = page === HOME;
  const nav = [
    ['Guide', base, isHome],
    ['Troubleshooting', `${base}troubleshooting/`, page.slug === 'troubleshooting'],
    ['FAQ', `${base}faq/`, page.slug === 'faq'],
    ['Cheat sheet', `${base}cheatsheet/`, page.slug === 'cheatsheet', 'hide-sm'],
  ];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="MD. Habibullah Sharif">
<meta name="theme-color" content="#f4f6f9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d1422" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${base}icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}icon-180.png">
<link rel="preload" href="${base}fonts/schibsted-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${base}style.css">
<meta property="og:type" content="${isHome ? 'website' : 'article'}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="640">
<meta property="og:image:alt" content="Two GitHub accounts, personal and work, share one GPG key and every commit shows Verified">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${image}">
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#content">Skip to content</a>
<header class="top"><div class="top-in">
  <a class="brand" href="${base}"><img src="${base}icon.svg" width="30" height="30" alt=""><span>${SITE_NAME}</span></a>
  <nav aria-label="Main">${nav.map(([label, href, cur, cls]) => `<a href="${href}"${cur ? ' aria-current="page"' : ''}${cls ? ` class="${cls}"` : ''}>${label}</a>`).join('')}<a class="star" href="${REPO_URL}">GitHub</a></nav>
</div></header>
${hero}
<div class="shell">
${sidebar(page, base)}
<main id="content">
${body}
</main>
</div>
<footer><div class="foot">
  <span>Written by <a href="https://habibullah.dev">MD. Habibullah Sharif</a>. MIT licensed. Not affiliated with GitHub.</span>
  <span><a href="${REPO_URL}">Source on GitHub</a> · <a href="${REPO_URL}/issues/new/choose">Report a problem</a> · <a href="https://dev.to/md8_habibullah">dev.to</a></span>
</div></footer>
<script src="${base}app.js" defer></script>
</body>
</html>
`;
}

const article = (page, extra = {}) => ({
  '@context': 'https://schema.org', '@type': 'TechArticle',
  headline: page.title, description: page.description, url: pageUrl(page), mainEntityOfPage: pageUrl(page),
  image: `${SITE_URL}images/social-preview.png`, inLanguage: 'en', author: AUTHOR, publisher: AUTHOR,
  datePublished: PUBLISHED, dateModified: today, isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  proficiencyLevel: 'Beginner', ...extra,
});
const breadcrumbs = (page) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Guide', item: SITE_URL },
    ...(page === HOME ? [] : [{ '@type': 'ListItem', position: 2, name: page.label, item: pageUrl(page) }]),
  ],
});

// FAQ entries straight from docs/faq.md: every "### question" and the paragraphs under it.
function faqEntries() {
  const md = splitDoc(readFileSync(resolve(root, 'docs/faq.md'), 'utf8')).body;
  return md.split(/^### /m).slice(1).map((chunk) => {
    const [q, ...rest] = chunk.split('\n');
    return { q: q.trim(), md: rest.join('\n').trim() };
  });
}
const plain = (md) => stripTags(new Marked().parseInline(md.replace(/\n+/g, ' '))).replace(/\s+/g, ' ').trim();
const faqJsonLd = (entries) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: entries.map((e) => ({ '@type': 'Question', name: e.q, acceptedAnswer: { '@type': 'Answer', text: plain(e.md) } })),
});

// ---------- build ----------
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of ['style.css', 'app.js', 'icon.svg']) cpSync(resolve(root, 'site', f), resolve(out, f));
cpSync(resolve(root, 'site/fonts'), resolve(out, 'fonts'), { recursive: true });
cpSync(resolve(root, 'docs/images'), resolve(out, 'images'), { recursive: true });
if (existsSync(resolve(root, 'docs/images/icon-180.png'))) cpSync(resolve(root, 'docs/images/icon-180.png'), resolve(out, 'icon-180.png'));

// Home: hero + the README section between the site markers + FAQ.
{
  const readme = readFileSync(resolve(root, 'README.md'), 'utf8');
  const section = readme.split('<!-- site:start -->')[1]?.split('<!-- site:end -->')[0];
  if (!section) throw new Error('README.md: site markers missing');
  const quick = section.split(/^## Quick setup$/m)[1].split(/^## /m)[0];
  const steps = quick.split(/^### /m).slice(1).map((chunk) => {
    const [heading, ...rest] = chunk.split('\n');
    const name = heading.replace(/^\d+\.\s*/, '').trim();
    const text = plain(rest.join('\n').replace(/```[\s\S]*?```/g, '').replace(/^Full (walkthrough|guide).*$/gm, ''));
    return { '@type': 'HowToStep', name, text, url: `${SITE_URL}#${ghSlug(heading)}` };
  });
  const entries = faqEntries();
  const faqHtml = entries.map((e) => `<details><summary>${esc(e.q)}</summary>${render('docs/faq.md', e.md, HOME, '')}</details>`).join('\n');
  const body = `<article class="prose">${render('README.md', section, HOME, '')}
<section class="home-faq" aria-labelledby="questions"><h2 id="questions"><a class="anchor" href="#questions" aria-label="Link to this section">#</a>Questions</h2>
${faqHtml}
<p><a href="faq/">All questions and answers</a> · <a href="troubleshooting/">Fix an error message</a></p></section></article>`;
  const hero = `<section class="hero"><div class="hero-in">
  <div>
    <h1>Two GitHub accounts on one machine. <span>Every commit Verified.</span></h1>
    <p class="lede">Keep your personal and work GitHub on the same laptop. Switch with one command, sign every commit with one GPG key, and let each folder pick the right email. No SSH aliases, no extra tools.</p>
    <div class="cta"><a class="btn primary" href="#quick-setup">Start the 15-minute setup</a><a class="btn" href="troubleshooting/">Fix an error</a></div>
    <ul class="facts"><li><b>gh</b> 2.40+</li><li><b>GnuPG</b> 2.2+</li><li><b>Git</b> 2.37+</li><li>Linux, macOS and Windows</li></ul>
  </div>
  ${readFileSync(resolve(root, 'site/chain.html'), 'utf8')}
</div></section>`;
  const howto = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'Use two GitHub accounts on one machine with Verified commits',
    description: HOME.description, totalTime: 'PT15M', image: `${SITE_URL}images/social-preview.png`,
    tool: [{ '@type': 'HowToTool', name: 'Git 2.37+' }, { '@type': 'HowToTool', name: 'GitHub CLI (gh) 2.40+' }, { '@type': 'HowToTool', name: 'GnuPG 2.2+' }],
    supply: [{ '@type': 'HowToSupply', name: 'Two GitHub accounts, each with a verified email' }],
    step: steps,
  };
  const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, alternateName: 'Multiple GitHub accounts with GPG verified commits', url: SITE_URL, inLanguage: 'en', author: AUTHOR };
  writeFileSync(resolve(out, 'index.html'), layout({ page: HOME, base: '', body, hero, jsonld: [website, article(HOME), howto, faqJsonLd(entries), breadcrumbs(HOME)] }));
}

// Docs pages
DOCS.forEach((page, i) => {
  const source = `docs/${page.file}.md`;
  const { step, body: md } = splitDoc(readFileSync(resolve(root, source), 'utf8'));
  const html = render(source, md, page, '../');
  const prev = DOCS[i - 1], next = DOCS[i + 1];
  const stepBadge = page.n ? `<span class="step">${esc(step)}</span>` : '';
  const body = `<article class="prose">
<p class="crumbs"><a href="../">Guide</a> / ${esc(page.label)}${stepBadge}</p>
${html}
</article>
<nav class="pager" aria-label="Previous and next page">${prev ? `<a class="prev" href="../${prev.slug}/"><small>Previous</small>${esc(prev.label)}</a>` : `<a class="prev" href="../"><small>Previous</small>Quick setup</a>`}${next ? `<a class="next" href="../${next.slug}/"><small>Next</small>${esc(next.label)}</a>` : ''}</nav>
<p class="edit"><a href="${REPO_URL}/blob/main/${source}">Edit this page on GitHub</a></p>`;
  const jsonld = [article(page), breadcrumbs(page)];
  if (page.slug === 'faq') jsonld.push(faqJsonLd(faqEntries()));
  mkdirSync(resolve(out, page.slug), { recursive: true });
  writeFileSync(resolve(out, page.slug, 'index.html'), layout({ page, base: '../', body, jsonld }));
});

// Fail the build on any internal link to a missing anchor.
const broken = links.filter(({ target, hash }) => hash && !ANCHORS.get(target)?.has(hash));
if (broken.length) {
  for (const b of broken) console.error(`Broken anchor: ${b.from} -> ${b.target.slug || 'home'}#${b.hash}`);
  process.exit(1);
}

// 404 page (served at any path, so links are absolute)
writeFileSync(resolve(out, '404.html'), layout({
  page: { ...HOME, title: 'Page not found', description: HOME.description },
  base: SITE_URL, jsonld: [],
  body: `<article class="prose"><h1>Page not found</h1><p>This page moved or never existed. Start from the <a href="${SITE_URL}">quick setup</a>, or <a href="${SITE_URL}troubleshooting/">find your error message</a>.</p></article>`,
}).replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">'));

const all = [HOME, ...DOCS];
writeFileSync(resolve(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((p) => `  <url><loc>${pageUrl(p)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(resolve(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);
writeFileSync(resolve(out, 'llms.txt'), `# ${SITE_NAME}: multiple GitHub accounts on one machine with Verified commits

> A step-by-step guide to using a personal and a work GitHub account on the same computer. The GitHub CLI (gh 2.40+) holds both logins and \`gh auth switch\` picks who pushes; one GPG key holds both emails so every commit is signed and shows Verified on both accounts; Git's includeIf picks the work email for repos inside ~/work/. No SSH host aliases. Linux, macOS and Windows.

Author: MD. Habibullah Sharif (https://habibullah.dev). Source: ${REPO_URL}

## Pages

${all.map((p) => `- [${p.title}](${pageUrl(p)}): ${p.description}`).join('\n')}
`);
writeFileSync(resolve(out, '.nojekyll'), '');
console.log(`Site built in ${out}: ${all.length} pages, ${links.length} internal links checked`);
