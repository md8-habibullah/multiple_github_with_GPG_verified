[Home](../README.md) · Install

# Install Git, GitHub CLI and GnuPG

| System | Command |
|---|---|
| Arch / CachyOS / Manjaro | `sudo pacman -S git github-cli gnupg` |
| Debian / Ubuntu | `sudo apt install git gh gnupg` |
| Fedora | `sudo dnf install git gh gnupg2` |
| macOS | `brew install git gh gnupg pinentry-mac` |
| Windows | `winget install --id Git.Git` then `winget install --id GitHub.cli` |

Check that `gh` is **2.40 or newer**. Older versions can't hold two accounts.

```bash
gh --version
```

On Ubuntu, if `gh` is older than 2.40, install it from [cli.github.com](https://cli.github.com).

## Windows notes

Git for Windows already includes `gpg`. Run every command in this guide in **Git Bash** (installed with Git), and Git finds your key without extra setup.

Prefer Gpg4win? Then tell Git to use that `gpg` instead of the bundled one:

```bash
where gpg                                      # copy the Gpg4win path it prints
git config --global gpg.program "<that path>"
```

---

Next: [Log in to both accounts](1-login.md)
