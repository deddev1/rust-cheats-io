import { Check, Shield } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { SiteFooter } from '../components/SiteFooter'
import {
  GUIDE_FEATURES,
  getGame,
  guidePath,
  parseGuideSlug,
  type Game,
} from '../data/games'
import { PRODUCT_PAGE_FAQS } from '../data/faqs'
import { PRODUCT_PRICE_USD, SITE_HOST, SITE_NAME } from '../data/site'
import { FaqSection } from '../components/FaqSection'
import { LocalVideoStrip } from '../components/LocalVideoStrip'
import { ProductPreviewVideo } from '../components/ProductPreviewVideo'
import { CheckoutLink } from '../components/CheckoutLink'
import { NotFoundPage } from './NotFoundPage'
import { blogPath } from '../data/blogs'
import { RUST_BUY_CARD, getImageAlt, getImageTitle } from '../data/images'

function ProductPurchaseCard({ game }: { game: Game }) {
  return (
    <div className="page-card overflow-hidden rounded-2xl sm:rounded-3xl">
      <CheckoutLink className="block" aria-label="Buy Rust Cheats">
        <div className="relative aspect-square overflow-hidden bg-z-elevated">
          <img
            src={RUST_BUY_CARD}
            alt={getImageAlt(game.slug, game.name, 'catalog')}
            title={getImageTitle(game.slug, game.name, 'catalog')}
            width={1000}
            height={1000}
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
        </div>
      </CheckoutLink>
      <div className="p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="icon-well shrink-0 text-sm font-bold">RC</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Rust Cheats</p>
            <p className="text-xs text-white/65">
              Status: {game.status} · Rust · From ${PRODUCT_PRICE_USD}
            </p>
          </div>
        </div>

        <CheckoutLink className="cta-gradient mt-5 block w-full rounded-full py-3.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:mt-6">
          Buy Rust Cheats
        </CheckoutLink>
        <p className="mt-3 text-center text-xs text-white/65">
          Instant delivery · Check Undetected first
        </p>
      </div>
    </div>
  )
}

type GameProductPageProps = {
  guideSlug: string
}

export function GameProductPage({ guideSlug }: GameProductPageProps) {
  const slug = parseGuideSlug(guideSlug)
  const game = getGame(slug)

  if (!guideSlug.endsWith('-cheats')) {
    const maybe = getGame(guideSlug)
    if (maybe) {
      if (typeof window !== 'undefined') {
        window.location.replace(guidePath(maybe.slug))
      }
      return null
    }
    return <NotFoundPage />
  }

  if (!game) return <NotFoundPage />

  return (
    <div className="min-h-screen overflow-x-hidden bg-z-bg text-white">
      <div className="border-b border-z-soft/15 bg-z-bg/90 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="page-body">
        <section className="page-x py-8 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <nav
              className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-white/70"
              aria-label="Breadcrumb"
            >
              <a href="/" className="shrink-0 text-white/80 underline-offset-2 hover:text-white hover:underline">
                Home
              </a>
              <span className="shrink-0 text-white/50" aria-hidden>
                /
              </span>
              <span className="min-w-0 text-white">Product details</span>
            </nav>

            <div className="mt-5 sm:mt-8">
              <ProductPreviewVideo />
            </div>

            <div className="mt-5 sm:mt-6">
              <span className="inline-flex items-center gap-1.5 text-xs text-z-soft">
                <Shield className="h-3.5 w-3.5 shrink-0 text-z-soft" strokeWidth={1.75} />
                {game.status} · Rust · EAC · {SITE_HOST}
              </span>

              <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:mt-4 sm:text-4xl lg:text-5xl">
                Buy Rust Cheats — Aimbot, ESP &amp; Hacks
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55 sm:mt-4 sm:text-base">
                Rust Cheats for Windows PC from ${PRODUCT_PRICE_USD} — soft aim Aimbot, player and
                loot ESP, wallhack, HWID spoofer and stream-proof options. Confirm Undetected status, then
                checkout.
              </p>
              <CheckoutLink className="cta-gradient mt-5 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Checkout now
              </CheckoutLink>
              <p className="mt-4 text-xs text-white/70">
                Before you buy:{' '}
                <a
                  href={blogPath('complete-setup')}
                  className="text-white underline underline-offset-2 hover:text-z-soft"
                >
                  Complete Setup
                </a>
                {' · '}
                <a
                  href={blogPath('disable-antivirus')}
                  className="text-white underline underline-offset-2 hover:text-z-soft"
                >
                  Antivirus
                </a>
                {' · '}
                <a
                  href={blogPath('undetected-status')}
                  className="text-white underline underline-offset-2 hover:text-z-soft"
                >
                  Undetected status
                </a>
              </p>
            </div>

            <div className="mt-6 lg:hidden">
              <ProductPurchaseCard game={game} />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
              <div className="lg:col-span-7 space-y-10">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    Included Rust features
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {GUIDE_FEATURES.map((f) => (
                      <div key={f.name} className="page-card rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-z-accent/20">
                            <Check className="h-3 w-3 text-z-soft" strokeWidth={2.5} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-white">{f.name}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-white/50">{f.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-sm leading-relaxed text-white/55">
                  <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    Player ESP, loot ESP &amp; wallhack
                  </h2>
                  <p>
                    Rust Cheats lead with player ESP through terrain and bases, loot and resource
                    filters for faster farming, and off-screen awareness so you see roamers before a
                    raid hits your TC.
                  </p>
                  <p>
                    Soft aim Aimbot stays optional. If you want the lowest-report playstyle, run ESP
                    + wallhack + stream-proof and leave combat extras off.
                  </p>
                </div>

                <div className="space-y-3 text-sm leading-relaxed text-white/55">
                  <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    Rust Undetected status (EAC)
                  </h2>
                  <p>
                    Rust uses Easy Anti-Cheat. After a client or EAC patch, builds can flip
                    to Updating until tested. {SITE_NAME} shows live Undetected status so you
                    are not buying a dead loader from a screenshot farm.
                  </p>
                  <p>
                    Rule: status first, load second. That beats every “lifetime undetected”
                    claim on competing shops.
                  </p>
                </div>

                <div className="space-y-3 text-sm leading-relaxed text-white/55">
                  <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    Checkout and delivery
                  </h2>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Confirm current status on the {SITE_HOST} homepage.</li>
                    <li>Confirm status is Undetected (or accept Updating risk).</li>
                    <li>Scan Rust Cheats ESP / Aimbot / wallhack features on this page.</li>
                    <li>Checkout for digital license delivery.</li>
                    <li>
                      Follow the{' '}
                      <a
                        href={blogPath('complete-setup')}
                        className="text-white underline underline-offset-2 hover:text-z-soft"
                      >
                        setup load order
                      </a>{' '}
                      after delivery.
                    </li>
                  </ol>
                </div>

                <div className="space-y-3 text-sm leading-relaxed text-white/55">
                  <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    Why we stay Rust-only
                  </h2>
                  <p>
                    {SITE_NAME} covers one product — Rust Cheats for Rust on Windows PC. Status
                    updates stay on one product page, not buried under unrelated titles.
                  </p>
                  <p>
                    Play the game on{' '}
                    <a
                      href="https://rust.facepunch.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline underline-offset-2 hover:text-z-soft"
                    >
                      Facepunch
                    </a>{' '}
                    or{' '}
                    <a
                      href="https://store.steampowered.com/app/252490/Rust/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline underline-offset-2 hover:text-z-soft"
                    >
                      Steam
                    </a>
                    . For cheats on {SITE_HOST}:{' '}
                    <a href="/reviews" className="text-white underline underline-offset-2 hover:text-z-soft">
                      buyer reviews
                    </a>
                    ,{' '}
                    <a href="/support" className="text-white underline underline-offset-2 hover:text-z-soft">
                      loader help
                    </a>
                    ,{' '}
                    <a href="/refunds" className="text-white underline underline-offset-2 hover:text-z-soft">
                      refund policy
                    </a>
                    , and{' '}
                    <a href="/forums" className="text-white underline underline-offset-2 hover:text-z-soft">
                      setup forums
                    </a>
                    .
                  </p>
                </div>
              </div>

              <aside className="hidden lg:col-span-5 lg:block">
                <div className="sticky top-24">
                  <ProductPurchaseCard game={game} />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section
          aria-hidden
          className="relative border-y border-z-soft/20 bg-z-band"
        >
          <LocalVideoStrip
            src="/videos/rust-product-preview"
            startAt={0}
            poster="/media/rust-product-preview-poster.jpg"
            posterAlt="Rust Cheats ESP and Aimbot gameplay"
            className="video-strip--reviews"
          />
        </section>

        <FaqSection
          heading="Rust Cheats product FAQ"
          intro="Status, features, delivery and load questions before checkout."
          items={PRODUCT_PAGE_FAQS}
          footerHref="/faq"
          footerLabel="Full FAQ →"
        />

        <SiteFooter currentPath="/rust-cheats" />
      </main>
    </div>
  )
}
