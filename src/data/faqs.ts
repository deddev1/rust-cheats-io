export type FaqItem = {
  q: string
  a: string
}

/**
 * Master FAQ — canonical list for /faq (+ FAQPage JSON-LD).
 * Order: product → price → scope → features → status → buy/load → help → policy.
 * Links use [label](/path).
 */
export const SITE_FAQS: FaqItem[] = [
  {
    q: 'What are Rust Cheats?',
    a: 'Rust Cheats is the product on rustcheats.io — player ESP, loot ESP, soft aim Aimbot, wallhack, HWID spoofer and stream-proof options — with live Undetected or Updating status after Easy Anti-Cheat patches. See the [product page](/rust-cheats) for features and price.',
  },
  {
    q: 'How much do Rust Cheats cost?',
    a: 'Licenses start from the price shown on the [product page](/rust-cheats). Confirm Undetected status, then checkout for digital delivery.',
  },
  {
    q: 'Do you cover other games?',
    a: 'No. rustcheats.io sells Rust Cheats only — one product for Rust on Windows PC. No other titles.',
  },
  {
    q: 'Is aimbot the main feature?',
    a: 'Soft aim Aimbot is optional. Most buyers come for Rust Cheats player ESP, loot filters and wallhack. Compare options on the [Features List](/forums/features-list).',
  },
  {
    q: 'How do you handle Rust / EAC updates?',
    a: 'After Rust or Easy Anti-Cheat patches we mark Undetected or Updating on the product page and the [status changelog](/status). Always [check Undetected status](/forums/undetected-status) before you load.',
  },
  {
    q: 'What features are included?',
    a: 'Player ESP / wallhack, loot and resource ESP, stream-proof options, optional HWID spoofer and configurable soft aim Aimbot — Rust Cheats only. See the [Features List](/forums/features-list) for the full checklist.',
  },
  {
    q: 'Does Rust Cheats work on Steam?',
    a: 'Yes. Compatibility tracks current Rust Windows builds on Steam (app 252490). Confirm Undetected after each patch before loading — start on the [product page](/rust-cheats).',
  },
  {
    q: 'How do I buy Rust Cheats?',
    a: 'Confirm Undetected status, review features and price on the [product page](/rust-cheats), then continue to checkout for digital delivery.',
  },
  {
    q: 'How do I load Rust Cheats?',
    a: 'After checkout, follow the [Complete Setup](/forums/complete-setup) guide for the current load order. If status is Updating, wait rather than forcing an outdated build.',
  },
  {
    q: 'Do I need antivirus exclusions?',
    a: 'Often yes — loaders can trigger Defender heuristics. Follow [Antivirus exclusions](/forums/disable-antivirus) before you load.',
  },
  {
    q: 'Where do I get Rust Cheats support?',
    a: 'Use the [Support](/support) page and your checkout order channel. Include Undetected/Updating status and whether you need load, menu or delivery help.',
  },
  {
    q: 'Where can I read Rust Cheats reviews?',
    a: 'Player reviews with ratings are on the [Reviews](/reviews) page. They cover ESP usefulness, Undetected honesty and patch survival before you buy.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Digital licenses follow the [Refunds](/refunds) page — delivery failures and extended Updating windows can qualify; change of mind after a working key does not.',
  },
]

function pickFaqs(...questions: string[]): FaqItem[] {
  return questions.map((q) => {
    const item = SITE_FAQS.find((f) => f.q === q)
    if (!item) throw new Error(`FAQ missing: ${q}`)
    return item
  })
}

/** Homepage accordion — short commercial set + link to full FAQ. */
export const HOME_FAQS: FaqItem[] = pickFaqs(
  'How much do Rust Cheats cost?',
  'How do you handle Rust / EAC updates?',
  'What features are included?',
  'How do I buy Rust Cheats?',
)

/** Product page accordion — status, features, Steam, buy, support. */
export const PRODUCT_PAGE_FAQS: FaqItem[] = pickFaqs(
  'How do you handle Rust / EAC updates?',
  'What features are included?',
  'Does Rust Cheats work on Steam?',
  'How do I buy Rust Cheats?',
  'Where do I get Rust Cheats support?',
)
