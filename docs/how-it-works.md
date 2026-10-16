[Home](../README.md) · How it works (optional)

# How it works

You don't need this page to follow the setup. It's here if you're curious.

## Three separate pieces

| Piece | Job | Stored in |
|---|---|---|
| gh login | Lets you push and pull | gh's keyring |
| Git email | Written into every commit | `~/.gitconfig` |
| GPG signature | Proves the commit is really yours | `~/.gnupg` |

## When does GitHub say Verified?

```mermaid
flowchart LR
    A[Your commit] --> B{Is the key on<br/>a GitHub account?}
    B -- no --> U[Unverified]
    B -- yes --> C{Is the commit email in the key<br/>and verified on that account?}
    C -- no --> U
    C -- yes --> V[Verified]

    style V fill:#1f883d,color:#fff,stroke:#1f883d
    style U fill:#cf222e,color:#fff,stroke:#cf222e
```

## Which email does Git use?

```mermaid
flowchart LR
    R[git commit] --> Q{Repo inside<br/>~/work/ ?}
    Q -- yes --> W[work email]
    Q -- no --> P[personal email]
    W --> S[signed with your key]
    P --> S
```

## The login flow

```mermaid
sequenceDiagram
    participant T as Terminal
    participant B as Browser
    participant G as GitHub
    T->>T: shows a one-time code
    T->>B: opens github.com/login/device
    B->>G: you paste the code and authorize
    G-->>T: login saved
```

That's why the browser must be signed in to the right account: GitHub approves the login for whoever is signed in **there**.

---

[Home](../README.md)
