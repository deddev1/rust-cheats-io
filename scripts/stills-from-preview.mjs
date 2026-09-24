import sharp from 'sharp'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { unlinkSync, existsSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const media = join(root, 'public', 'media')
const still = join(media, '_gameplay-still.jpg')
const poster = join(media, 'rust-product-preview-poster.jpg')

if (!existsSync(still) && !existsSync(poster)) {
  console.error('Missing gameplay still')
  process.exit(1)
}

const input = existsSync(still) ? still : poster
const base = sharp(input).rotate()

await base.clone().resize(1280, 720, { fit: 'cover', position: 'centre' }).jpeg({ quality: 88, mozjpeg: true }).toFile(poster)
await base.clone().resize(1280, 720, { fit: 'cover', position: 'centre' }).webp({ quality: 84, effort: 4 }).toFile(join(media, 'rust-product-hero.webp'))
await base.clone().resize(800, 450, { fit: 'cover', position: 'centre' }).webp({ quality: 80, effort: 4 }).toFile(join(media, 'rust-product-hero-800w.webp'))
await base.clone().resize(480, 270, { fit: 'cover', position: 'centre' }).webp({ quality: 78, effort: 4 }).toFile(join(media, 'rust-product-hero-480w.webp'))
await base.clone().resize(1000, 1000, { fit: 'cover', position: 'centre' }).webp({ quality: 84, effort: 4 }).toFile(join(media, 'rust-product-cover.webp'))

if (existsSync(still)) unlinkSync(still)
console.log('Product images generated from gameplay video frame')
