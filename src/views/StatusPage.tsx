import { Navbar } from '../components/Navbar'
import { SiteFooter } from '../components/SiteFooter'
import { CheckoutLink } from '../components/CheckoutLink'
import { LIVE_STATUS, STATUS_LOG, STATUS_PAGE } from '../data/status-log'
import { SITE_HOST, SITE_NAME } from '../data/site'
import { blogPath } from '../data/blogs'

function statusTone(status: string) {
  if (status === 'Undetected') return 'text-emerald-300'
  if (status === 'Updating') return 'text-amber-300'
  return 'text-z-soft'
}

export function StatusPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-z-bg text-white">
      <div className="border-b border-z-soft/15 bg-z-bg/90 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="page-body">
        <section className="page-x pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-z-soft">
              {SITE_NAME.toUpperCase()} · STATUS · {SITE_HOST}
            </p>
            <nav
              className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-white/50"
              aria-label="Breadcrumb"
            >
              <a href="/" className="underline-offset-2 hover:text-white hover:underline">
                Home
              </a>
              <span className="text-white/30" aria-hidden>
                /
              </span>
              <span className="text-white/70">Status</span>
            </nav>

            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              {STATUS_PAGE.h1}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/55 sm:text-lg">
              {STATUS_PAGE.intro}
            </p>

            <div className="page-card mt-10 rounded-2xl p-6 sm:p-8">
              <p className="text-xs uppercase tracking-wider text-white/45">Live now</p>
              <p className={`mt-2 text-3xl font-semibold tracking-tight sm:text-4xl ${statusTone(LIVE_STATUS)}`}>
                {LIVE_STATUS}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Mirrors the product page badge. If status is Updating, wait for the next Undetected
                entry below — do not load an outdated build.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/rust-cheats"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
                >
                  View product
                </a>
                <CheckoutLink className="cta-gradient inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  Buy Rust Cheats
                </CheckoutLink>
              </div>
            </div>
          </div>
        </section>

        <section className="page-x py-14 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Dated changelog
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
              Newest first. Cross-check the guide at{' '}
              <a
                href={blogPath('undetected-status')}
                className="text-z-soft underline-offset-2 hover:underline"
              >
                Status guide
              </a>{' '}
              before checkout.
            </p>

            <ol className="mt-10 space-y-8">
              {STATUS_LOG.map((entry) => (
                <li key={`${entry.date}-${entry.title}`} className="border-b border-white/[0.08] pb-8 last:border-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <time dateTime={entry.date} className="text-sm font-medium text-white/45">
                      {entry.date}
                    </time>
                    <span className={`text-sm font-semibold ${statusTone(entry.status)}`}>
                      {entry.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55 sm:text-base">
                    {entry.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <SiteFooter currentPath="/status" />
      </main>
    </div>
  )
}
