[Home](../README.md) · Step 4 of 5

# Git settings

Your personal account is the default everywhere.

```bash
git config --global user.name  "Your Name"
git config --global user.email "you@personal.dev"
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

## Let gpg ask for your passphrase

Add **one** line to your shell, then open a new terminal:

| Shell | Add to file | Line |
|---|---|---|
| bash | `~/.bashrc` | `export GPG_TTY=$(tty)` |
| zsh | `~/.zshrc` | `export GPG_TTY=$(tty)` |
| fish | `~/.config/fish/conf.d/gpg.fish` | `set -gx GPG_TTY (tty)` |

macOS also needs:

```bash
echo "pinentry-program $(which pinentry-mac)" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent
```

## Quick test

```bash
echo test | gpg --clearsign
```

If it asks for your passphrase and prints a signed block, signing works.

---

Previous: [Upload the key](3-upload-key.md) · Next: [Work folder setup](5-work-folder.md)
