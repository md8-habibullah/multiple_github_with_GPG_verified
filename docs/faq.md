[Home](../README.md) · FAQ

# FAQ: multiple GitHub accounts, GPG and Verified commits

### Can I use two GitHub accounts on one computer?

Yes. The GitHub CLI (version 2.40 and newer) keeps several accounts logged in at once, and `gh auth switch` changes which one Git uses to push. Your commit email and signature are handled separately by Git, so each repo gets the right identity. The [quick setup](../README.md#quick-setup) takes about 15 minutes.

### Do I need SSH keys or an ~/.ssh/config with host aliases?

No. The common SSH approach needs a key per account, `Host` aliases in `~/.ssh/config`, and edited remote URLs like `git@github-work:org/repo.git` in every clone. This guide uses gh over HTTPS instead: normal clone URLs, no aliases, and one command to switch. If you prefer SSH for other reasons, the author's [SSH guide](https://dev.to/md8_habibullah/ssh-mastery-2026-from-zero-to-hero-the-developers-complete-guide-1bla) covers keys and config in depth.

### Can the same GPG key be on two GitHub accounts?

Yes. GitHub accepts the same key on several accounts (tested in October 2026). Each account shows Verified for commits whose email is verified on **that** account. If GitHub ever answers "Key is already in use", use [one key per account](troubleshooting.md#key-is-already-in-use).

### Does gh auth switch change my commit email?

No. `gh auth switch` only changes which account pushes and pulls. The email written into a commit comes from Git's config. With the [work folder setup](5-work-folder.md), repos in `~/work/` use your work email automatically.

### Why does my commit say Unverified?

GitHub needs three things: the commit is signed, the commit email is inside your key, and that email is verified on the account holding the key. The [troubleshooting page](troubleshooting.md#commit-shows-unverified-on-github) shows how to check each one.

### Can I sign commits with an SSH key instead of GPG?

Yes. Git can sign with SSH keys (`git config --global gpg.format ssh` and `user.signingkey ~/.ssh/id_ed25519.pub`), and GitHub verifies them once you add the key as a **Signing key** at [settings/ssh/new](https://github.com/settings/ssh/new). This guide uses GPG because one key holds both emails and works for tags and every Git host the same way.

### Do VS Code and JetBrains IDEs sign my commits too?

Yes. Editors that run your installed Git follow the same `commit.gpgsign` and `user.signingkey` settings. They need a graphical passphrase prompt: on Linux install a GUI `pinentry` such as `pinentry-qt` or `pinentry-gnome3`, on macOS use `pinentry-mac`.

### Can I use more than two accounts?

Yes. Run `gh auth login` once per account, add every email to the key, and add one folder with its own `includeIf` block per account ([step 5](5-work-folder.md)).

### Does this work on Windows?

Yes. Git for Windows ships with gpg. Run the commands in Git Bash ([install notes](install.md#windows-notes)).

### Is it safe to put my GPG key on GitHub?

You only upload the **public** key, which is made to be shared. Never upload or commit the private key backup ([backup.md](backup.md)).

### What happens to Verified commits when my key expires?

GitHub records the verification when you push, so commits that showed Verified keep it. Renew the key before it expires so new commits are signed too ([renew](backup.md#renew-before-it-expires)).

### How do I keep my real email out of public commits?

Use your account's noreply address (like `12345+you@users.noreply.github.com`, shown on [settings/emails](https://github.com/settings/emails)) as the commit email, and add it to your key. More in [privacy tips](../README.md#privacy).

---

[Home](../README.md) · [Troubleshooting](troubleshooting.md) · [Cheat sheet](cheatsheet.md)
