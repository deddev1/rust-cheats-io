import type { FaqItem } from '../data/faqs'
import {
  OG_IMAGE,
  PRODUCT_PRICE_USD,
  SEO_REGIONS,
  SITE_ABOUT,
  SITE_NAME,
  SITE_PURPOSE,
  SITE_URL,
  absoluteUrl,
  type PageSeo,
} from '../data/site'
import type { GameStatus } from '../data/games'
import { PAGE_MEDIA } from '../data/media'

export const PRODUCT_ID = `${SITE_URL}/rust-cheats#product`

function absoluteAsset(src: string) {
  return src.startsWith('http') ? src : `${SITE_URL}${src.startsWith('/') ? src : `/${src}`}`
}

/** Stable Organization + WebSite identity for every page. */
export function siteIdentityGraph() {
  return [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: [
        'rust cheats',
        'rust hacks',
        'rust cheats for pc',
        'rustcheats',
        SITE_URL.replace('https://', ''),
      ],
      url: SITE_URL,
      description: SITE_PURPOSE,
      knowsAbout: [...SITE_ABOUT],
      brand: { '@type': 'Brand', name: SITE_NAME },
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
        width: 48,
        height: 46,
      },
      image: absoluteAsset(OG_IMAGE),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_PURPOSE,
      inLanguage: 'en',
      about: {
        '@type': 'Thing',
        name: 'Rust Cheats',
        description:
          'Rust Cheats only — ESP, soft aim Aimbot, wallhack and live EAC status for Rust on Steam.',
      },
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ]
}

export function webPageNode(seo: PageSeo) {
  const img = seo.image || OG_IMAGE
  const page = {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(seo.path)}#webpage`,
    url: absoluteUrl(seo.path),
    name: seo.title,
    description: seo.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
  } as Record<string, unknown>
  const hasVisibleImage =
    ['/', '/rust-cheats', '/forums', '/reviews', '/faq', '/support', '/status'].includes(seo.path) ||
    seo.path.startsWith('/forums/')
  if (hasVisibleImage) {
    page.primaryImageOfPage = {
      '@type': 'ImageObject',
      url: absoluteAsset(img),
      width: 800,
      height: 450,
      caption: seo.title,
    }
  }
  // Point brand/product pages at the canonical Product entity (Offer only on /rust-cheats)
  if (seo.path === '/' || seo.path === '/rust-cheats') {
    page.mainEntity = { '@id': PRODUCT_ID }
  }
  return page
}

/** Shared Product entity — lives on /rust-cheats (no Offer here). */
export function productCoreJsonLd() {
  return {
    '@type': 'Product',
    '@id': PRODUCT_ID,
    name: SITE_NAME,
    description: SITE_PURPOSE,
    url: `${SITE_URL}/rust-cheats`,
    image: absoluteAsset(PAGE_MEDIA.product.image),
    brand: { '@type': 'Brand', name: SITE_NAME },
    manufacturer: { '@id': `${SITE_URL}/#organization` },
    category: 'Rust software',
  }
}

/**
 * Product page only — includes Offer.
 * Offer.availability mirrors checkout (license is for sale), not EAC load status.
 * Loader status stays on additionalProperty so schema does not claim OutOfStock while Buy works.
 */
export function productDetailJsonLd(status: GameStatus) {
  return {
    ...productCoreJsonLd(),
    about: {
      '@type': 'VideoGame',
      name: 'Rust',
      alternateName: 'Rust',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Supported branch',
        value: 'Rust',
      },
      {
        '@type': 'PropertyValue',
        name: 'Loader status',
        value: status,
      },
    ],
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/rust-cheats`,
      availability: 'https://schema.org/InStock',
      price: PRODUCT_PRICE_USD,
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#organization` },
    },
  }
}

/** Merge site identity + WebPage + optional extra nodes into FAQ/Product graph. */
export function buildPageJsonLd(seo: PageSeo, extra: unknown[] = []) {
  const cleaned = extra.filter((node) => {
    if (!node || typeof node !== 'object') return true
    const t = (node as { '@type'?: string })['@type']
    return t !== 'WebSite' && t !== 'Organization'
  })
  return {
    '@context': 'https://schema.org',
    '@graph': [...siteIdentityGraph(), webPageNode(seo), ...cleaned],
  }
}

/** Build FAQPage JSON-LD graph node from the same items shown in FaqSection. */
export function faqPageJsonLd(items: FaqItem[], pageUrl?: string) {
  return {
    '@type': 'FAQPage',
    ...(pageUrl ? { '@id': `${pageUrl}#faq`, url: pageUrl } : {}),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'),
      },
    })),
  }
}

export { SEO_REGIONS, absoluteUrl, OG_IMAGE, SITE_NAME, SITE_URL }
