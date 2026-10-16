<div align="center">

# Two GitHub Accounts, One Laptop

Personal + work GitHub on the same machine, with every commit showing **Verified**.
About 15 minutes, all by hand, no extra tools.

![GitHub CLI](https://img.shields.io/badge/gh-2.40%2B-181717?logo=github&logoColor=white)
![GnuPG](https://img.shields.io/badge/GnuPG-2.2%2B-0093DD?logo=gnuprivacyguard&logoColor=white)

</div>

---

## Before you start

Have these ready:

- Two GitHub accounts, for example `you-personal` and `you-work`
- One email for each, verified on that account at [github.com/settings/emails](https://github.com/settings/emails)
- `git`, `gh` and `gpg` installed ([install commands](docs/install.md))

---

## Quick setup

**1. Log in to both accounts**

```bash
gh auth login        # personal (browser signed in as personal)
gh auth login        # work     (sign the browser in as work first)
gh auth setup-git
```
More help: [Log in to both accounts](docs/1-login.md)

**2. Make one GPG key with both emails**

```bash
gpg --full-generate-key                              # use your personal email, leave Comment empty
gpg --list-secret-keys --keyid-format=long           # copy the long key ID
gpg --quick-add-uid <KEY_ID> "Your Name <you@company.com>"
```
More help: [Create the GPG key](docs/2-gpg-key.md)

**3. Put the key on both accounts**

```bash
gpg --armor --export <KEY_ID> > key.asc
```
Paste `key.asc` at [github.com/settings/gpg/new](https://github.com/settings/gpg/new) on **each** account.
More help: [Upload the key](docs/3-upload-key.md)

**4. Tell Git to sign everything**

```bash
git config --global user.name  "Your Name"
git config --global user.email "you@personal.dev"
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true
```
More help: [Git settings](docs/4-git-setup.md)

**5. Use the work email in work folders (optional)**

Keep work repos in `~/work/` and Git switches the email for you.
How: [Work folder setup](docs/5-work-folder.md)

---

## Every day

```bash
gh auth switch       # pick the account before pushing to its repos
git commit -m "..."  # signed automatically
git push
```

Check it worked: open the commit on GitHub and look for **Verified**.
More: [Daily use and checking](docs/6-daily-use.md)

---

## Something wrong?

[Troubleshooting](docs/troubleshooting.md) · [All commands on one page](docs/cheatsheet.md) · [How it works (optional reading)](docs/how-it-works.md)

---

<div align="center">

Written by **Habibullah** · [habibullah.dev](https://habibullah.dev) · [github.com/md8-habibullah](https://github.com/md8-habibullah)

</div>
