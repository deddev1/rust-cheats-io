/**
 * Four child sitemaps + root /sitemap.xml urlset (GSC-friendly; not an HTML page).
 */
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const dataDir = join(root, 'src', 'data')
const pagesDir = join(root, 'src', 'pages')
const SITE = (process.env.SITE_URL || 'https://rustcheats.io').replace(/\/$/, '')
const TODAY = new Date().toLocaleDateString('en-CA')
const HREFLANG = ['en', 'x-default']

const SOLDIER = '/media/rust-soldier-hero.jpg'
const TACTICAL = '/media/rust-monument.jpg'
const OBJECTIVE = '/media/rust-raid-party.jpg'
const PRODUCT_HERO = '/media/rust-product-hero.webp'
const PRODUCT_COVER = '/media/rust-product-cover.webp'
const BUY_CARD = '/media/rust-product-buy-card.webp'
const PRODUCT_POSTER = '/media/rust-product-preview-poster.jpg'
const OG_DEFAULT = '/og/rust-cheats.jpg'
const HERO_POSTER = '/media/rust-hero-poster.jpg'

export const CHILD_SITEMAPS = [
  'sitemap-pages.xml',
  'sitemap-products.xml',
  'sitemap-forums.xml',
  'sitemap-images.xml',
]

/** All indexable still images — must appear in sitemap-images.xml (and across site). */
const ALL_SITE_IMAGES = [
  SOLDIER,
  TACTICAL,
  OBJECTIVE,
  PRODUCT_HERO,
  PRODUCT_COVER,
  BUY_CARD,
  PRODUCT_POSTER,
  OG_DEFAULT,
  HERO_POSTER,
]

const FORUM_IMAGES = {
  'features-list': PRODUCT_POSTER,
  hotkeys: HERO_POSTER,
  'complete-setup': OBJECTIVE,
  'disable-antivirus': TACTICAL,
  'undetected-status': SOLDIER,
}

/** Page URL where each image is primarily used (image sitemap requires a page loc). */
const IMAGE_PAGE_FOR = {
  [SOLDIER]: '/',
  [TACTICAL]: '/reviews',
  [OBJECTIVE]: '/faq',
  [PRODUCT_HERO]: '/rust-cheats',
  [PRODUCT_COVER]: '/rust-cheats',
  [BUY_CARD]: '/rust-cheats',
  [PRODUCT_POSTER]: '/rust-cheats',
  [OG_DEFAULT]: '/',
  [HERO_POSTER]: '/',
}

const IMAGE_META = {
  [SOLDIER]: {
    title: 'Rust Cheats gameplay screenshot',
    caption: 'In-game ESP and radar preview from Rust Cheats gameplay video.',
  },
  [TACTICAL]: {
    title: 'Rust Cheats review gameplay still',
    caption: 'Cheat gameplay still used on the reviews page.',
  },
  [OBJECTIVE]: {
    title: 'Rust Cheats ESP gameplay still',
    caption: 'ESP overlay gameplay still from the Rust Cheats video.',
  },
  [PRODUCT_HERO]: {
    title: 'Rust Cheats product gameplay preview',
    caption: 'In-match ESP and radar on the product page.',
  },
  [PRODUCT_COVER]: {
    title: 'Rust Cheats product cover still',
    caption: 'Gameplay still used as the product cover image.',
  },
  [BUY_CARD]: {
    title: 'Rust Cheats purple product box',
    caption: 'Purple-themed RUST CHEATS product box on the buy card.',
  },
  [PRODUCT_POSTER]: {
    title: 'Rust Cheats video poster',
    caption: 'Poster frame from the Rust Cheats gameplay preview video.',
  },
  [OG_DEFAULT]: {
    title: 'Rust Cheats social preview',
    caption: 'Open Graph image for rustcheats.io.',
  },
  [HERO_POSTER]: {
    title: 'Rust Cheats hero video poster',
    caption: 'Poster frame for the homepage hero gameplay clip.',
  },
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function siteUrl(path) {
  return !path || path === '/' ? `${SITE}/` : `${SITE}${path.startsWith('/') ? path : `/${path}`}`
}

function loadGames() {
  const src = readFileSync(join(dataDir, 'games.ts'), 'utf8')
  return [...src.matchAll(/\{\s*slug:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g)].map(
    (match) => ({ slug: match[1], name: match[2] }),
  )
}

function loadForums() {
  const src = readFileSync(join(dataDir, 'blogs.ts'), 'utf8')
  const pattern =
    /slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],[\s\S]*?date:\s*['"](\d{4}-\d{2}-\d{2})['"]/g
  return [...src.matchAll(pattern)].map((match) => ({
    slug: match[1],
    title: match[2],
    date: match[3],
  }))
}

function loadStaticRoutes() {
  return readdirSync(pagesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.astro') && entry.name !== '404.astro')
    .map((entry) => (entry.name === 'index.astro' ? '/' : `/${entry.name.slice(0, -6)}`))
}

function alternateLinks(url) {
  return HREFLANG.map(
    (language) =>
      `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(url)}" />`,
  ).join('\n')
}

function imageBlock({ src, title, caption }) {
  return `    <image:image>
      <image:loc>${escapeXml(siteUrl(src))}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
    </image:image>`
}

function urlEntry({ path, priority, changefreq, lastmod = TODAY, images }) {
  if (!images?.length) {
    throw new Error(`Sitemap entry for ${path} is missing images`)
  }
  const url = siteUrl(path)
  const imageXml = images.map((image) => imageBlock(image)).join('\n')
  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternateLinks(url)}
${imageXml}
  </url>`
}

function wrapUrlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`
}

function buildPagesSitemap() {
  const entries = [
    urlEntry({
      path: '/',
      priority: '1.0',
      changefreq: 'daily',
      images: [
        { src: SOLDIER, ...IMAGE_META[SOLDIER] },
        { src: PRODUCT_COVER, ...IMAGE_META[PRODUCT_COVER] },
        { src: HERO_POSTER, ...IMAGE_META[HERO_POSTER] },
        { src: OG_DEFAULT, ...IMAGE_META[OG_DEFAULT] },
      ],
    }),
    urlEntry({
      path: '/reviews',
      priority: '0.8',
      changefreq: 'weekly',
      images: [{ src: TACTICAL, ...IMAGE_META[TACTICAL] }],
    }),
    urlEntry({
      path: '/faq',
      priority: '0.75',
      changefreq: 'monthly',
      images: [{ src: OBJECTIVE, ...IMAGE_META[OBJECTIVE] }],
    }),
    urlEntry({
      path: '/support',
      priority: '0.75',
      changefreq: 'weekly',
      images: [
        {
          src: PRODUCT_POSTER,
          title: 'Rust Cheats support gameplay still',
          caption: 'Gameplay still for Rust Cheats loader setup and delivery support.',
        },
      ],
    }),
    urlEntry({
      path: '/status',
      priority: '0.85',
      changefreq: 'daily',
      images: [
        {
          src: SOLDIER,
          title: 'Rust Cheats live status',
          caption: 'Status and changelog page for Undetected vs Updating after EAC patches.',
        },
      ],
    }),
    urlEntry({
      path: '/privacy',
      priority: '0.4',
      changefreq: 'yearly',
      images: [{ src: OG_DEFAULT, ...IMAGE_META[OG_DEFAULT] }],
    }),
    urlEntry({
      path: '/terms',
      priority: '0.4',
      changefreq: 'yearly',
      images: [{ src: OG_DEFAULT, ...IMAGE_META[OG_DEFAULT] }],
    }),
    urlEntry({
      path: '/refunds',
      priority: '0.45',
      changefreq: 'yearly',
      images: [{ src: OG_DEFAULT, ...IMAGE_META[OG_DEFAULT] }],
    }),
  ]
  return wrapUrlset(entries)
}

function buildProductsSitemap(games) {
  const entries = games.map((game) =>
    urlEntry({
      path: `/${game.slug}-cheats`,
      priority: '0.9',
      changefreq: 'weekly',
      images: [
        { src: PRODUCT_HERO, ...IMAGE_META[PRODUCT_HERO] },
        { src: PRODUCT_COVER, ...IMAGE_META[PRODUCT_COVER] },
        { src: OBJECTIVE, ...IMAGE_META[OBJECTIVE] },
        { src: OG_DEFAULT, ...IMAGE_META[OG_DEFAULT] },
      ],
    }),
  )
  return wrapUrlset(entries)
}

function buildForumsSitemap(forums) {
  const entries = [
    urlEntry({
      path: '/forums',
      priority: '0.85',
      changefreq: 'weekly',
      images: [{ src: OBJECTIVE, title: 'Rust Cheats guides', caption: 'Forum index artwork.' }],
    }),
    ...forums.map((forum) =>
      urlEntry({
        path: `/forums/${forum.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: forum.date,
        images: [
          {
            src: FORUM_IMAGES[forum.slug] || OBJECTIVE,
            title: `${forum.title} guide artwork`,
            caption: `Guide artwork for ${forum.title}.`,
          },
        ],
      }),
    ),
  ]
  return wrapUrlset(entries)
}

function buildImagesSitemap() {
  /** One <url> per page with all images nested — avoids duplicate locs for /rust-cheats. */
  const byPath = new Map()
  for (const src of ALL_SITE_IMAGES) {
    const path = IMAGE_PAGE_FOR[src]
    if (!byPath.has(path)) byPath.set(path, [])
    byPath.get(path).push({ src, ...IMAGE_META[src] })
  }
  const entries = [...byPath.entries()].map(([path, images]) =>
    urlEntry({
      path,
      priority: path === '/' ? '0.6' : '0.5',
      changefreq: 'monthly',
      images,
    }),
  )
  return wrapUrlset(entries)
}

function extractUrlBlocks(urlsetXml) {
  return urlsetXml.match(/  <url>[\s\S]*?<\/url>/g) || []
}

/** Single crawler-facing sitemap — full urlset (not an index) so GSC never sees HTML 404 as “sitemap”. */
function buildRootSitemap(games, forums) {
  const blocks = [
    ...extractUrlBlocks(buildPagesSitemap()),
    ...extractUrlBlocks(buildProductsSitemap(games)),
    ...extractUrlBlocks(buildForumsSitemap(forums)),
  ]
  const seen = new Set()
  const unique = []
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]
    if (!loc || seen.has(loc)) continue
    seen.add(loc)
    unique.push(block)
  }
  return wrapUrlset(unique)
}

function parsePageLocs(xml) {
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

function parseImageLocs(xml) {
  return [...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1])
}

function validate(games, forums, staticRoutes, files) {
  const errors = []
  if (forums.some((forum) => ['instructions', 'how-to-load'].includes(forum.slug))) {
    errors.push('Retired forum slug remains indexed')
  }

  for (const game of games) {
    const page = join(pagesDir, `${game.slug}-cheats.astro`)
    if (!existsSync(page)) errors.push(`Product route has no page file: /${game.slug}-cheats`)
  }

  for (const image of ALL_SITE_IMAGES) {
    const diskPath = join(publicDir, image.replace(/^\//, ''))
    if (!existsSync(diskPath)) errors.push(`Missing image asset on disk: ${image}`)
  }

  const expectedRoutes = new Set([
    ...staticRoutes,
    ...games.map((game) => `/${game.slug}-cheats`),
    ...forums.map((forum) => `/forums/${forum.slug}`),
  ])
  const expectedUrls = new Set([...expectedRoutes].map(siteUrl))

  const root = files['sitemap.xml']
  if (!root.includes('<urlset')) {
    errors.push('sitemap.xml must be a urlset (not HTML, not a bare index-only file)')
  }
  if (root.includes('<sitemapindex') || root.includes('<html')) {
    errors.push('sitemap.xml must not be a sitemapindex or HTML document')
  }
  if (root.includes('xml-stylesheet')) {
    errors.push('sitemap.xml must not embed xml-stylesheet')
  }
  for (const name of CHILD_SITEMAPS) {
    if (files[name].includes('<sitemapindex')) {
      errors.push(`${name} must be a urlset, not an index`)
    }
    if (files[name].includes('<html') || files[name].includes('xml-stylesheet')) {
      errors.push(`${name} must be plain XML without HTML/stylesheet`)
    }
  }

  const imageLocs = ['sitemap.xml', ...CHILD_SITEMAPS].flatMap((name) =>
    parseImageLocs(files[name]),
  )
  const contentLocs = CHILD_SITEMAPS.filter((n) => n !== 'sitemap-images.xml').flatMap((n) =>
    parsePageLocs(files[n]),
  )
  const rootLocs = parsePageLocs(root)
  const uniqueContent = new Set(contentLocs)
  const uniqueRoot = new Set(rootLocs)

  if (uniqueRoot.size !== expectedUrls.size) {
    errors.push(
      `sitemap.xml expected ${expectedUrls.size} unique page URLs, found ${uniqueRoot.size}`,
    )
  }
  for (const url of expectedUrls) {
    if (!uniqueRoot.has(url)) errors.push(`sitemap.xml missing page URL: ${url}`)
    if (!uniqueContent.has(url)) errors.push(`Page URL missing from content sitemaps: ${url}`)
  }

  const dupCheck = new Set()
  for (const loc of contentLocs) {
    if (dupCheck.has(loc)) errors.push(`Duplicate page URL across content sitemaps: ${loc}`)
    dupCheck.add(loc)
  }

  for (const loc of contentLocs) {
    if (!expectedUrls.has(loc)) errors.push(`Unexpected page URL in content sitemaps: ${loc}`)
  }

  for (const name of CHILD_SITEMAPS) {
    const blocks = files[name].match(/<url>[\s\S]*?<\/url>/g) || []
    for (const block of blocks) {
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] || '(unknown)'
      if (!block.includes('<image:image>') || !block.includes('<image:loc>')) {
        errors.push(`${name}: URL missing image entry: ${loc}`)
      }
    }
  }

  for (const image of ALL_SITE_IMAGES) {
    const absolute = siteUrl(image)
    if (!imageLocs.includes(absolute)) {
      errors.push(`Sitemaps missing required image: ${image}`)
    }
  }

  if (errors.length) throw new Error(`Sitemap validation failed:\n- ${errors.join('\n- ')}`)
}

function main() {
  const games = loadGames()
  const forums = loadForums()
  const staticRoutes = loadStaticRoutes()

  const files = {
    'sitemap-pages.xml': buildPagesSitemap(),
    'sitemap-products.xml': buildProductsSitemap(games),
    'sitemap-forums.xml': buildForumsSitemap(forums),
    'sitemap-images.xml': buildImagesSitemap(),
    'sitemap.xml': buildRootSitemap(games, forums),
  }

  validate(games, forums, staticRoutes, files)

  for (const [name, xml] of Object.entries(files)) {
    writeFileSync(join(publicDir, name), xml, 'utf8')
  }

  const sitemapLines = [
    'User-agent: Googlebot',
    'Allow: /',
    ...CHILD_SITEMAPS.map((n) => `Allow: /${n}`),
    'Allow: /sitemap.xml',
    'Allow: /robots.txt',
    '',
    'User-agent: Google-InspectionTool',
    'Allow: /',
    ...CHILD_SITEMAPS.map((n) => `Allow: /${n}`),
    'Allow: /sitemap.xml',
    'Allow: /robots.txt',
    '',
    'User-agent: *',
    'Allow: /',
    ...CHILD_SITEMAPS.map((n) => `Allow: /${n}`),
    'Allow: /sitemap.xml',
    'Allow: /robots.txt',
    '',
    `Sitemap: ${siteUrl('/sitemap.xml')}`,
    `Sitemap: ${siteUrl('/sitemap-pages.xml')}`,
    `Sitemap: ${siteUrl('/sitemap-products.xml')}`,
    `Sitemap: ${siteUrl('/sitemap-forums.xml')}`,
    `Sitemap: ${siteUrl('/sitemap-images.xml')}`,
    '',
  ]

  writeFileSync(join(publicDir, 'robots.txt'), sitemapLines.join('\n'), 'utf8')

  const stale = [
    'sitemap-blogs.xml',
    'sitemap-regions.xml',
    'sitemap-index.xml',
    'sitemap_index.xml',
  ]
  for (const name of stale) {
    for (const dir of [publicDir, join(root, 'dist')]) {
      const path = join(dir, name)
      if (existsSync(path)) unlinkSync(path)
    }
  }

  const urlCount = CHILD_SITEMAPS.reduce(
    (n, name) => n + (files[name].match(/<url>/g) || []).length,
    0,
  )
  console.log(
    `Sitemap OK: root urlset + ${CHILD_SITEMAPS.length} children, ${urlCount} child <url> rows (${expectedUrlCount(games, forums, staticRoutes)} indexable pages)`,
  )
}

function expectedUrlCount(games, forums, staticRoutes) {
  const routes = new Set([
    ...staticRoutes,
    ...games.map((game) => `/${game.slug}-cheats`),
    ...forums.map((forum) => `/forums/${forum.slug}`),
  ])
  return routes.size
}

main()
