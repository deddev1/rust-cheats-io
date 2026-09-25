export type BlogSection = {
  heading: string
  body: string[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  searchTerms: string
  date: string
  /** ISO date when the guide was last verified against current status. */
  dateModified: string
  /** Short display string for “Last checked” near the title. */
  lastChecked: string
  readMinutes: number
  tag: string
  sections: BlogSection[]
}

/**
 * Commercial / transactional buyer guides only.
 * Forum-style: setup, antivirus, hotkeys, features, load, status — then buy.
 */
export const BLOGS: BlogPost[] = [
  {
    slug: 'features-list',
    title: 'Rust Cheats Features List',
    excerpt:
      'Full features list before you buy Rust Cheats — player ESP, loot ESP, soft aim Aimbot and stream-proof options.',
    metaTitle: 'Rust Cheats ESP, Wallhack & Soft Aim Feature List',
    metaDescription:
      'Compare Rust Cheats player ESP, loot ESP, wallhack, soft aim, HWID spoofer, and stream-proof options before checkout.',
    searchTerms: 'features player esp loot esp wallhack soft aim stream-proof aimbot spoofer hwid',
    date: '2026-09-15',
    dateModified: '2026-09-20',
    lastChecked: 'Sep 20, 2026',
    readMinutes: 6,
    tag: 'Features',
    sections: [
      {
        heading: 'What you get when you buy',
        body: [
          'Rust Cheats is one product for Rust on Windows PC. You are buying a loader + license with live Undetected / Updating status on rustcheats.io — not a pack for other games.',
          'Open the product page, confirm status, then checkout. Delivery is digital on supported builds.',
        ],
      },
      {
        heading: 'Features list',
        body: [
          'Player ESP / wallhack — boxes, skeletons, distance and health through terrain and buildings.',
          'Loot ESP — weapons, armor, attachments, healing items and death boxes with configurable filters.',
          'Off-screen finder — awareness for threats outside your FOV.',
          'Soft aim Aimbot — adjustable FOV, smoothing and hitbox; leave it off if you only want ESP.',
          'HWID Spoofer — optional hardware ID spoof when the current Undetected build lists spoofer support; skip it if you only need ESP.',
          'Stream-proof — hide supported overlays from capture when you clip or go live.',
          'Config save/load — keep your Rust Cheats setup between sessions.',
        ],
      },
      {
        heading: 'Next step',
        body: [
          'Read the hotkeys and setup guides, then buy Rust Cheats when status is Undetected.',
        ],
      },
    ],
  },
  {
    slug: 'hotkeys',
    title: 'Rust Cheats Hotkeys',
    excerpt:
      'Hotkeys and menu keys for Rust Cheats after load — open menu, toggles, and what to leave unbound.',
    metaTitle: 'Rust ESP Menu Hotkeys | Post-Checkout Setup',
    metaDescription:
      'Hotkeys for Rust Cheats after load: menu, ESP toggles, wallhack, soft aim, and spoofer keys for Steam Rust.',
    searchTerms: 'hotkeys menu keys esp toggle wallhack soft aim aimbot spoofer',
    date: '2026-09-15',
    dateModified: '2026-09-20',
    lastChecked: 'Sep 20, 2026',
    readMinutes: 4,
    tag: 'Hotkeys',
    sections: [
      {
        heading: 'After load',
        body: [
          'Buy Rust Cheats, check Undetected, launch the game, run the loader, wait for a clean inject. Then open the menu with the key listed in your delivery notes (build-specific).',
          'If the menu does not open, do not spam keys — reopen support with your order ID and build name.',
        ],
      },
      {
        heading: 'Typical hotkey jobs',
        body: [
          'Menu open / close — always learn this first.',
          'ESP master toggle — turn player ESP on/off without digging panels.',
          'Off-screen finder toggle — same idea for awareness outside your FOV.',
          'Soft aim Aimbot toggle — leave unbound if you run visuals only.',
          'Stream-proof — flip before you start OBS or clips.',
        ],
      },
      {
        heading: 'Keep it simple',
        body: [
          'Bind only what you use. Extra binds get pressed mid-fight and look obvious. Save your layout once, then re-check status after every Rust patch before you load again.',
        ],
      },
    ],
  },
  {
    slug: 'complete-setup',
    title: 'How to Complete Rust Cheats Setup',
    excerpt:
      'Complete setup for Rust Cheats: buy, disable blockers, launch Rust, load, enable ESP, confirm hotkeys.',
    metaTitle: 'Complete Rust Loader Setup & Load Order',
    metaDescription:
      'Complete Rust Cheats setup after checkout: delivery, antivirus exclusions, load order, ESP config, and hotkeys.',
    searchTerms: 'complete setup instructions load checklist loader order esp enable wallhack',
    date: '2026-09-15',
    dateModified: '2026-09-20',
    lastChecked: 'Sep 20, 2026',
    readMinutes: 7,
    tag: 'Setup',
    sections: [
      {
        heading: '1) Buy and confirm status',
        body: [
          'Open Buy Rust Cheats on rustcheats.io. If status is Updating, wait. If Undetected, checkout and use only the official delivery link from this site.',
        ],
      },
      {
        heading: '2) Prep the PC',
        body: [
          'Close overlays that fight loaders (Discord overlay, GeForce, RGB suites if they hook games).',
          'Follow the antivirus guide: allowlist the loader folder or pause real-time scan for the install window — see Disable Antivirus.',
          'Do not run cracked mirrors. Support only covers loaders delivered with your order.',
        ],
      },
      {
        heading: '3) Load order',
        body: [
          'Start Rust on Steam.',
          'Run the Rust Cheats loader / license as delivered.',
          'Wait for a successful load.',
          'Open the menu → player ESP on → loot ESP on → off-screen finder on → stream-proof if you record.',
          'Soft aim Aimbot off unless you specifically want it.',
        ],
      },
      {
        heading: '4) Save and re-check after patches',
        body: [
          'Save the config. After any Rust / EAC update, check Undetected again before you load. Setup means nothing on a detected build.',
        ],
      },
      {
        heading: '5) Quick checklist',
        body: [
          'Save the delivered loader folder and license details before starting.',
          'Allowlist the delivery folder, close conflicting overlays, and read the current menu key.',
          'If status flips to Updating mid-session, stop and wait for the rebuild.',
        ],
      },
      {
        heading: '6) If load fails',
        body: [
          'Stop and re-check Undetected versus Updating. Restart the game once, confirm antivirus exclusions, and attempt one clean load.',
          'If it still fails, contact support with the order ID and current build. Do not force an outdated loader into an updated game.',
        ],
      },
    ],
  },
  {
    slug: 'disable-antivirus',
    title: 'How to Turn Off Antivirus for Rust Cheats',
    excerpt:
      'Turn off or allowlist antivirus so Rust Cheats loader can run after purchase — Windows Defender and common AV steps.',
    metaTitle: 'Rust Loader Antivirus Exclusions | Windows Defender',
    metaDescription:
      'Allowlist antivirus for Rust Cheats — Defender exclusions, false positives, then load when Undetected.',
    searchTerms: 'disable antivirus defender exclusion allowlist loader false positive',
    date: '2026-09-15',
    dateModified: '2026-09-20',
    lastChecked: 'Sep 20, 2026',
    readMinutes: 5,
    tag: 'Antivirus',
    sections: [
      {
        heading: 'Why this step exists',
        body: [
          'Cheat loaders are often flagged as generic “trojan” heuristics even when you bought Rust Cheats from rustcheats.io. That blocks the load. Fix the AV step before you spam the loader.',
        ],
      },
      {
        heading: 'Windows Defender (common path)',
        body: [
          'Open Windows Security → Virus & threat protection → Manage settings.',
          'Add an exclusion for the folder that holds your official Rust Cheats loader (the path from your delivery email).',
          'If the file was already quarantined, restore it from Protection history, then exclude the folder.',
          'Optional short window: pause real-time protection only while you load, then turn it back on. Prefer a permanent exclusion for the delivery folder over leaving Defender off all day.',
        ],
      },
      {
        heading: 'Third-party AV',
        body: [
          'Same idea: exclusion / allowlist for the loader folder, not “turn off forever.” Norton, Avast, Bitdefender, Malwarebytes — use their exclusion UI.',
          'If load still fails after exclusion, restart the PC once, confirm Undetected status, then try one clean launch. Open support with your order ID if it still fails.',
        ],
      },
      {
        heading: 'Then continue setup',
        body: [
          'When the exclusion is ready, follow Complete Setup for the load order and troubleshooting steps. Support can match only official orders and current builds.',
        ],
      },
    ],
  },
  {
    slug: 'undetected-status',
    title: 'Check Undetected Before You Buy or Load',
    excerpt:
      'Undetected vs Updating for Rust Cheats — check status before checkout and before every load after a Rust patch.',
    metaTitle: 'Rust Loader Status | Undetected or Updating',
    metaDescription:
      'Check Undetected or Updating status for Rust Cheats before checkout and every load after a Rust or EAC patch.',
    searchTerms: 'undetected status updating eac patch load checkout changelog',
    date: '2026-09-15',
    dateModified: '2026-09-20',
    lastChecked: 'Sep 20, 2026',
    readMinutes: 4,
    tag: 'Status',
    sections: [
      {
        heading: 'Status is part of the purchase',
        body: [
          'Do not buy or load blind. The product page shows Undetected or Updating after Rust / EAC patches. That status is the go / no-go for Rust Cheats.',
        ],
      },
      {
        heading: 'Undetected vs Updating',
        body: [
          'Undetected — current build is cleared for load. Safe to checkout and launch.',
          'Updating — wait. Do not trust old Discord “still UD” screenshots.',
        ],
      },
      {
        heading: 'Refunds and status windows',
        body: [
          'If Updating lasts through your license window with no rebuild, see the Refunds page and contact Support with your order ID.',
        ],
      },
    ],
  },
]

export function getBlog(slug: string) {
  return BLOGS.find((b) => b.slug === slug)
}

export { blogPath, sectionId, blogSectionPath } from './blog-paths'
