import sharp from 'sharp'
import { join } from 'node:path'
const root = process.cwd()
const src = join(root, 'source-media', 'hero', 'buy-card-source.jpg')
const media = join(root, 'public', 'media')
await sharp(src).rotate().resize(1000, 1000, { fit: 'cover', position: 'centre' }).webp({ quality: 88, effort: 4 }).toFile(join(media, 'rust-product-buy-card.webp'))
await sharp(src).rotate().resize(1000, 1000, { fit: 'cover', position: 'centre' }).jpeg({ quality: 90, mozjpeg: true }).toFile(join(media, 'rust-product-buy-card.jpg'))
console.log('buy card image ready')
