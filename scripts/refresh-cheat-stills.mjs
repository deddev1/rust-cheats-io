/**
 * Refresh all gameplay stills from encoded Rust cheat clips
 * (rust-hero / rust-product-preview — cut from the user-provided cheat video).
 * Replaces non-Rust leftovers in source-media/cheat + public/media.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const ff = require('ffmpeg-static')
const media = join(root, 'public', 'media')
const videos = join(root, 'public', 'videos')
const ogDir = join(root, 'public', 'og')
const cheatDir = join(root, 'source-media', 'cheat')
const framesDir = join(media, '_frames')

const hero = join(videos, 'rust-hero.mp4')
const preview = join(videos, 'rust-product-preview.mp4')
const card = join(videos, 'rust-card-loop.mp4')

if (!existsSync(hero) && !existsSync(preview)) {
  console.error('Missing public/videos/rust-hero.mp4 or rust-product-preview.mp4')
  process.exit(1)
}

mkdirSync(framesDir, { recursive: true })
mkdirSync(cheatDir, { recursive: true })
mkdirSync(ogDir, { recursive: true })

/** Six distinct moments across the short cheat encodes. */
const JOBS = [
  { src: existsSync(hero) ? hero : preview, ss: 0.5 },
  { src: existsSync(preview) ? preview : hero, ss: 1.2 },
  { src: existsSync(hero) ? hero : preview, ss: 2.8 },
  { src: existsSync(preview) ? preview : hero, ss: 3.5 },
  { src: existsSync(card) ? card : hero, ss: 1.0 },
  { src: existsSync(hero) ? hero : preview, ss: 5.5 },
]

function extractFrame(src, ss, outPath) {
  const r = spawnSync(
    ff,
    ['-y', '-ss', String(ss), '-i', src, '-frames:v', '1', '-q:v', '2', outPath],
    { stdio: 'pipe' },
  )
  if (r.status !== 0 || !existsSync(outPath)) {
    throw new Error(`ffmpeg frame failed (${src} @ ${ss}s)\n${r.stderr?.toString() || ''}`)
  }
}

for (let i = 0; i < JOBS.length; i++) {
  const name = `${String(i + 1).padStart(2, '0')}.jpg`
  const tmp = join(framesDir, name)
  extractFrame(JOBS[i].src, JOBS[i].ss, tmp)
  copyFileSync(tmp, join(cheatDir, name))
}

async function save(input, out, w, h, format = 'jpeg', q = 86) {
  let p = sharp(input).rotate().resize(w, h, { fit: 'cover', position: 'centre' })
  if (format === 'webp') p = p.webp({ quality: q, effort: 4 })
  else p = p.jpeg({ quality: q, mozjpeg: true })
  await p.toFile(out)
}

const f = (n) => join(framesDir, `${String(n).padStart(2, '0')}.jpg`)

await save(f(1), join(media, 'rust-hero-poster.jpg'), 1280, 720, 'jpeg', 82)
await save(f(1), join(media, 'rust-hero-poster-640w.webp'), 640, 360, 'webp', 78)
await save(f(1), join(media, 'rust-hero-poster-960w.webp'), 960, 540, 'webp', 78)
await save(f(1), join(media, 'rust-hero-poster-1280w.webp'), 1280, 720, 'webp', 80)

await save(f(2), join(media, 'rust-product-preview-poster.jpg'), 1280, 720, 'jpeg', 84)
await save(f(2), join(media, 'rust-product-hero.webp'), 1280, 720, 'webp', 84)
await save(f(2), join(media, 'rust-product-hero-800w.webp'), 800, 450, 'webp', 80)
await save(f(2), join(media, 'rust-product-hero-480w.webp'), 480, 270, 'webp', 78)
await save(f(2), join(media, 'rust-product-cover.webp'), 1000, 1000, 'webp', 84)

await save(f(1), join(media, 'rust-soldier-hero.jpg'), 1280, 720, 'jpeg', 84)
await save(f(1), join(media, 'rust-soldier-hero-800w.webp'), 800, 450, 'webp', 80)
await save(f(1), join(media, 'rust-soldier-hero-480w.webp'), 480, 270, 'webp', 78)

await save(f(3), join(media, 'rust-monument.jpg'), 1280, 720, 'jpeg', 84)
await save(f(3), join(media, 'rust-monument-800w.webp'), 800, 450, 'webp', 80)
await save(f(3), join(media, 'rust-monument-480w.webp'), 480, 270, 'webp', 78)

await save(f(4), join(media, 'rust-raid-party.jpg'), 1280, 720, 'jpeg', 84)
await save(f(4), join(media, 'rust-raid-party-800w.webp'), 800, 450, 'webp', 80)
await save(f(4), join(media, 'rust-raid-party-480w.webp'), 480, 270, 'webp', 78)

await save(f(2), join(ogDir, 'rust-cheats.jpg'), 1200, 630, 'jpeg', 90)

rmSync(framesDir, { recursive: true, force: true })
console.log('Cheat gameplay stills refreshed from rust-hero / product-preview / card-loop')
