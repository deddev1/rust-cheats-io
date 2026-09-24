import type { GameStatus } from './games'
import { GAMES } from './games'

export type StatusLogEntry = {
  date: string
  status: GameStatus
  title: string
  body: string
}

/** Live badge — always mirrors `GAMES[0].status`. */
export const LIVE_STATUS: GameStatus = GAMES[0]?.status ?? 'Updating'

/**
 * Dated rebuild / status changelog for /status.
 * Newest first. Update when status flips after Rust / EAC patches.
 */
export const STATUS_LOG: StatusLogEntry[] = [
  {
    date: '2026-09-24',
    status: 'Updating',
    title: 'Post-patch rebuild in progress',
    body: 'Rust / Easy Anti-Cheat update detected. Loader marked Updating — do not force an outdated build. Checkout remains open; wait for Undetected before you load.',
  },
  {
    date: '2026-09-20',
    status: 'Undetected',
    title: 'Build cleared after EAC test pass',
    body: 'Player ESP, loot ESP, soft aim, stream-proof and HWID spoofer (when listed) cleared on current Steam Windows builds.',
  },
  {
    date: '2026-09-15',
    status: 'Updating',
    title: 'Wipe-week EAC bump',
    body: 'Temporary Updating window while the loader was rebuilt for the mid-September Facepunch / EAC notes.',
  },
  {
    date: '2026-09-11',
    status: 'Undetected',
    title: 'Stable Undetected window',
    body: 'Multi-day Undetected stretch covering ESP-first configs and optional soft aim on official Steam Rust.',
  },
]

export const STATUS_PAGE = {
  title: 'Rust Cheats Status & Changelog | Undetected Log',
  description:
    'Live Rust Cheats loader status and dated changelog — Undetected vs Updating after every Rust and Easy Anti-Cheat patch before you buy or load on Steam.',
  path: '/status',
  keywords:
    'rust cheats status, rust undetected, rust updating, rust eac status, rust cheat changelog, rust loader status',
  h1: 'Rust Cheats status & changelog',
  intro:
    'Live Easy Anti-Cheat status for Rust Cheats on rustcheats.io, plus a dated rebuild log. Confirm Undetected here or on the product page before every load.',
} as const
