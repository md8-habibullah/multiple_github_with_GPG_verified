[Home](../README.md) · Cheat sheet

# Cheat sheet: multiple GitHub accounts and GPG

## Accounts

```bash
gh auth login                    # add an account
gh auth status                   # list accounts, see the active one
gh auth switch                   # change active account
gh auth switch -u you-work       # switch to a named account
gh auth logout -u <user>         # remove an account
```

## GPG key

```bash
gpg --full-generate-key                          # create a key
gpg --list-secret-keys --keyid-format=long       # show keys and IDs
gpg --quick-add-uid <KEY_ID> "Name <email>"      # add an email
gpg --check-trustdb                              # new email shows [ unknown]? refresh
gpg --armor --export <KEY_ID> > key.asc          # export to upload
gh gpg-key add key.asc --title "My Laptop"       # upload to active account
```

## Git

```bash
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true
git config user.email                            # which email is used here
git config --show-origin user.email              # and which file set it
git log --show-signature -1                      # check last commit
git tag -m "Version 1.0.0" v1.0.0                # signed tag with a message
```

## Back up your key (once, keep it offline)

```bash
gpg --armor --export-secret-keys <KEY_ID> > private-key-BACKUP.asc
gpg --import private-key-BACKUP.asc              # restore on a new laptop
```

Never share the private backup file. Renewing and lost keys: [backup.md](backup.md)

## Recommended Git defaults

```bash
git config --global pull.rebase false
git config --global init.defaultBranch main
git config --global push.autoSetupRemote true
git config --global fetch.prune true
git config --list --show-origin                  # see every setting and its file
```

---

[Home](../README.md) · [Troubleshooting](troubleshooting.md) · [FAQ](faq.md)
