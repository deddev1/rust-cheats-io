import sharp from 'sharp'
import { join } from 'node:path'
import { rmSync, existsSync } from 'node:fs'

const media = join(process.cwd(), 'public', 'media')
const frames = join(media, '_frames')
const f = (n) => join(frames, `${String(n).padStart(2, '0')}.jpg`)

async function save(input, out, w, h, format = 'jpeg', q = 86) {
  let p = sharp(input).rotate().resize(w, h, { fit: 'cover', position: 'centre' })
  if (format === 'webp') p = p.webp({ quality: q, effort: 4 })
  else p = p.jpeg({ quality: q, mozjpeg: true })
  await p.toFile(out)
}

// Hero poster + responsive (frame 1)
await save(f(1), join(media, 'rust-hero-poster.jpg'), 1920, 1080, 'jpeg', 88)
await save(f(1), join(media, 'rust-hero-poster-640w.webp'), 640, 360, 'webp', 78)
await save(f(1), join(media, 'rust-hero-poster-960w.webp'), 960, 540, 'webp', 78)
await save(f(1), join(media, 'rust-hero-poster-1280w.webp'), 1280, 720, 'webp', 80)

// Product video poster + hero/cover (frame 2)
await save(f(2), join(media, 'rust-product-preview-poster.jpg'), 1920, 1080, 'jpeg', 88)
await save(f(2), join(media, 'rust-product-hero.webp'), 1280, 720, 'webp', 84)
await save(f(2), join(media, 'rust-product-hero-800w.webp'), 800, 450, 'webp', 80)
await save(f(2), join(media, 'rust-product-hero-480w.webp'), 480, 270, 'webp', 78)
await save(f(2), join(media, 'rust-product-cover.webp'), 1000, 1000, 'webp', 84)

// Site gameplay stills previously placeholders (frames 1–4)
await save(f(1), join(media, 'rust-soldier-hero.jpg'), 1920, 1080, 'jpeg', 88)
await save(f(1), join(media, 'rust-soldier-hero-800w.webp'), 800, 450, 'webp', 80)
await save(f(1), join(media, 'rust-soldier-hero-480w.webp'), 480, 270, 'webp', 78)

await save(f(3), join(media, 'rust-monument.jpg'), 1600, 900, 'jpeg', 86)
await save(f(3), join(media, 'rust-monument-800w.webp'), 800, 450, 'webp', 80)
await save(f(3), join(media, 'rust-monument-480w.webp'), 480, 270, 'webp', 78)

await save(f(4), join(media, 'rust-raid-party.jpg'), 1600, 900, 'jpeg', 86)
await save(f(4), join(media, 'rust-raid-party-800w.webp'), 800, 450, 'webp', 80)
await save(f(4), join(media, 'rust-raid-party-480w.webp'), 480, 270, 'webp', 78)

// OG share image from gameplay
await save(f(2), join(process.cwd(), 'public', 'og', 'rust-cheats.jpg'), 1200, 630, 'jpeg', 90)

rmSync(frames, { recursive: true, force: true })
console.log('All gameplay stills replaced from cheat video frames')
