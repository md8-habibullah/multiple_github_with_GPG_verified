[Home](README.md) · Install

# Install git, gh and gpg

| System | Command |
|---|---|
| Arch / CachyOS / Manjaro | `sudo pacman -S git github-cli gnupg` |
| Debian / Ubuntu | `sudo apt install git gh gnupg` |
| Fedora | `sudo dnf install git gh gnupg2` |
| macOS | `brew install git gh gnupg pinentry-mac` |

Check that `gh` is **2.40 or newer**. Older versions can't hold two accounts.

```bash
gh --version
```

On Ubuntu, if `gh` is older than 2.40, install it from [cli.github.com](https://cli.github.com).

---

Next: [Log in to both accounts](1-login.md)
