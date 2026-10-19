[Home](../README.md) · How it works (optional)

# How multiple accounts and Verified commits work

You don't need this page to follow the setup. It's here if you're curious.

## Three separate pieces

| Piece | Job | Stored in |
|---|---|---|
| gh login | Lets you push and pull | gh's keyring |
| Git email | Written into every commit | `~/.gitconfig` |
| GPG signature | Proves the commit is really yours | `~/.gnupg` |

Switching the gh account changes only the first piece. That's why the email and signature never get mixed up when you switch.

## When does GitHub say Verified?

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/diagram-verified-dark.png">
  <img src="images/diagram-verified.png" width="760" alt="Decision flow: a commit is Verified only if it is signed by a key on a GitHub account, and the commit email is in that key and verified on that account. Otherwise it is Unverified.">
</picture>

GitHub checks the signature against the keys on your accounts. The commit is **Verified** only when the key is on an account **and** the commit email is in the key **and** verified on that account. If any check fails, it shows **Unverified**.

## Which email does Git use?

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/diagram-email-dark.png">
  <img src="images/diagram-email.png" width="760" alt="Decision flow: a commit in a repo inside ~/work/ uses the work email, anywhere else the personal email. Both are signed with the same key.">
</picture>

Git reads `~/.gitconfig` first. If the repo is inside `~/work/`, the `includeIf` block loads `~/.gitconfig-work` and its email wins. Both emails live in the same key, so the signature matches either way.

## The login flow

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="images/diagram-login-dark.png">
  <img src="images/diagram-login.png" width="760" alt="Login sequence: the terminal shows a one-time code and opens github.com/login/device, you paste the code in the browser and authorize, and GitHub saves the login for the account signed in there.">
</picture>

The terminal shows a one-time code and opens `github.com/login/device`. You paste the code and authorize, and GitHub sends the login back to gh. That's why the browser must be signed in to the right account: GitHub approves the login for whoever is signed in **there**.

---

[Home](../README.md)
