import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateThemeHeroFromBox, heroBoxSource } from './lib/theme-hero-box.mjs'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const mediaDir = join(root, 'public', 'media')
const ogDir = join(root, 'public', 'og')

mkdirSync(heroBoxSource(root).replace(/product-box\.jpg$/, ''), { recursive: true })
mkdirSync(mediaDir, { recursive: true })
mkdirSync(ogDir, { recursive: true })

if (!existsSync(heroBoxSource(root))) {
  console.error('Missing hero source. Save product-box.jpg to source-media/hero/product-box.jpg')
  process.exit(1)
}

const ok = await generateThemeHeroFromBox(root, { mediaDir, ogDir })
if (!ok) process.exit(1)
console.log(`Themed hero written from ${heroBoxSource(root)}`)
