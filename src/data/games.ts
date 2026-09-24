export type GameStatus = 'Undetected' | 'Updating' | 'Use with caution'

export type Game = {
  slug: string
  name: string
  status: GameStatus
  popular?: boolean
}

/** Site is Rust Cheats only — no other titles in the catalog. */
export const GAMES: Game[] = [
  { slug: 'rust', name: 'Rust', status: 'Updating', popular: true },
]

export function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug)
}

/** Short badge for hero / glass cards — always derived from `Game.status`. */
export function statusShort(status: GameStatus): string {
  if (status === 'Undetected') return 'UD'
  if (status === 'Updating') return 'UPD'
  return 'CAU'
}

export function guidePath(slug: string) {
  return slug === 'rust' ? '/rust-cheats' : `/${slug}-cheats`
}

export function parseGuideSlug(param: string) {
  return param.endsWith('-cheats') ? param.slice(0, -7) : param
}

/**
 * Feature list tuned to what ranks for Rust Cheats
 * Feature bullets for the product page — ESP & awareness first.
 */
export const GUIDE_FEATURES = [
  {
    name: 'Player ESP',
    text: 'See players, sleepers and distance through terrain when the current Rust Cheats build supports it.',
  },
  {
    name: 'Resource ESP',
    text: 'Highlight nodes, crates, barrels, airdrops and stashes with configurable filters.',
  },
  {
    name: 'Off-screen finder',
    text: 'Awareness for nearby players and raid activity around your base outside your FOV.',
  },
  {
    name: 'Soft aim Aimbot',
    text: 'Configurable Aimbot assist with field-of-view and smoothing controls where supported.',
  },
  {
    name: 'HWID Spoofer',
    text: 'Optional hardware ID spoof on supported Windows builds — only when live status is Undetected and the current loader lists spoofer support.',
  },
  {
    name: 'Stream-proof mode',
    text: 'Keep supported Rust Cheats overlays out of common capture software when recording or streaming.',
  },
  {
    name: 'Configurable hotkeys',
    text: 'Toggle ESP, wallhack and combat features quickly during wipes and monument runs.',
  },
  {
    name: 'Steam support',
    text: 'Compatibility is tracked against current Rust Windows builds on Steam (app 252490).',
  },
  {
    name: 'Patch status + support',
    text: 'Updating or Undetected status is reviewed after Rust and Easy Anti-Cheat updates.',
  },
] as const

/** @deprecated use PRODUCT_PAGE_FAQS from faqs.ts — kept as alias */
export { PRODUCT_PAGE_FAQS as PRODUCT_FAQS } from './faqs'
