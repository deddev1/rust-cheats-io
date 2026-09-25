export type SupportFaq = {
  q: string
  a: string
}

export type SupportStep = {
  title: string
  body: string
}

export const SUPPORT_INTRO =
  'Support for Rust Cheats buyers on rustcheats.io — loader setup, Undetected status, menu config and delivery help after you purchase.'

export const SUPPORT_LEAD =
  'Setup forums live in the [forums](/forums). Start with the [setup guide](/forums/complete-setup) before opening a ticket.'

/** Numbered “How we help” steps — support layout. */
export const SUPPORT_STEPS: SupportStep[] = [
  {
    title: 'Status before you load',
    body: 'Confirm Undetected on the [buy page](/rust-cheats) after every Rust / EAC patch. If status is Updating, wait — do not force an outdated build.',
  },
  {
    title: 'Loader and menu issues',
    body: 'Follow the [load-order guide](/forums/complete-setup) for the current load order and antivirus exclusions. If an Undetected build still fails after one clean retry, open a request with your order ID.',
  },
  {
    title: 'Delivery and refunds',
    body: 'Delivery failures and extended Updating windows are covered on the [refund rules](/refunds). Include your order ID when you write in.',
  },
  {
    title: 'What we can and cannot help with',
    body: 'Supported: Rust on Windows PC, loader and menu help for paid licenses. Not supported: other games, cracked loaders or third-party mirrors.',
  },
]

export const SUPPORT_FAQS: SupportFaq[] = [
  {
    q: 'How do I contact Rust Cheats support?',
    a: 'Open your order on rustcheats.io and use the checkout support channel tied to your purchase. Include a status screenshot (Undetected / Updating) and whether you need load, menu or delivery help.',
  },
  {
    q: 'The loader will not open — what first?',
    a: 'Do not spam launch. Restart Rust, confirm [AV exclusions](/forums/disable-antivirus), re-check Undetected status, then try one clean load from [load steps](/forums/complete-setup). If it still fails, contact support with your order ID.',
  },
  {
    q: 'Menu opened once then never again?',
    a: 'Re-check hotkeys in the [menu keys](/forums/hotkeys) guide, confirm the build is still Undetected, and avoid remapping mid-fight. If the menu stays dead after a clean reload, write in with your order ID and build name.',
  },
  {
    q: 'Do you support multiplayer Rust servers?',
    a: 'Rust Cheats targets official Facepunch Rust on Windows / Steam. We do not support cracked clients, private forks or third-party mirrors.',
  },
  {
    q: 'Where is my delivery?',
    a: 'Delivery is digital after checkout on rustcheats.io. Use only the official loader link from your order. Third-party mirrors are unsupported and unsafe — see [Refunds](/refunds) if delivery failed.',
  },
]
