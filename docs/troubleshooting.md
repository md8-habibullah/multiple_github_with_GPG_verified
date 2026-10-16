[Home](../README.md) · Troubleshooting

# Troubleshooting

| Problem | Fix |
|---|---|
| `gpg failed to sign the data` | Add the `GPG_TTY` line ([Git settings](4-git-setup.md)), open a new terminal, run `gpgconf --kill gpg-agent` |
| Commit says **Unverified** | The commit email must be in your key **and** verified on the account that has the key. Compare `git log -1 --format=%ae` with `gpg -k` |
| Added an email, still Unverified | Export the key again and re-upload it ([Upload](3-upload-key.md)) |
| `403` / `Permission denied` on push | Wrong account active. Run `gh auth switch` |
| Login went to the wrong account | The browser was signed in as the other one. Sign out there, then `gh auth login` again |
| Browser doesn't open on login | Open the link by hand, or `gh config set browser <your-browser>` |
| `gh gpg-key add` fails with a scope error | `gh auth refresh -h github.com -s write:gpg_key` |
| `invalid value` for key expiry | Use `0` or `2y`, not huge numbers like `100y` |
| Wrong email in a work repo | The repo must be inside `~/work/`. Check with `git config --show-origin user.email` |

## Key is already in use

GitHub may refuse a key that is already on your other account. Make a second key just for work:

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

[Home](../README.md) · [Cheat sheet](cheatsheet.md)
