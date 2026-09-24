export type ResponsiveImageSpec = {
  fallback: string
  webpSrcSet: string
  width: number
  height: number
  sizes: string
}

/** Responsive WebP + JPEG fallbacks for in-page gameplay stills. */
export const RESPONSIVE_BY_FALLBACK: Record<string, ResponsiveImageSpec> = {
  '/media/rust-soldier-hero.jpg': {
    fallback: '/media/rust-soldier-hero.jpg',
    webpSrcSet:
      '/media/rust-soldier-hero-480w.webp 480w, /media/rust-soldier-hero-800w.webp 800w',
    width: 800,
    height: 450,
    sizes: '(max-width: 1024px) 100vw, 800px',
  },
  '/media/rust-monument.jpg': {
    fallback: '/media/rust-monument.jpg',
    webpSrcSet:
      '/media/rust-monument-480w.webp 480w, /media/rust-monument-800w.webp 800w',
    width: 800,
    height: 450,
    sizes: '(max-width: 1024px) 100vw, 800px',
  },
  '/media/rust-raid-party.jpg': {
    fallback: '/media/rust-raid-party.jpg',
    webpSrcSet:
      '/media/rust-raid-party-480w.webp 480w, /media/rust-raid-party-800w.webp 800w',
    width: 800,
    height: 450,
    sizes: '(max-width: 1024px) 100vw, 800px',
  },
  '/media/rust-product-preview-poster.jpg': {
    fallback: '/media/rust-product-preview-poster.jpg',
    webpSrcSet:
      '/media/rust-product-hero-480w.webp 480w, /media/rust-product-hero-800w.webp 800w, /media/rust-product-hero.webp 1280w',
    width: 1280,
    height: 720,
    sizes: '(max-width: 1024px) 100vw, 640px',
  },
  '/media/rust-product-hero.webp': {
    fallback: '/media/rust-product-hero.webp',
    webpSrcSet:
      '/media/rust-product-hero-480w.webp 480w, /media/rust-product-hero-800w.webp 800w, /media/rust-product-hero.webp 1280w',
    width: 1280,
    height: 720,
    sizes: '(max-width: 1024px) 100vw, 640px',
  },
}

export function getResponsiveSpec(fallback: string): ResponsiveImageSpec | undefined {
  return RESPONSIVE_BY_FALLBACK[fallback]
}
