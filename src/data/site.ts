import { RUST_OG, PAGE_IMAGES } from './images'

export const SITE_URL = 'https://rustcheats.io'
export const SITE_NAME = 'Rust Cheats'
export const SITE_HOST = 'rustcheats.io'

/**
 * Sole purpose — used in schema + about copy.
 * Single-product site for Rust Cheats on Windows PC.
 */
export const SITE_PURPOSE =
  'Rust Cheats is the single product on rustcheats.io — player ESP, loot ESP, soft aim Aimbot, wallhack, HWID spoofer and live Undetected status for Facepunch’s Rust on Windows PC / Steam.'

export const SITE_ABOUT = [
  'Rust Cheats',
  'rust cheats',
  'Rust ESP',
  'Rust aimbot',
  'Rust wallhack',
  'Rust hacks',
  'Rust Steam',
  'Rust PC',
  'Rust survival',
  'Facepunch Rust',
  'Easy Anti-Cheat Rust',
] as const

/** Offer price shown on product schema + purchase UI. */
export const PRODUCT_PRICE_USD = '29.99'

export const SEO_REGIONS = [
  { hreflang: 'en', label: 'English' },
  { hreflang: 'x-default', label: 'Default' },
] as const

/** First-party branded social image. */
export const OG_IMAGE = RUST_OG

/** Shared terms — also used when a page has no custom keywords. */
export const DEFAULT_META_KEYWORDS =
  'rust cheats, rust hacks, rust esp, rust aimbot, rust wallhack, rust pc cheats, undetected rust cheats, rust soft aim, rust loot esp, buy rust cheats'

export type PageSeo = {
  title: string
  description: string
  path: string
  keywords?: string
  ogType?: 'website' | 'article' | 'product'
  image?: string
  robots?: string
}

/** Unique SEO per route — commercial / transactional intent. */
export const SEO = {
  home: {
    title: 'Rust Cheats — Aimbot, ESP & Hacks for PC',
    description:
      'Rust Cheats for Windows PC — soft aim Aimbot with FOV and smoothing, player and loot ESP, wallhack boxes, stream-proof overlays and live loader status on Steam.',
    keywords:
      'rust cheats, rust hacks, rust esp, rust aimbot, rust wallhack, rust cheats pc, undetected rust cheats, eac rust, steam rust cheats',
    path: '/',
    ogType: 'website',
    image: PAGE_IMAGES.home.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  forums: {
    title: 'Rust Cheats Guides | Setup, Hotkeys & Status',
    description:
      'Rust Cheats buyer guides for features, hotkeys, complete setup, antivirus exclusions and Undetected vs Updating loader status on current Steam Windows builds.',
    keywords:
      'rust cheats guide, rust hacks setup, rust loader, rust hotkeys, rust antivirus exclusion, rust undetected status',
    path: '/forums',
    ogType: 'website',
    image: PAGE_IMAGES.forums.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  reviews: {
    title: 'Rust Cheats Reviews | Before You Buy',
    description:
      'Player feedback on Rust Cheats ESP, soft aim Aimbot, wallhack, HWID spoofer honesty and post-patch rebuilds — read before you choose a license on rustcheats.io.',
    keywords:
      'rust cheats reviews, rust hacks reviews, buy rust cheats, rust esp review, undetected rust cheats review',
    path: '/reviews',
    ogType: 'website',
    image: PAGE_IMAGES.reviews.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  faq: {
    title: 'Rust Cheats FAQ | Compatibility, Setup & Status',
    description:
      'Answers on EAC status, ESP, Aimbot, wallhack, HWID spoofer, Steam compatibility, loading, support and refunds — clear FAQ before you checkout on rustcheats.io.',
    keywords:
      'rust cheats faq, rust hacks faq, rust esp faq, rust aimbot faq, rust undetected faq, buy rust cheats',
    path: '/faq',
    ogType: 'website',
    image: PAGE_IMAGES.faq.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  support: {
    title: 'Rust Cheats Support | Loader & Setup Help',
    description:
      'Rust Cheats support for digital delivery, Windows loader setup, antivirus exclusions, Updating windows and order-specific help after you buy on rustcheats.io.',
    keywords:
      'rust cheats support, rust hacks loader help, rust inject help, rust cheat delivery, rust setup support',
    path: '/support',
    ogType: 'website',
    image: PAGE_IMAGES.support.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  status: {
    title: 'Rust Cheats Status & Changelog | Undetected Log',
    description:
      'Live Rust Cheats loader status and dated changelog — Undetected vs Updating after every Rust and Easy Anti-Cheat patch before you buy or load on Steam.',
    keywords:
      'rust cheats status, rust undetected, rust updating, rust eac status, rust cheat changelog, rust loader status',
    path: '/status',
    ogType: 'website',
    image: PAGE_IMAGES.home.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  product: {
    title: 'Buy Rust Cheats — Aimbot, ESP & Hacks',
    description:
      'Buy Rust Cheats for Windows PC — soft aim Aimbot, player and loot ESP, wallhack, HWID spoofer, stream-proof overlays, live Undetected status and pricing.',
    keywords:
      'buy rust cheats, rust hacks price, rust esp cheat, rust aimbot, rust wallhack, rust undetected cheat',
    path: '/rust-cheats',
    ogType: 'product',
    image: PAGE_IMAGES.product.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
} as const satisfies Record<string, PageSeo>

export const HOME_HEADINGS = {
  h1: 'Rust Cheats — Aimbot, ESP & Hacks',
  lead:
    'Rust Cheats for Windows PC — soft aim Aimbot with FOV and smoothing, player and loot ESP, wallhack boxes, stream-proof overlays and live loader status on Steam.',
  h2Features: 'Rust Aimbot, ESP, loot ESP & wallhack',
  h2Featured: 'Rust ESP and soft aim',
  h2About: 'Built for current Rust wipes and patches',
  h2Access: 'Get Rust Cheats',
  h2Faq: 'Rust Cheats FAQ',
} as const

export function absoluteUrl(path: string) {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
