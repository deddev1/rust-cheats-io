import sharp from 'sharp'
import { join } from 'node:path'
const media = join(process.cwd(), 'public', 'media')
const poster = join(media, 'rust-hero-poster.jpg')
const preview = join(media, 'rust-product-preview-poster.jpg')
for (const [w, name] of [[640,'rust-hero-poster-640w.webp'],[960,'rust-hero-poster-960w.webp'],[1280,'rust-hero-poster-1280w.webp']]) {
  await sharp(poster).resize(w, Math.round((w * 9) / 16), { fit: 'cover' }).webp({ quality: 68, effort: 4 }).toFile(join(media, name))
}
await sharp(poster).resize(1280, 720, { fit: 'cover' }).jpeg({ quality: 78, mozjpeg: true }).toFile(poster)
await sharp(preview).resize(1280, 720, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile(preview)
await sharp(preview).resize(1280, 720, { fit: 'cover' }).webp({ quality: 78 }).toFile(join(media, 'rust-product-hero.webp'))
await sharp(preview).resize(800, 450, { fit: 'cover' }).webp({ quality: 74 }).toFile(join(media, 'rust-product-hero-800w.webp'))
await sharp(preview).resize(480, 270, { fit: 'cover' }).webp({ quality: 72 }).toFile(join(media, 'rust-product-hero-480w.webp'))
await sharp(preview).resize(1000, 1000, { fit: 'cover' }).webp({ quality: 78 }).toFile(join(media, 'rust-product-cover.webp'))
console.log('posters ok')
