[Home](README.md) · Step 3 of 5

# Upload the key to both accounts

## Export it

```bash
gpg --armor --export <KEY_ID> > key.asc
```

This is the **public** part, so it's safe to paste on GitHub.

## Way 1: Browser (easiest)

Do this **once on each account**:

1. Sign in to GitHub as that account.
2. Open **[github.com/settings/gpg/new](https://github.com/settings/gpg/new)**.
3. Title: `My Laptop`.
4. Paste everything inside `key.asc`, from `-----BEGIN` to `-----END`.
5. Click **Add GPG key**.

## Way 2: Terminal with gh

```bash
gh auth switch -u you-personal
gh auth refresh -h github.com -s write:gpg_key     # one-time browser approval
gh gpg-key add key.asc --title "My Laptop"

gh auth switch -u you-work
gh auth refresh -h github.com -s write:gpg_key     # browser must be signed in as work
gh gpg-key add key.asc --title "My Laptop"
```

## Check

On [github.com/settings/keys](https://github.com/settings/keys) the key lists its emails.
That account's own email should say **Verified**. The other account's email showing *Unverified* there is normal.

> **"Key is already in use"** on the second account? GitHub didn't accept the same key twice.
> Make a second key just for work: [one key per account](troubleshooting.md#key-is-already-in-use).

> Added another email to the key later? Export it again and re-upload. GitHub only knows the emails it saw at upload time.

---

Previous: [Create the GPG key](2-gpg-key.md) · Next: [Git settings](4-git-setup.md)
