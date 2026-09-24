/** First-party assets — gameplay stills from the cheat video. */
import {
  RUST_OBJECTIVE,
  RUST_PRODUCT_PREVIEW_POSTER,
  RUST_SOLDIER_HERO,
  RUST_TACTICAL,
} from './media'

export const RUST_OG = '/og/rust-cheats.jpg'
export const RUST_HERO = '/media/rust-product-hero.webp'
export const RUST_COVER = '/media/rust-product-cover.webp'
/** Purple product-box art — buy card only */
export const RUST_BUY_CARD = '/media/rust-product-buy-card.webp'

export type ImageSeoFields = {
  alt: string
  title: string
  caption: string
}

export const IMAGE_SEO: Record<
  string,
  ImageSeoFields & {
    heroAlt: string
    heroTitle: string
    heroCaption: string
  }
> = {
  'rust': {
    alt: 'Rust Cheats purple product box for Windows PC',
    title: 'Rust Cheats Product Details',
    caption: 'Rust Cheats ESP, Aimbot, wallhack and Windows compatibility',
    heroAlt: 'Rust Cheats gameplay preview still from product video',
    heroTitle: 'Rust Cheats Features',
    heroCaption: 'Review Rust Cheats ESP, Aimbot, wallhack and current status',
  },
}

type PageImage = ImageSeoFields & { src: string }

export const PAGE_IMAGES: Record<
  'home' | 'forums' | 'reviews' | 'faq' | 'support' | 'product',
  PageImage
> = {
  home: {
    src: RUST_PRODUCT_PREVIEW_POSTER,
    alt: 'Rust Cheats gameplay still with ESP overlay from cheat video',
    title: 'Rust Cheats for PC',
    caption: 'Rust Cheats player ESP, Aimbot and wallhack feature overview.',
  },
  forums: {
    src: RUST_SOLDIER_HERO,
    alt: 'Rust Cheats gameplay still used in setup guides',
    title: 'Rust Cheats Guides',
    caption: 'Setup, hotkey and compatibility guides for Rust Cheats.',
  },
  reviews: {
    src: RUST_OBJECTIVE,
    alt: 'Rust Cheats gameplay still for reviews',
    title: 'Rust Cheats Reviews',
    caption: 'Feature and compatibility feedback for current Rust Cheats builds.',
  },
  faq: {
    src: RUST_TACTICAL,
    alt: 'Rust Cheats gameplay still for FAQ',
    title: 'Rust Cheats FAQ',
    caption: 'Compatibility, feature and setup answers for Rust Cheats.',
  },
  support: {
    src: RUST_PRODUCT_PREVIEW_POSTER,
    alt: 'Rust Cheats gameplay still for support',
    title: 'Rust Cheats Support',
    caption: 'Delivery, loader and setup support for Rust Cheats.',
  },
  product: {
    src: RUST_PRODUCT_PREVIEW_POSTER,
    alt: 'Rust Cheats gameplay still from ESP and Aimbot preview video',
    title: 'Rust Cheats Features',
    caption: 'Product details for Rust Cheats ESP, Aimbot and wallhack.',
  },
}

export function getGameImage(_slug: string): string {
  return RUST_COVER
}

export function getProductHeroImage(slug: string): string {
  return slug === 'rust' ? RUST_HERO : getGameImage(slug)
}

export function getOgImage(path?: string): string {
  if (!path || path === '/') return PAGE_IMAGES.home.src
  if (path === '/rust-cheats') return PAGE_IMAGES.product.src
  if (path === '/forums') return PAGE_IMAGES.forums.src
  if (path === '/reviews') return PAGE_IMAGES.reviews.src
  if (path === '/faq') return PAGE_IMAGES.faq.src
  if (path === '/support') return PAGE_IMAGES.support.src
  return RUST_OG
}

export function getPageImage(key: keyof typeof PAGE_IMAGES) {
  return PAGE_IMAGES[key]
}

export function getImageAlt(
  slug: string,
  name: string,
  variant: 'catalog' | 'product' = 'catalog',
): string {
  const seo = IMAGE_SEO[slug]
  if (seo) return variant === 'product' ? seo.heroAlt : seo.alt
  return variant === 'product' ? `${name} product details` : `${name} product artwork`
}

export function getImageTitle(
  slug: string,
  name: string,
  variant: 'catalog' | 'product' = 'catalog',
): string {
  const seo = IMAGE_SEO[slug]
  if (seo) return variant === 'product' ? seo.heroTitle : seo.title
  return `${name} product`
}
