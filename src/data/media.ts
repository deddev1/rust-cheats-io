export type SeoMediaItem = {
  image: string
  video?: string
  alt: string
  title: string
  caption: string
  videoTitle?: string
  videoDescription?: string
}

export const RUST_SOLDIER_HERO = '/media/rust-soldier-hero.jpg'
export const RUST_TACTICAL = '/media/rust-monument.jpg'
export const RUST_OBJECTIVE = '/media/rust-raid-party.jpg'

/** Short muted loop for product card + select SeoMedia blocks (~480px, 5s). */
export const RUST_CARD_LOOP_MP4 = '/videos/rust-card-loop.mp4'
/** @deprecated Prefer MP4 — kept for type compat; not shipped */
export const RUST_CARD_LOOP_WEBM = '/videos/rust-card-loop.mp4'
/** Product page gameplay clip (~6s, 720px, compact encode). */
export const RUST_PRODUCT_PREVIEW_MP4 = '/videos/rust-product-preview.mp4'
/** @deprecated Prefer MP4 — kept for type compat; not shipped */
export const RUST_PRODUCT_PREVIEW_WEBM = '/videos/rust-product-preview.mp4'
export const RUST_PRODUCT_PREVIEW_POSTER = '/media/rust-product-preview-poster.jpg'
export const RUST_HERO_POSTER = '/media/rust-hero-poster.jpg'

/** Embedded preview on the homepage. */
export const RUST_HOME_VIDEO = {
  id: 'L2A6U1w0nJU',
  url: 'https://www.youtube.com/watch?v=L2A6U1w0nJU',
  title: 'Rust — Official Trailer',
  caption: 'Official Rust survival gameplay on YouTube.',
} as const

export const PAGE_MEDIA = {
  home: {
    image: RUST_PRODUCT_PREVIEW_POSTER,
    alt: 'Rust Cheats gameplay still with ESP overlay from product video',
    title: 'Rust Cheats for PC',
    caption: 'Feature overview for Rust Cheats ESP, Aimbot and wallhack.',
  },
  product: {
    image: RUST_PRODUCT_PREVIEW_POSTER,
    alt: 'Rust Cheats player ESP during live cheat gameplay',
    title: 'Rust Cheats ESP, Aimbot and Wallhack',
    caption: 'Product overview for current Rust Cheats Windows builds.',
  },
  forums: {
    image: RUST_SOLDIER_HERO,
    video: RUST_CARD_LOOP_MP4,
    alt: 'Rust Cheats ESP overlay during an online raid from cheat gameplay',
    title: 'Rust Cheats Guides',
    caption: 'Gameplay reference for Rust Cheats setup, hotkeys, features and status.',
    videoTitle: 'Short Rust Cheats gameplay loop',
  },
  reviews: {
    image: RUST_OBJECTIVE,
    video: RUST_CARD_LOOP_MP4,
    alt: 'Rust Cheats player ESP in a live match from cheat video',
    title: 'Rust Cheats Reviews',
    caption: 'What buyers see in-game — Rust Cheats ESP and match performance.',
    videoTitle: 'Rust Cheats review gameplay clip',
  },
  faq: {
    image: RUST_TACTICAL,
    alt: 'Rust Cheats ESP boxes and distance tags from cheat gameplay',
    title: 'Rust Cheats FAQ',
    caption: 'Compatibility, status and setup answers for Rust Cheats.',
  },
  support: {
    image: RUST_PRODUCT_PREVIEW_POSTER,
    alt: 'Rust Cheats overlay while aiming down sights from gameplay video',
    title: 'Rust Cheats Support',
    caption: 'Delivery, loader and setup help for Rust Cheats.',
  },
} as const satisfies Record<string, SeoMediaItem>

/** Unique still per forum slug — all frames from the Rust Cheats gameplay video. */
const FORUM_MEDIA: Record<string, SeoMediaItem> = {
  'features-list': {
    image: RUST_PRODUCT_PREVIEW_POSTER,
    alt: 'Rust Cheats player ESP and Aimbot features in match',
    title: 'Rust Cheats Feature List',
    caption: 'Reference for player ESP, loot ESP, wallhack and Aimbot options.',
  },
  hotkeys: {
    image: RUST_HERO_POSTER,
    alt: 'Rust Cheats ESP overlay used while configuring menu hotkeys',
    title: 'Rust Cheats Menu Hotkey Preview',
    caption: 'Reference for ESP, Aimbot and stream-proof hotkeys.',
  },
  'complete-setup': {
    image: RUST_OBJECTIVE,
    alt: 'Rust Cheats complete loader setup',
    title: 'Complete Rust Cheats Setup Preview',
    caption: 'Delivery, exclusions and clean load-order reference.',
  },
  'disable-antivirus': {
    image: RUST_TACTICAL,
    alt: 'Rust Cheats antivirus exclusion setup',
    title: 'Rust Cheats Loader Exclusion Preview',
    caption: 'Reference for antivirus exclusions before loading Rust Cheats.',
  },
  'undetected-status': {
    image: RUST_SOLDIER_HERO,
    alt: 'Rust Cheats current product status',
    title: 'Rust Cheats Loader Status Preview',
    caption: 'Reference for checking Undetected or Updating before loading.',
  },
}

export function getForumMedia(slug: string): SeoMediaItem {
  return FORUM_MEDIA[slug] || PAGE_MEDIA.forums
}
