[Home](../README.md) · Step 2 of 5

# Create the GPG key

One key, holding both of your emails.

## Make the key

```bash
gpg --full-generate-key
```

| It asks | You type |
|---|---|
| Kind of key | Enter (default) |
| Elliptic curve | Enter (default) |
| Key is valid for? | `0` (never expires) or `2y` |
| Is this correct? | `y` |
| Real name | `Your Name` |
| Email address | your **personal** email |
| Comment | **nothing, just press Enter** |
| (N)ame, (C)omment, (E)mail or (O)kay | `O` |
| Passphrase | a strong one, and remember it |

> Don't type your name or email again at **Comment**, it makes the key look messy.
> Don't use a huge expiry like `100y`, gpg rejects it with `invalid value`.

## Find your key ID

```bash
gpg --list-secret-keys --keyid-format=long
```

```text
sec   ed25519/21C21FB0B1A939BF 2026-10-16 [SC]
      AFB70B6C70AAAD41E4C26B7C21C21FB0B1A939BF    <- this long line is your KEY_ID
uid                 [ultimate] Your Name <you@personal.dev>
```

## Add your work email

```bash
gpg --quick-add-uid <KEY_ID> "Your Name <you@company.com>"
```

Check that both emails are there:

```bash
gpg --list-keys <KEY_ID>
```

```text
uid   [ultimate] Your Name <you@personal.dev>
uid   [ultimate] Your Name <you@company.com>
```

<details>
<summary>Added a wrong email? Remove it</summary>

```text
gpg --edit-key <KEY_ID>
gpg> list          # shows the emails with numbers
gpg> uid 2         # pick the wrong one
gpg> deluid
Really remove this user ID? (y/N) y
gpg> save
```
Only do this before you upload the key anywhere.
</details>

---

Previous: [Log in](1-login.md) · Next: [Upload the key](3-upload-key.md)
