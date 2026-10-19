[Home](../README.md) · Step 4 of 5

# Make Git sign every commit

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
| Git Bash (Windows) | nothing to add | |

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

## Signed tags need a message

With `tag.gpgsign` on, every tag is a signed, annotated tag, so Git wants a message. Give it inline, or Git opens your editor:

```bash
git tag -m "Version 1.0.0" v1.0.0
```

No editor set up? `git config --global core.editor nano` (or `vim`, or `"code --wait"`).

## Recommended extras

```bash
git config --global pull.rebase false          # merge on pull; some devices default to true
git config --global init.defaultBranch main
git config --global push.autoSetupRemote true
```

See what your device already set, and from which file: `git config --list --show-origin`.
The reasons for each setting are under [Recommended settings and tips](../README.md#recommended-settings-and-tips).

---

Previous: [Upload the key](3-upload-key.md) · Next: [Work folder setup](5-work-folder.md)
