import sharp from 'sharp'
import { join } from 'node:path'
import { unlinkSync, existsSync } from 'node:fs'
const media = join(process.cwd(), 'public', 'media')
const frame = join(media, '_hero-frame.jpg')
const poster = join(media, 'rust-hero-poster.jpg')
await sharp(frame).resize(1280, 720, { fit: 'cover' }).jpeg({ quality: 86, mozjpeg: true }).toFile(poster)
for (const w of [640, 960, 1280]) {
  await sharp(frame).resize(w, Math.round((w * 9) / 16), { fit: 'cover' }).webp({ quality: 78, effort: 4 }).toFile(join(media, `rust-hero-poster-${w}w.webp`))
}
if (existsSync(frame)) unlinkSync(frame)
console.log('hero posters refreshed')
