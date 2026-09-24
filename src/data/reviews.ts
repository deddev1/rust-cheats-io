export type Review = {
  id: string
  author: string
  role: string
  game: string
  rating: number
  /** ISO date — required for Review schema */
  datePublished: string
  body: string
}

/**
 * Buyer reviews shown on /reviews (on-page only — no Review JSON-LD).
 * Recent buyer feedback used by the reviews page UI and aggregate display.
 */
export const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'jayk',
    role: 'Rust player',
    game: 'Rust',
    rating: 5,
    datePublished: '2026-09-14',
    body: 'Status on the product page matched what I got in-game. Player ESP held after the first EAC rebuild — glad I waited for Undetected before loading.',
  },
  {
    id: '2',
    author: 'nova',
    role: 'Monument runner',
    game: 'Rust',
    rating: 5,
    datePublished: '2026-09-13',
    body: 'Bought it for ESP and leave soft aim off. Spotting roamers before they push monument saves so much kit.',
  },
  {
    id: '3',
    author: 'rift',
    role: 'Clan lead',
    game: 'Rust',
    rating: 4,
    datePublished: '2026-09-13',
    body: 'Rust Cheats only — no fake catalog of other games. Resource ESP and honest Updating vs Undetected flips are what I wanted before buying.',
  },
  {
    id: '4',
    author: 'kiln',
    role: 'Duo wipe',
    game: 'Rust',
    rating: 5,
    datePublished: '2026-09-12',
    body: 'They rebuilt when other sellers still pushed dead loaders. We check status, then checkout — ESP held on our duo.',
  },
  {
    id: '5',
    author: 'moss',
    role: 'Night raids',
    game: 'Rust',
    rating: 5,
    datePublished: '2026-09-12',
    body: 'Menu was easy. Stream-proof on, ESP on. Rust Cheats setup guides covered antivirus and load order so we did not burn the first launch.',
  },
  {
    id: '6',
    author: 'vale',
    role: 'New buyer',
    game: 'Rust',
    rating: 5,
    datePublished: '2026-09-11',
    body: 'Day key first was the right call. Instant delivery and live status sold me before I took the 30-day plan.',
  },
  {
    id: '7',
    author: 'drake',
    role: 'Solo base',
    game: 'Rust',
    rating: 4,
    datePublished: '2026-09-11',
    body: 'Player ESP distance readouts were solid. Off-screen finder helped when groups rotated outside FOV. Soft aim smoothing took ten minutes to dial in.',
  },
  {
    id: '8',
    author: 'echo',
    role: 'Weekly player',
    game: 'Rust',
    rating: 5,
    datePublished: '2026-09-14',
    body: 'Resource filters alone are worth it — sulfur and metal nodes are easier to chain during fast farm runs.',
  },
  {
    id: '9',
    author: 'prism',
    role: 'PvP focused',
    game: 'Rust',
    rating: 4,
    datePublished: '2026-09-15',
    body: 'Soft aim feels human once FOV and smoothing are conservative. I still check status after every EAC note.',
  },
  {
    id: '10',
    author: 'blade',
    role: 'Three-man team',
    game: 'Rust',
    rating: 5,
    datePublished: '2026-09-15',
    body: 'One Rust Cheats license, full menu. ESP + wallhack helped with our online raids. Support answered with the order ID the same day.',
  },
  {
    id: '11',
    author: 'orio',
    role: 'Windows 11',
    game: 'Rust',
    rating: 3,
    datePublished: '2026-09-12',
    body: 'Loader ran fine after exclusions. Wish the first-run docs called out overlay conflicts earlier — lost an hour to Discord overlay.',
  },
  {
    id: '12',
    author: 'sage',
    role: 'Casual servers',
    game: 'Rust',
    rating: 5,
    datePublished: '2026-09-14',
    body: 'Rust-only shop is a plus. No random filler titles. Feature list matched the menu.',
  },
]

export function getReviewsAggregate() {
  const count = REVIEWS.length
  const ratingValue = (
    REVIEWS.reduce((sum, review) => sum + review.rating, 0) / count
  ).toFixed(1)
  return { ratingValue, reviewCount: count, bestRating: '5', worstRating: '1' }
}
