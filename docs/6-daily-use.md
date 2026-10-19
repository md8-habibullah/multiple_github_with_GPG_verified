[Home](../README.md) · Daily use

# Switch accounts and check Verified commits

## Push to the right account

`git push` uses whichever account is active in gh. Switch first:

```bash
gh auth switch -u you-work       # before pushing work repos
gh auth switch -u you-personal   # before pushing personal repos
gh auth status                   # not sure? check
```

The commit **email** and **signature** don't need switching. They follow the folder ([step 5](5-work-folder.md)).

## Clone

```bash
gh repo clone owner/repo
```

Clone work repos into `~/work/`.

## Is my commit signed?

```bash
git log --show-signature -1
```

Look for `Good signature`:

```text
gpg: Good signature from "Your Name <you@personal.dev>" [ultimate]
gpg:                 aka "Your Name <you@company.com>" [ultimate]
Author: Your Name <you@company.com>
```

gpg always names the key's first email, then the others on `aka` lines. The `Author:` line shows the email this commit really uses.

## Is it Verified on GitHub?

Open `github.com/<owner>/<repo>/commits` after pushing. Signed commits show a **Verified** label.

<details>
<summary>Extra: mark unsigned commits as unverified</summary>

At [github.com/settings/keys](https://github.com/settings/keys), turn on **Flag unsigned commits as unverified**. Then anyone faking commits in your name shows as Unverified.
</details>

---

[Troubleshooting](troubleshooting.md) · [Cheat sheet](cheatsheet.md) · [Home](../README.md)
