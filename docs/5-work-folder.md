[Home](../README.md) · Step 5 of 5 (optional)

# Use your work email automatically in work folders

Keep all work repos in `~/work/`, and Git uses your work email there by itself. This is Git's built-in `includeIf`: no tools, no aliases.

## 1. Make the folder

```bash
mkdir -p ~/work
```

## 2. Create `~/.gitconfig-work`

```ini
[user]
    email = you@company.com
```

## 3. Add this to the end of `~/.gitconfig`

```ini
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work
```

Keep the `/` at the end of `~/work/`.

## Check

Inside any repo in `~/work/`:

```bash
git config user.email
# you@company.com
```

Anywhere else it prints your personal email.

> **More than two accounts?** Add one folder, one `~/.gitconfig-<name>` file and one `includeIf` block per account.

---

Previous: [Git settings](4-git-setup.md) · Next: [Daily use](6-daily-use.md)
