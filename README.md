# Yūzōnō → Hayase Extension Bridge

This repository is a Hayase Manifest v2 extension project designed around the
torrent-capable extensions found in Yūzōnō's `anime-extensions` repository.

## Important limitation

Yūzōnō extensions are Kotlin/Android extensions. Hayase extensions are JavaScript
modules. They are not binary-compatible, so an APK cannot simply be installed
as a Hayase extension.

This project therefore provides the Hayase-side compatibility layer and a
strict provider contract. It accepts torrent results from a provider you are
authorized to use and normalizes them to Hayase's `single`, `batch`, and
`movie` API.

It intentionally does not bundle a scraper for third-party copyrighted anime
sources.

## Repository layout

- `index.json` — Hayase Manifest v2 catalog
- `dist/yuzono-torrent-bridge.js` — Hayase-compatible extension
- `src/provider-contract.md` — provider API contract
- `src/yuzono-torrent-sources.json` — Yūzōnō torrent-source metadata/reference
- `scripts/validate.mjs` — local validation
- `.github/workflows/validate.yml` — GitHub Actions validation

## Codespaces deployment

1. Create a GitHub repository and upload this project.
2. Open **Code → Codespaces → Create codespace on main**.
3. In the terminal:

```bash
npm run validate
git add .
git commit -m "Initial Yuzono Hayase bridge"
git push
```

4. Enable GitHub Pages:
   **Settings → Pages → Deploy from branch → main → /(root)**.
5. Your Hayase catalog URL becomes:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/index.json
```

Replace the placeholders in `index.json` and `dist/yuzono-torrent-bridge.js`
before installing it.

## Why this is structured this way

The Yūzōnō repository documents that its extensions implement Android/Anikku
interfaces such as `AnimeHttpSource`, while Hayase uses JavaScript Manifest v2
extensions. The bridge keeps those two runtimes separate instead of pretending
a Kotlin APK can run inside Hayase.

For a source you own or are explicitly authorized to access, the only piece
that needs to be supplied is the provider adapter described in
`src/provider-contract.md`.
