import { ArrowRight, Crosshair, Eye, Radar, Sparkles } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { VideoBg } from '../components/VideoBg'
import { SiteFooter } from '../components/SiteFooter'
import { FaqSection } from '../components/FaqSection'
import { GAMES, guidePath, statusShort } from '../data/games'
import { CheckoutLink } from '../components/CheckoutLink'
import { HOME_FAQS } from '../data/faqs'
import { HOME_HEADINGS, SITE_HOST, SITE_NAME, SITE_PURPOSE } from '../data/site'
import { BLOGS, blogPath } from '../data/blogs'

const rustGame = GAMES[0]!
const statusBadge = statusShort(rustGame.status)
const statusBlurb =
  rustGame.status === 'Undetected'
    ? 'Live Undetected status for Rust. Updated after EAC patches — not random Discord screenshots.'
    : rustGame.status === 'Updating'
      ? 'Status is Updating after the latest Rust / EAC patch. Wait for Undetected before you load — see the status changelog.'
      : 'Use with caution on the current build. Confirm details on the status page before you load.'


const FEATURES = [
  {
    icon: Crosshair,
    label: 'Rust Aimbot',
    desc: 'Soft aim with FOV, smoothing and hitbox selection — shots land near a player and still look legit.',
  },
  {
    icon: Eye,
    label: 'ESP / Wallhack',
    desc: 'Player boxes, distance and health through walls — plus loot and resource ESP when supported.',
  },
  {
    icon: Radar,
    label: 'Off-screen finder',
    desc: 'See players outside your FOV so third parties stop ending your loot runs.',
  },
  {
    icon: Sparkles,
    label: 'EAC status',
    desc: 'We publish live Easy Anti-Cheat status after Rust patches — clear to load, or wait.',
  },
] as const

export function HomePage() {
  return (
    <div className="min-h-screen overflow-x-clip text-white">
      <section id="home" className="relative flex min-h-screen flex-col overflow-visible">
        <VideoBg readable />

        <div className="relative z-20 flex min-h-screen flex-col overflow-visible">
          <Navbar onVideo />

          <main className="page-x mt-auto overflow-visible pb-8 sm:pb-12 lg:pb-16">
            <div className="flex flex-col gap-6 overflow-visible sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="relative z-30 max-w-2xl overflow-visible">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-z-soft drop-shadow-[0_1px_10px_rgba(8,6,15,0.9)]">
                  Rust · Undetected · {SITE_HOST}
                </p>
                <h1 className="text-2xl font-semibold leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(8,6,15,0.95)] sm:text-4xl lg:text-[2.75rem]">
                  {HOME_HEADINGS.h1}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/95 drop-shadow-[0_2px_14px_rgba(8,6,15,0.9)] sm:text-lg">
                  {HOME_HEADINGS.lead}
                </p>

                <div className="relative z-30 mt-7 flex flex-wrap items-center gap-3">
                  <CheckoutLink className="cta-gradient inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                    Buy Rust Cheats
                  </CheckoutLink>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                  >
                    View features
                  </a>
                </div>
              </div>

              <div className="relative z-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:w-[34rem] lg:shrink-0">
                <div className="glass flex h-full min-h-[168px] flex-col justify-between rounded-2xl p-5 sm:min-h-[200px] sm:p-6">
                  <p
                    className="status-pill text-3xl font-normal tracking-tight sm:text-4xl"
                    style={{ fontFamily: "'Silkscreen', cursive" }}
                  >
                    {statusBadge}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 sm:mt-4">
                    {statusBlurb}{' '}
                    <a href="/status" className="text-z-soft underline-offset-2 hover:underline">
                      Status log
                    </a>
                    .
                  </p>
                </div>

                <div className="glass flex h-full min-h-[168px] flex-col rounded-2xl p-5 sm:min-h-[200px] sm:p-6">
                  <div className="mb-3 flex items-center gap-2 sm:mb-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-z-accent/30 text-xs font-bold text-z-soft">
                      RC
                    </div>
                    <span className="text-sm font-semibold text-white">Rust</span>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-white/80">
                    “Bought it for ESP and leave aim off. Spotting a deep before a
                    counter-raid saves our wipe.”
                  </p>
                  <div className="mt-4 flex items-center gap-3 sm:mt-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-z-accent/25 text-sm font-semibold text-z-ink">
                      JK
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">jayk</p>
                      <p className="text-xs text-white/60">Rust player</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>

      <div className="hero-to-body" aria-hidden />

      <div className="page-body relative z-10">
        <section id="features" className="page-band page-x scroll-mt-24 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {HOME_HEADINGS.h2Features}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="page-card flex h-full min-h-[168px] flex-col rounded-2xl p-5 transition-colors hover:border-white/20"
                >
                  <div className="icon-well mb-4">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    <a href="/rust-cheats" className="hover:text-z-soft">
                      {label}
                    </a>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="picks" className="page-x py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                  Forums
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Rust Cheats forums
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                  Setup, antivirus, hotkeys, features, and load steps before you buy.
                </p>
              </div>
              <a
                href="/forums"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
              >
                All forums
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BLOGS.slice(0, 3).map((post) => (
                <article
                  key={post.slug}
                  className="page-card group flex h-full flex-col rounded-2xl p-5 sm:p-6"
                >
                  <p className="text-xs uppercase tracking-wider text-white/45">{post.tag}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    <a href={blogPath(post.slug)} className="hover:text-z-soft">
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">
                    {post.excerpt}
                  </p>
                  <ArrowRight
                    className="mt-4 h-4 w-4 text-white/70 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </article>
              ))}
            </div>

            <div className="page-card mt-8 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h3 className="text-lg font-semibold text-white">Rust Cheats product</h3>
                <p className="mt-1 text-sm text-white/55">
                  Detailed features · compatibility · price · checkout
                </p>
              </div>
              <a
                href={guidePath('rust')}
                className="cta-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white"
              >
                View product details
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="page-band page-x border-t border-white/10 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
            <div className="page-card flex h-full min-h-[240px] flex-col justify-between rounded-2xl p-6 sm:rounded-3xl sm:p-8 lg:p-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                  About {SITE_NAME}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {HOME_HEADINGS.h2About}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
                  {SITE_PURPOSE} Clear features, honest Undetected status, buyer guides for
                  setup and load. Own the game on Steam, then check{' '}
                  <a
                    href="/rust-cheats"
                    className="text-white underline underline-offset-2 hover:text-z-soft"
                  >
                    product specs
                  </a>
                  ,{' '}
                  <a
                    href="/reviews"
                    className="text-white underline underline-offset-2 hover:text-z-soft"
                  >
                    player feedback
                  </a>
                  , or{' '}
                  <a
                    href="/support"
                    className="text-white underline underline-offset-2 hover:text-z-soft"
                  >
                    support desk
                  </a>
                  .
                </p>
              </div>
              <a
                href={guidePath('rust')}
                className="mt-8 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80"
              >
                Open product page
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </div>

            <div
              id="access"
              className="page-card flex h-full min-h-[240px] flex-col justify-between rounded-2xl p-6 sm:rounded-3xl sm:p-8 lg:p-10"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                  Checkout
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {HOME_HEADINGS.h2Access}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
                  Confirm Rust Cheats status is Undetected, then checkout for digital delivery
                  on supported Windows builds from Steam.
                </p>
              </div>
              <CheckoutLink className="cta-gradient mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-fit">
                Go to checkout
              </CheckoutLink>
            </div>
          </div>
        </section>

        <FaqSection
          id="faq"
          heading={HOME_HEADINGS.h2Faq}
          intro="Price, EAC status, ESP / wallhack and checkout — before you buy."
          items={HOME_FAQS}
          footerHref="/faq"
          footerLabel="Full FAQ →"
        />

        <SiteFooter currentPath="/" />
      </div>
    </div>
  )
}
