[Home](../README.md) · Backup and recovery

# Backup and recovery

Do the backup **once, right after creating the key**. Without it, a dead disk or a reinstall means a new key, re-uploading, and old setups breaking.

## What to back up

| File | Command | What it's for |
|---|---|---|
| Private key | `gpg --armor --export-secret-keys <KEY_ID> > private-key-BACKUP.asc` | Restore your key on a new laptop |
| Public key | `gpg --armor --export <KEY_ID> > public-key.asc` | Re-upload to GitHub any time |
| Revocation certificate | already created at `~/.gnupg/openpgp-revocs.d/<KEY_ID>.rev` | Cancel the key if it's lost or stolen |
| Trust settings | `gpg --export-ownertrust > ownertrust.txt` | Keep the key marked as yours (`[ultimate]`) |

Plus your **passphrase**: save it in a password manager.

## Where to keep it

- A USB stick in a drawer, an encrypted archive, or a password manager that stores files.
- **Not** in a Git repo, email, chat apps, or an unencrypted cloud folder.
- The private backup is still protected by your passphrase, but treat it like a house key anyway.

## Restore on a new laptop

```bash
gpg --import private-key-BACKUP.asc
gpg --import-ownertrust ownertrust.txt
gpg --list-secret-keys --keyid-format=long     # the key is back
```

Then repeat only [4-git-setup.md](4-git-setup.md) (and [5-work-folder.md](5-work-folder.md) if you use it). The key is already on GitHub, so you don't need to upload it again.

## Renew before it expires

If you picked an expiry like `2y`, extend it before that date:

```bash
gpg --quick-set-expire <KEY_ID> 2y          # main key
gpg --quick-set-expire <KEY_ID> 2y '*'      # its subkeys
gpg --armor --export <KEY_ID> > key.asc     # export the updated key
```

On GitHub, delete the old copy at [settings/keys](https://github.com/settings/keys) and upload the new `key.asc` on **both** accounts. Then make a fresh backup.

## Laptop lost or key stolen

1. Delete the key from **both** accounts at [settings/keys](https://github.com/settings/keys) right away.
2. On any machine with your backup, cancel the key. Open the `.rev` file in a text editor and **delete the `:` at the start** of the `:-----BEGIN PGP PUBLIC KEY BLOCK-----` line. gpg adds it on purpose so the file can't be used by accident. Then:

   ```bash
   gpg --import ~/.gnupg/openpgp-revocs.d/<KEY_ID>.rev
   ```

   (Take the `.rev` file from your backup if the original machine is gone.)
3. Create a new key and follow steps 2 to 4 again.
4. Change your GitHub passwords and run `gh auth logout` on the lost device if it's still reachable. Also revoke its sessions at [settings/sessions](https://github.com/settings/sessions).

---

[Home](../README.md) · [Troubleshooting](troubleshooting.md)
