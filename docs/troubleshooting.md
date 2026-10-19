[Home](../README.md) · Troubleshooting

# Troubleshooting GPG signing and multiple GitHub accounts

Find your error message below. Each fix takes a minute or less.

| You see | Jump to |
|---|---|
| `error: gpg failed to sign the data` | [gpg failed to sign the data](#error-gpg-failed-to-sign-the-data) |
| `Inappropriate ioctl for device` | [Inappropriate ioctl for device](#gpg-signing-failed-inappropriate-ioctl-for-device) |
| `No secret key` | [No secret key](#gpg-signing-failed-no-secret-key) |
| `No pinentry` | [No pinentry](#gpg-signing-failed-no-pinentry) |
| Commit shows **Unverified** on GitHub | [Unverified commit](#commit-shows-unverified-on-github) |
| `403` or `Permission ... denied to` on push | [Wrong account on push](#push-fails-with-403-or-permission-denied) |
| Work repo uses the personal email | [Wrong email in a work repo](#wrong-email-in-a-work-repo) |
| `Key is already in use` | [One key per account](#key-is-already-in-use) |

## error: gpg failed to sign the data

```text
error: gpg failed to sign the data
fatal: failed to write commit object
```

Git couldn't get a signature from gpg. Find the real reason by signing outside Git:

```bash
echo test | gpg --clearsign
```

The message it prints matches one of the sections below. The most common cause is the missing `GPG_TTY` line ([Git settings](4-git-setup.md)). Add it, open a new terminal, then restart the agent:

```bash
gpgconf --kill gpg-agent
```

## gpg: signing failed: Inappropriate ioctl for device

gpg can't find your terminal to ask for the passphrase. Add the `GPG_TTY` line for your shell ([Git settings](4-git-setup.md#let-gpg-ask-for-your-passphrase)) and open a new terminal.

## gpg: signing failed: No secret key

```text
gpg: skipped "3439F5BC8FA34EB1C3EEE13525B79846119AEE81": No secret key
gpg: signing failed: No secret key
```

Git asks for a key that isn't on this machine. Compare the two:

```bash
git config user.signingkey
gpg --list-secret-keys --keyid-format=long
```

Set `user.signingkey` to an ID from the second list. New laptop? Restore your key first ([backup.md](backup.md#restore-on-a-new-laptop)).

## gpg: signing failed: No pinentry

The program that shows the passphrase prompt is missing. Install `pinentry` (Linux) or `pinentry-mac` (macOS, see [Git settings](4-git-setup.md#let-gpg-ask-for-your-passphrase)), then:

```bash
gpgconf --kill gpg-agent
```

## Commit shows Unverified on GitHub

GitHub verifies a commit only when **all three** are true:

1. The commit is signed: `git log --show-signature -1` prints `Good signature`.
2. The commit email is inside your key: compare `git log -1 --format=%ae` with `gpg -k`.
3. That email is **verified** on the account that holds the key ([settings/emails](https://github.com/settings/emails)).

GitHub's hover text tells you which one failed. *"The email in this signature doesn't match the committer email"* means rule 2.

### Added an email to the key, still Unverified

GitHub only knows the emails it saw at upload time. Export the key again and re-upload it ([Upload the key](3-upload-key.md)).

### The new email shows [ unknown] in gpg

```bash
gpg --check-trustdb
```

That refreshes gpg's local trust list. It never affects GitHub.

## Push fails with 403 or Permission denied

```text
remote: Permission to owner/repo.git denied to you-personal.
fatal: unable to access 'https://github.com/owner/repo.git/': The requested URL returned error: 403
```

The wrong account is active in gh. Switch to the one that owns the repo:

```bash
gh auth switch -u you-work
```

## Login went to the wrong account

`gh auth login` approves whichever account is signed in **in the browser**. Sign out there (or use a private window), then run `gh auth login` again.

## Browser doesn't open on login

Open the link by hand, or set your browser once: `gh config set browser <your-browser>`.

## gh gpg-key add fails with a scope error

The login doesn't have permission to add keys yet:

```bash
gh auth refresh -h github.com -s write:gpg_key
```

## invalid value for key expiry

Use `0` (never) or something like `2y`. Very large values such as `100y` are rejected.

## Wrong email in a work repo

The repo must be inside `~/work/`, and the folder line needs its trailing `/`. Check where the email comes from:

```bash
git config --show-origin user.email
```

## Key is already in use

GitHub accepts the same key on two accounts today. If it ever refuses, make a second key just for work:

```bash
gpg --full-generate-key                       # this time use your work email
gpg --list-secret-keys --keyid-format=long    # copy the new KEY_ID
gpg --armor --export <WORK_KEY_ID> > work-key.asc
```

Upload `work-key.asc` to the work account ([how](3-upload-key.md)), then add the key to `~/.gitconfig-work`:

```ini
[user]
    email = you@company.com
    signingkey = <WORK_KEY_ID>
```

---

Still stuck? [Open an issue](https://github.com/md8-habibullah/multiple-github-accounts-gpg-verified/issues/new/choose) with the exact error.

[Home](../README.md) · [FAQ](faq.md) · [Cheat sheet](cheatsheet.md)
