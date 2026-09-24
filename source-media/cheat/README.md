# Gameplay screenshot sources

Frames `01.jpg`–`06.jpg` must be stills from the Rust cheat gameplay video
(ESP / radar / soft aim overlays) — not stock art or other games.

Refresh from the source video:

```bash
node scripts/refresh-cheat-stills.mjs
```

`npm run generate:seo-assets` then compresses these into `public/media/*` and
builds short loops from `rust-hero.mp4`. Product-box art only updates the buy
card — it never overwrites cheat stills.
