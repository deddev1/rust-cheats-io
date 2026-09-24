import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = join(import.meta.dirname, '..')
const dist = join(root, 'dist')
const site = 'https://rustcheats.io'
const failures = []

if (!existsSync(dist)) {
  console.error('SEO verification failed: dist/ missing — run npm run build first')
  process.exit(1)
}

function fail(message) {
  failures.push(message)
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : []
  })
}

function pageUrl(file) {
  const page = relative(dist, file).replaceAll('\\', '/')
  if (page === 'index.html') return `${site}/`
  if (page.endsWith('/index.html')) return `${site}/${page.slice(0, -11)}`
  return `${site}/${page.slice(0, -5)}`
}

/** JSON-LD only — ignore `<meta name="keywords">` and other non-schema markup. */
function jsonLdFromHtml(html) {
  const chunks = []
  const pattern = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  for (const match of html.matchAll(pattern)) {
    chunks.push(match[1])
  }
  return chunks.join('\n')
}

const keywordListInJsonLd = /"@type"\s*:\s*"KeywordList"/
const metaKeywordsSample = '<meta name="keywords" content="rust cheats">'
if (keywordListInJsonLd.test(metaKeywordsSample)) {
  fail('verify-seo regression: meta keywords must not match KeywordList detector')
}

const files = htmlFiles(dist)
const titles = new Map()
const descriptions = new Map()

for (const file of files) {
  const html = readFileSync(file, 'utf8')
  const page = relative(dist, file).replaceAll('\\', '/')
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
  const canonicalUrl = pageUrl(file)

  if (h1Count !== 1) fail(`${page}: expected one H1, found ${h1Count}`)
  if (!title) fail(`${page}: missing title`)
  else if (titles.has(title)) fail(`${page}: duplicate title also used by ${titles.get(title)}`)
  else titles.set(title, page)
  if (!description) fail(`${page}: missing description`)
  else if (descriptions.has(description)) {
    fail(`${page}: duplicate description also used by ${descriptions.get(description)}`)
  } else descriptions.set(description, page)

  if (page !== '404.html') {
    if (!html.includes(`rel="canonical" href="${canonicalUrl}"`)) {
      fail(`${page}: missing self-referencing canonical ${canonicalUrl}`)
    }
    if (!html.includes(`hreflang="en" href="${canonicalUrl}"`)) {
      fail(`${page}: missing self-referencing hreflang=en`)
    }
    if (!html.includes(`hreflang="x-default" href="${canonicalUrl}"`)) {
      fail(`${page}: missing self-referencing hreflang=x-default`)
    }
  }

  if (html.includes('assets-prd.ignimgs.com')) fail(`${page}: contains third-party IGN image`)
  if (html.includes('cdn.cosmocheats.com')) fail(`${page}: contains third-party media hotlink`)
  if (html.includes('SearchAction')) fail(`${page}: contains invalid SearchAction`)
  if (keywordListInJsonLd.test(jsonLdFromHtml(html))) {
    fail(`${page}: contains KeywordList structured data`)
  }
  if (/forums\/(instructions|how-to-load)/.test(html)) {
    fail(`${page}: links to a retired forum route`)
  }
}

const home = readFileSync(join(dist, 'index.html'), 'utf8')
const product = readFileSync(join(dist, 'rust-cheats', 'index.html'), 'utf8')
const reviews = readFileSync(join(dist, 'reviews', 'index.html'), 'utf8')
const faq = readFileSync(join(dist, 'faq', 'index.html'), 'utf8')
const support = readFileSync(join(dist, 'support', 'index.html'), 'utf8')
const importantPages = [
  home,
  product,
  reviews,
  faq,
  support,
  readFileSync(join(dist, 'forums', 'index.html'), 'utf8'),
]

if (!home.includes('name="keywords"') || !home.includes('rust cheats')) {
  fail('Homepage must include meta keywords with rust cheats')
}
if (!home.includes('<title>Rust Cheats — Aimbot, ESP &amp; Hacks for PC</title>')) {
  fail('Homepage does not own the brand/category title')
}
if (!product.includes('<title>Buy Rust Cheats')) {
  fail('Product page must own transactional Buy Rust Cheats title')
}
if (!product.includes('<title>Buy Rust Cheats — Aimbot, ESP &amp; Hacks</title>')) {
  fail('Product page title must be Buy Rust Cheats — Aimbot, ESP & Hacks')
}
if ((faq.match(/"@type":"FAQPage"/g) || []).length !== 1) fail('/faq must own one FAQPage')
for (const [name, html] of [
  ['home', home],
  ['product', product],
  ['reviews', reviews],
  ['support', support],
]) {
  if (html.includes('"@type":"FAQPage"')) fail(`${name}: duplicate FAQPage schema`)
}
for (const [name, html] of [
  ['home', home],
  ['product', product],
]) {
  if (!html.includes('"@id":"https://rustcheats.io/rust-cheats#product"')) {
    fail(`${name}: missing shared Product ID on /rust-cheats#product`)
  }
}
if (home.includes('"@type":"Product"')) {
  fail('Homepage must not define a Product node (reference Product @id only)')
}
if (reviews.includes('"@type":"Review"') || reviews.includes('"@type":"AggregateRating"')) {
  fail('/reviews must not emit Review or AggregateRating schema (on-page reviews only)')
}
if (home.includes('"@type":"Offer"')) fail('Homepage must not emit Offer schema')
if (!product.includes('"@type":"Offer"')) fail('Product page must emit Offer schema')
if (support.includes('noindex')) fail('Support page must be indexable')
for (const file of files) {
  const page = relative(dist, file).replaceAll('\\', '/')
  if (page === '404.html') continue
  const html = readFileSync(file, 'utf8')
  if (html.includes('content="noindex')) fail(`${page}: content page must not be noindex`)
}
for (const html of importantPages) {
  if (
    !html.includes('/media/rust-') &&
    !html.includes('/videos/rust-') &&
    !html.includes('rust-hero-poster')
  ) {
    fail('An important indexed page is missing visible Rust media')
  }
}

const CHILD_SITEMAPS = [
  'sitemap-pages.xml',
  'sitemap-products.xml',
  'sitemap-forums.xml',
  'sitemap-images.xml',
]
const STALE_SITEMAPS = [
  'sitemap-blogs.xml',
  'sitemap-regions.xml',
  'sitemap-index.xml',
  'sitemap_index.xml',
]
const sitemapRoot = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
if (!sitemapRoot.includes('<urlset')) fail('sitemap.xml must be a urlset')
if (sitemapRoot.includes('<sitemapindex') || /<html[\s>]/i.test(sitemapRoot)) {
  fail('sitemap.xml must not be a sitemapindex or HTML document')
}
if (sitemapRoot.includes('xml-stylesheet')) {
  fail('sitemap.xml must not embed xml-stylesheet (Worker injects it for browsers only)')
}
if (!sitemapRoot.trimStart().startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
  fail('sitemap.xml must start with an XML declaration')
}
for (const child of CHILD_SITEMAPS) {
  if (!existsSync(join(dist, child))) fail(`dist/${child} is missing`)
}

const expectedUrls = new Set(
  files
    .filter((file) => relative(dist, file).replaceAll('\\', '/') !== '404.html')
    .map(pageUrl),
)

const parsePageLocs = (xml) =>
  [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
const requiredImages = [
  '/media/rust-soldier-hero.jpg',
  '/media/rust-monument.jpg',
  '/media/rust-raid-party.jpg',
  '/media/rust-product-hero.webp',
  '/media/rust-product-cover.webp',
  '/og/rust-cheats.jpg',
  '/media/rust-hero-poster.jpg',
]

const contentPageLocs = []
const allImageLocs = []
for (const child of CHILD_SITEMAPS) {
  const path = join(dist, child)
  if (!existsSync(path)) fail(`dist/${child} is missing`)
  const xml = readFileSync(path, 'utf8')
  if (xml.includes('<sitemapindex')) fail(`${child} must be a urlset, not an index`)
  if (/forums\/(instructions|how-to-load)/.test(xml)) fail(`Retired forum remains in ${child}`)
  if (!xml.trimStart().startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    fail(`${child} must start with an XML declaration`)
  }
  if (xml.includes('xml-stylesheet')) {
    fail(`${child} must not embed xml-stylesheet (Worker injects it for browsers only)`)
  }
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || []
  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] || '(unknown)'
    if (!block.includes('<image:image>') || !block.includes('<image:loc>')) {
      fail(`${child} URL missing image entry: ${loc}`)
    }
  }
  const pageLocs = parsePageLocs(xml)
  const imageLocs = [...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1])
  allImageLocs.push(...imageLocs)
  if (child !== 'sitemap-images.xml') contentPageLocs.push(...pageLocs)
}

const uniqueContentUrls = new Set(contentPageLocs)
for (const url of expectedUrls) {
  if (!uniqueContentUrls.has(url)) fail(`Child sitemaps missing built page ${url}`)
}
for (const url of uniqueContentUrls) {
  if (!expectedUrls.has(url)) fail(`Child sitemap contains URL without a built page: ${url}`)
}
if (uniqueContentUrls.size !== contentPageLocs.length) {
  fail('Content sitemaps contain duplicate page URLs')
}
if (uniqueContentUrls.size !== expectedUrls.size) {
  fail(`Content sitemaps must list exactly ${expectedUrls.size} built page URLs`)
}
for (const image of requiredImages) {
  if (!allImageLocs.some((loc) => loc.endsWith(image))) {
    fail(`Sitemaps missing required image ${image}`)
  }
}
for (const stale of STALE_SITEMAPS) {
  if (existsSync(join(dist, stale))) fail(`Stale sitemap still published: ${stale}`)
}

if (!existsSync(join(dist, 'sitemap.xml'))) fail('dist/sitemap.xml is missing')
if (!existsSync(join(dist, 'robots.txt'))) fail('dist/robots.txt is missing')
if (!existsSync(join(dist, '_routes.json'))) fail('dist/_routes.json is missing')

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8')
if (!robots.includes(`Sitemap: ${site}/sitemap.xml`)) {
  fail('robots.txt must declare the sitemap index Sitemap: …/sitemap.xml')
}
for (const child of CHILD_SITEMAPS) {
  if (!robots.includes(`Sitemap: ${site}/${child}`)) {
    fail(`robots.txt must declare Sitemap: ${site}/${child}`)
  }
}
if (!robots.includes('Allow: /sitemap.xml')) {
  fail('robots.txt must explicitly allow /sitemap.xml')
}
for (const child of CHILD_SITEMAPS) {
  if (!robots.includes(`Allow: /${child}`)) {
    fail(`robots.txt must explicitly allow /${child}`)
  }
}
if (!robots.includes('User-agent: Googlebot')) {
  fail('robots.txt must explicitly allow Googlebot')
}

const routes = JSON.parse(readFileSync(join(dist, '_routes.json'), 'utf8'))
if (!routes.exclude?.includes('/sitemap.xml') || !routes.exclude?.includes('/robots.txt')) {
  fail('_routes.json must exclude /sitemap.xml and /robots.txt from Functions')
}
for (const child of CHILD_SITEMAPS) {
  if (!routes.exclude?.includes(`/${child}`)) {
    fail(`_routes.json must exclude /${child} from Functions`)
  }
}

for (const asset of [
  'public/og/rust-cheats.jpg',
  'public/media/rust-product-hero.webp',
  'public/media/rust-product-cover.webp',
  'public/media/rust-soldier-hero.jpg',
  'public/media/rust-monument.jpg',
  'public/media/rust-raid-party.jpg',
  'public/media/rust-hero-poster.jpg',
  'public/media/rust-hero-poster-640w.webp',
  'public/media/rust-hero-poster-960w.webp',
  'public/media/rust-hero-poster-1280w.webp',
  'public/media/rust-soldier-hero-800w.webp',
  'public/media/rust-monument-800w.webp',
  'public/media/rust-raid-party-800w.webp',
  'public/sitemap.css',
  'public/_routes.json',
  'functions/_middleware.js',
]) {
  if (!existsSync(join(root, asset))) fail(`Missing first-party asset: ${asset}`)
}

const heroFootage = join(root, 'public', 'videos', 'rust-hero.mp4')
if (existsSync(heroFootage)) {
  for (const asset of ['public/videos/rust-card-loop.mp4', 'public/videos/rust-product-preview.mp4']) {
    if (!existsSync(join(root, asset))) fail(`Missing first-party asset: ${asset}`)
  }
}

const redirects = readFileSync(join(root, 'public', '_redirects'), 'utf8')
if (!redirects.includes('/sitemap-index.xml')) {
  fail('_redirects missing sitemap-index.xml → /sitemap.xml redirect')
}
if (redirects.includes('/sitemap-pages.xml     /sitemap.xml')) {
  fail('_redirects must not redirect live child sitemap sitemap-pages.xml')
}
if (redirects.includes('/sitemap-products.xml  /sitemap.xml')) {
  fail('_redirects must not redirect live child sitemap sitemap-products.xml')
}

const headers = readFileSync(join(root, 'public', '_headers'), 'utf8')
if (!headers.includes('Content-Type: text/html; charset=utf-8')) {
  fail('_headers missing HTML charset Content-Type')
}
if (!headers.includes('/sitemap.xml')) {
  fail('_headers missing /sitemap.xml Content-Type')
}
for (const child of CHILD_SITEMAPS) {
  if (!headers.includes(`/${child}`)) {
    fail(`_headers missing /${child} Content-Type`)
  }
}
if (!headers.includes('application/xml; charset=utf-8')) {
  fail('_headers missing XML charset Content-Type')
}

if (failures.length) {
  throw new Error(`SEO verification failed:\n- ${failures.join('\n- ')}`)
}

console.log(`SEO verification passed: ${files.length} HTML files, 5 forums, 12 reviews`)
