import { LogoMark } from './LogoMark'
import { SITE_NAME } from '../data/site'

type SiteFooterProps = {
  currentPath?: string
}

const HUB_LINKS = [
  { href: '/rust-cheats', label: 'Product' },
  { href: '/status', label: 'Status' },
  { href: '/forums', label: 'Forums' },
  { href: '/faq', label: 'FAQ' },
  { href: '/support', label: 'Support' },
  { href: '/reviews', label: 'Reviews' },
] as const

const GUIDE_LINKS = [
  { href: '/forums/features-list', label: 'Features list' },
  { href: '/forums/complete-setup', label: 'Complete setup' },
  { href: '/forums/disable-antivirus', label: 'Antivirus' },
  { href: '/forums/undetected-status', label: 'Undetected status' },
  { href: '/forums/hotkeys', label: 'Hotkeys' },
] as const

/** Brand footer with lean crawl hub + policy links. */
export function SiteFooter({ currentPath: _currentPath }: SiteFooterProps) {
  return (
    <footer className="page-x border-t border-z-soft/15 bg-z-band py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <LogoMark className="text-z-soft" />
              <span className="font-semibold text-z-ink">{SITE_NAME}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Rust Cheats for PC — Aimbot, ESP &amp; hacks with live Undetected status on
              current Steam builds.
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/65">
            <li>
              <a href="/privacy" className="hover:text-white">
                Privacy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white">
                Terms
              </a>
            </li>
            <li>
              <a href="/refunds" className="hover:text-white">
                Refunds
              </a>
            </li>
          </ul>
        </div>

        <nav
          className="mt-8 border-t border-white/[0.06] pt-6"
          aria-label="Site links"
        >
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/55">
            {HUB_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/70">
            {GUIDE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="underline-offset-2 hover:text-white hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10 text-xs text-white/55">
          © {new Date().getFullYear()} {SITE_NAME}.
        </p>
      </div>
    </footer>
  )
}
