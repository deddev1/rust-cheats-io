# Rust Cheats (rustcheats.io)

Static Astro site for Rust cheats — Cloudflare Pages ready.

## Stack

- Astro 5 (static output)
- React islands (`@astrojs/react`)
- Tailwind CSS
- Custom split sitemaps (`npm run generate:sitemaps`)

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev on port 5174 |
| `npm run build` | Generate sitemaps + `astro build` → `dist/` |
| `npm run preview` | Preview production build |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run lint` | Oxlint |

## Cloudflare Workers (static assets + `workers/site.js`)

Workers Builds must **install dependencies and build Astro** before `wrangler deploy`.  
If the deploy command is only `npx wrangler deploy`, the build fails with *“Could not detect a directory containing static files”* because `./dist` does not exist yet.

In the Cloudflare dashboard (**Workers & Pages → your worker → Settings → Builds**), use **one** of these setups (not both):

**Recommended (single build, fewer timeouts):**

| Setting | Value |
| --- | --- |
| **Root directory** | `/` (repo root) |
| **Node version** | 22 |
| **Install command** | `npm ci` |
| **Deploy command** | `npm run deploy:cloudflare` |

Leave **Build command** empty. `wrangler.toml` `[build]` runs `npm run build` during `wrangler deploy`.

**Alternative (explicit build step):**

| Setting | Value |
| --- | --- |
| **Install command** | `npm ci` |
| **Build command** | `npm run build` |
| **Deploy command** | `npx wrangler deploy --no-bundle` |

If you set **Build command** and also keep `[build]` in `wrangler.toml`, the site builds **twice** (ffmpeg + Astro) and Workers Builds may fail with almost no log output.

Local production deploy:

```bash
npm run deploy
```

`wrangler.toml` serves static files from `./dist` and custom domains `rustcheats.io` / `www`.
