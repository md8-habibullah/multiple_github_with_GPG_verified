[Home](../README.md) · Cheat sheet

# Cheat sheet

## Accounts

```bash
gh auth login                    # add an account
gh auth status                   # list accounts, see the active one
gh auth switch                   # change active account
gh auth logout -u <user>         # remove an account
```

## GPG key

```bash
gpg --full-generate-key                          # create a key
gpg --list-secret-keys --keyid-format=long       # show keys and IDs
gpg --quick-add-uid <KEY_ID> "Name <email>"      # add an email
gpg --armor --export <KEY_ID> > key.asc          # export to upload
gh gpg-key add key.asc --title "My Laptop"       # upload to active account
```

## Git

```bash
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true
git config user.email                            # which email is used here
git log --show-signature -1                      # check last commit
```

## Back up your key (once, keep it offline)

```bash
gpg --armor --export-secret-keys <KEY_ID> > private-key-BACKUP.asc
gpg --import private-key-BACKUP.asc              # restore on a new laptop
```

Never share the private backup file.

---

[Home](../README.md)
