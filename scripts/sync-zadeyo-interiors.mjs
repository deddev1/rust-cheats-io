/**
 * Fetch Zadeyo product galleries and map cheat-visible interiors to our catalog.
 * Run: node scripts/sync-zadeyo-interiors.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dataDir = join(root, 'src', 'data')

const CHEAT_HOST = /wh-satano\.ru/i

/** Zadeyo API slug -> our catalog slug (only when slugs genuinely differ) */
const ZADEYO_TO_CATALOG = {
  BF6: 'battlefield-6',
  abi: 'arena-breakout-infinite',
  'ark-ascended': 'ark-survival-ascended',
  'black-desert-online': 'black-desert-mobile',
  dbd: 'dead-by-daylight',
  'conan-exiles': 'conan',
  'ea-sports-fc-2026': 'ea-sports-fc',
  'halo-infinite': 'halo',
  'insurgency-sandstorm': 'insurge',
  'myth-of-empires': 'moe',
  'path-of-exile': 'path-of-exile-2',
  'redm-rp': 'redm',
  'sand-raiders-of-sophie': 'sand',
  'star-wars-battlefront-2': 'swbf',
  'star-wars-zero-company-cheats': 'star-wars-zero-company',
  'the-rust-novaxware': 'rust',
  thefinals: 'the-finals',
  'wuthering-waves': 'wunthering',
}

function zadeyoSlugVariants(slug) {
  const out = [slug]
  const noNovax = slug.replace(/-novaxware$/i, '')
  if (noNovax !== slug) out.push(noNovax)
  const noCheats = slug.replace(/-cheats$/i, '')
  if (noCheats !== slug) out.push(noCheats)
  return out
}

function norm(s) {
  if (!s) return ''
  return s
    .toLowerCase()
    .replace(/-cheats$/, '')
    .replace(/[^a-z0-9]/g, '')
}

function loadOurCatalog() {
  const gamesSrc = readFileSync(join(dataDir, 'games.ts'), 'utf8')
  const pairs = [...gamesSrc.matchAll(/\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)]
  const slugs = pairs.map((m) => m[1])
  const normMap = new Map()
  for (const m of pairs) {
    normMap.set(norm(m[1]), m[1])
    normMap.set(norm(m[2]), m[1])
  }
  return { slugs, normMap }
}

function mapZadeyoToCatalog(zadeyoSlug, gameName, normMap) {
  for (const variant of zadeyoSlugVariants(zadeyoSlug)) {
    if (ZADEYO_TO_CATALOG[variant]) return ZADEYO_TO_CATALOG[variant]
    const n = norm(variant)
    if (normMap.has(n)) return normMap.get(n)
  }
  if (gameName && normMap.has(norm(gameName))) return normMap.get(norm(gameName))
  return null
}

function pickImage(gallery) {
  if (!gallery?.length) return { url: null, kind: 'none' }
  const cheat = gallery.find((u) => CHEAT_HOST.test(u))
  if (cheat) return { url: cheat, kind: 'cheat' }
  return { url: gallery[0], kind: 'stock' }
}

async function fetchProducts() {
  const res = await fetch('https://zadeyo.com/api/products?limit=500')
  if (!res.ok) throw new Error(`Zadeyo API ${res.status}`)
  const data = await res.json()
  return data.products || []
}

function escapeTs(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

async function main() {
  const { slugs: ourSlugs, normMap } = loadOurCatalog()
  const products = await fetchProducts()

  /** catalogSlug -> { url, kind, zadeyoSlug } — prefer cheat over stock */
  const interiors = new Map()
  const report = {
    fetchedAt: new Date().toISOString(),
    zadeyoProductCount: products.length,
    ourCatalogCount: ourSlugs.length,
    cheatShot: [],
    stockGallery: [],
    noGallery: [],
    zadeyoUnmapped: [],
  }

  for (const p of products) {
    const catalogSlug = mapZadeyoToCatalog(p.slug, p.game_name, normMap)
    const { url, kind } = pickImage(p.gallery_images)

    if (!catalogSlug) {
      report.zadeyoUnmapped.push({
        zadeyoSlug: p.slug,
        name: p.name || p.game_name,
        hasGallery: Boolean(p.gallery_images?.length),
      })
      continue
    }

    if (!url) {
      report.noGallery.push({
        catalogSlug,
        zadeyoSlug: p.slug,
        name: p.name || p.game_name,
      })
      continue
    }

    const existing = interiors.get(catalogSlug)
    const rank = kind === 'cheat' ? 2 : 1
    const existingRank = existing?.kind === 'cheat' ? 2 : existing ? 1 : 0
    if (rank >= existingRank) {
      interiors.set(catalogSlug, { url, kind, zadeyoSlug: p.slug })
    }
  }

  for (const [slug, { url, kind, zadeyoSlug }] of interiors) {
    const entry = { catalogSlug: slug, zadeyoSlug, url }
    if (kind === 'cheat') report.cheatShot.push(entry)
    else report.stockGallery.push(entry)
  }

  report.noGallery.sort((a, b) => a.catalogSlug.localeCompare(b.catalogSlug))
  report.cheatShot.sort((a, b) => a.catalogSlug.localeCompare(b.catalogSlug))
  report.stockGallery.sort((a, b) => a.catalogSlug.localeCompare(b.catalogSlug))

  const unmatchedOurs = ourSlugs.filter((s) => !interiors.has(s))
  report.ourCatalogNoInterior = unmatchedOurs.map((slug) => ({ catalogSlug: slug }))

  report.summary = {
    mappedTotal: interiors.size,
    cheatShot: report.cheatShot.length,
    stockGallery: report.stockGallery.length,
    noGallery: report.noGallery.length,
    ourCatalogNoInterior: unmatchedOurs.length,
    zadeyoUnmapped: report.zadeyoUnmapped.length,
  }

  const lines = [
    '/** Auto-generated by scripts/sync-zadeyo-interiors.mjs — do not edit by hand. */',
    '/** Re-run: node scripts/sync-zadeyo-interiors.mjs */',
    '',
    'export type InteriorKind = "cheat" | "stock"',
    '',
    'export const PRODUCT_INTERIOR_META: Record<string, { url: string; kind: InteriorKind }> = {',
  ]

  const sorted = [...interiors.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  for (const [slug, { url, kind }] of sorted) {
    lines.push(`  "${slug}": { url: "${escapeTs(url)}", kind: "${kind}" },`)
  }
  lines.push('}', '')

  writeFileSync(join(dataDir, 'product-interiors.ts'), lines.join('\n'))
  writeFileSync(join(dataDir, 'product-interiors-report.json'), JSON.stringify(report, null, 2))

  console.log('Summary:', report.summary)
  console.log('Wrote product-interiors.ts and product-interiors-report.json')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
