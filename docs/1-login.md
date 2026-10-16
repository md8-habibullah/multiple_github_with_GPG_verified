[Home](../README.md) · Step 1 of 5

# Log in to both accounts

## Personal account

1. In your browser, sign in to GitHub as your **personal** account.
2. In the terminal:

   ```bash
   gh auth login
   ```

3. Answer the questions:

   | Question | Answer |
   |---|---|
   | Where do you use GitHub? | `GitHub.com` |
   | Preferred protocol for Git operations? | `HTTPS` |
   | Authenticate Git with your GitHub credentials? | `Yes` |
   | How would you like to authenticate? | `Login with a web browser` |

4. gh shows a code like `ABCD-1234` and copies it for you. Press **Enter**.
5. The browser opens **github.com/login/device**. Paste the code, click **Continue**, then **Authorize**.
6. The terminal prints `Logged in as you-personal`.

## Work account

1. In the browser, **sign out** of GitHub and sign in as your **work** account.
   (Or open the link from step 5 in a private window.)
2. Run the same command again. It **adds** the account and keeps the first one:

   ```bash
   gh auth login
   ```

## Finish

```bash
gh auth setup-git
gh auth status
```

`gh auth status` should list both accounts. One of them says `Active account: true`. That is the one used for `git push` right now.

To change it:

```bash
gh auth switch
```

> **Browser didn't open?** Copy the link into the browser yourself. To fix it for next time:
> `gh config set browser brave` (use your browser's command name).

---

Next: [Create the GPG key](2-gpg-key.md)
