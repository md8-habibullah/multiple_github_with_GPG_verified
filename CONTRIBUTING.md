# Contributing

Thanks for helping. The most useful contributions are:

- **A step that didn't match your system.** Tell us the OS, and the output of `git --version`, `gh --version` and `gpg --version`.
- **An error message that isn't in [troubleshooting](docs/troubleshooting.md).** Paste the exact text and what fixed it.
- **Unclear wording.** If you had to read something twice, it needs rewriting.

Use the [issue forms](https://github.com/md8-habibullah/multiple-github-accounts-gpg-verified/issues/new/choose), or open a pull request.

## Writing style

- Short sentences, plain words, one idea per line. Readers are often mid-error and in a hurry.
- Every command must be copy-paste ready. Use the same placeholders everywhere: `you-personal`, `you-work`,
  `you@personal.dev`, `you@company.com`, `<KEY_ID>`.
- Never put a real key, email, token or fingerprint in the docs.
- Test a command before adding it, and say on which system you tested it.

## Where things live

| Path | What |
|---|---|
| `README.md` | Front page. The part between `<!-- site:start -->` and `<!-- site:end -->` is also the website's home page |
| `docs/*.md` | One page per step or topic. Each becomes a page on the website |
| `docs/images/` | Images, rendered from `site/*.html` by `npm run images` |
| `site/` | Website styles, script, fonts and the HTML sources for the images |
| `scripts/build-site.mjs` | Builds the website; page URLs, titles and descriptions are in the `DOCS` list at the top |

## Preview the website

```bash
npm ci
npm run build      # fails on broken links or #anchors
npm run preview    # http://127.0.0.1:4790/
```

Adding a new page: create `docs/<name>.md`, add it to `DOCS` in `scripts/build-site.mjs` (slug, title under 60 characters,
description under 160), link it from the README's "All pages" table, then run `npm run build`.

Changing a diagram or the social preview: edit `site/diagrams.html`, `site/chain.html` or `site/og.html`, then run
`npm run images` (needs Chrome or Chromium, and ffmpeg for the demo GIF).
