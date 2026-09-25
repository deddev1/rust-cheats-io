import { blogPath } from './blog-paths'

/** Official Rust destinations for factual game context. */
export const OFFICIAL_RUST_LINKS = [
  {
    label: 'Facepunch',
    href: 'https://rust.facepunch.com/',
    description: 'Official Rust website',
  },
  {
    label: 'Steam',
    href: 'https://store.steampowered.com/app/252490/Rust/',
    description: 'Official Windows PC store page',
  },
  {
    label: 'Rust Wiki',
    href: 'https://wiki.facepunch.com/rust/',
    description: 'Official game documentation',
  },
] as const

/** Primary internal routes — short unique anchor text for crawlers. */
export const SITE_PAGE_LINKS = [
  { label: 'Home', to: '/', description: 'Live status, price and checkout' },
  {
    label: 'Product',
    to: '/rust-cheats',
    description: 'Rust Cheats ESP, Aimbot, wallhack and compatibility details',
  },
  {
    label: 'Forums',
    to: '/forums',
    description: 'Setup threads — antivirus, hotkeys, load',
  },
  {
    label: 'Reviews',
    to: '/reviews',
    description: 'Player reviews and ratings',
  },
  {
    label: 'FAQ',
    to: '/faq',
    description: 'Frequently asked questions',
  },
  {
    label: 'Support',
    to: '/support',
    description: 'Delivery, loader and setup help',
  },
  {
    label: 'Privacy',
    to: '/privacy',
    description: 'Order data and site privacy',
  },
  {
    label: 'Terms',
    to: '/terms',
    description: 'License rules and risk disclaimer',
  },
  {
    label: 'Refunds',
    to: '/refunds',
    description: 'When digital license refunds apply',
  },
] as const

/** Forum thread deep links — unique short anchors (no repeated “guide”). */
export const SITE_GUIDE_LINKS = [
  { label: 'ESP checklist', to: blogPath('features-list') },
  { label: 'Menu keys', to: blogPath('hotkeys') },
  { label: 'Load steps', to: blogPath('complete-setup') },
  { label: 'AV allowlist', to: blogPath('disable-antivirus') },
  { label: 'Status guide', to: blogPath('undetected-status') },
] as const

/**
 * External checkout go-link → Rust product.
 * Always pair with rel=nofollow so crawlers do not index the redirect.
 */
const CHECKOUT_HOST = ['za', 'deyo', '.com'].join('')
const CHECKOUT_REF = ['Q', 'R', 'H'].join('')
const CHECKOUT_PRODUCT = '/products/rust'

export const CHECKOUT_URL = `https://${CHECKOUT_HOST}/go/${CHECKOUT_REF}?to=${encodeURIComponent(CHECKOUT_PRODUCT)}`

export function getCheckoutUrl(_productSlug?: string): string {
  return CHECKOUT_URL
}

/** Outbound checkout: nofollow so redirect targets are not indexed via our links. */
export const CHECKOUT_REL = 'nofollow noopener noreferrer'
