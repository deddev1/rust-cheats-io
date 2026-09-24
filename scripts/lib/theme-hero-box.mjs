import { existsSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

export function heroBoxSource(root) {
  return join(root, 'source-media', 'hero', 'product-box.jpg')
}

export function buyCardSource(root) {
  return join(root, 'source-media', 'hero', 'buy-card-source.jpg')
}

export function heroBoxPipeline(input) {
  let pipeline = sharp(input).rotate()
  if (process.env.HERO_BOX_HUE_SHIFT === '1') {
    pipeline = pipeline.modulate({
      hue: -52,
      saturation: 1.12,
      brightness: 0.93,
    })
  } else {
    pipeline = pipeline.modulate({ brightness: 0.97, saturation: 1.04 })
  }
  return pipeline
}

/**
 * Product-box art only → buy card.
 * Never overwrite cheat-gameplay stills (soldier / monument / raid / hero poster / OG).
 */
export async function generateThemeHeroFromBox(root, { mediaDir }) {
  const buySrc = existsSync(buyCardSource(root))
    ? buyCardSource(root)
    : existsSync(heroBoxSource(root))
      ? heroBoxSource(root)
      : null
  if (!buySrc) return false

  const base = heroBoxPipeline(buySrc)
  await base
    .clone()
    .resize(1000, 1000, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88, effort: 4 })
    .toFile(join(mediaDir, 'rust-product-buy-card.webp'))
  await base
    .clone()
    .resize(1000, 1000, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(join(mediaDir, 'rust-product-buy-card.jpg'))

  return true
}
