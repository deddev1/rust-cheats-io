import { Navbar } from '../components/Navbar'
import { SiteFooter } from '../components/SiteFooter'
import { FaqSection } from '../components/FaqSection'
import { CheckoutLink } from '../components/CheckoutLink'
import { SITE_NAME } from '../data/site'
import { SUPPORT_FAQS, SUPPORT_INTRO, SUPPORT_LEAD, SUPPORT_STEPS } from '../data/support'
import { renderLinkedText } from '../lib/linked-text'

export function SupportPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-z-bg text-white">
      <div className="border-b border-z-soft/15 bg-z-bg/90 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="page-body">
        <section className="page-x pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-z-soft">
              {SITE_NAME.toUpperCase()} · HELP
            </p>
            <nav
              className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-white/50"
              aria-label="Breadcrumb"
            >
              <a
                href="/"
                className="underline-offset-2 hover:text-white hover:underline"
              >
                Home
              </a>
              <span className="text-white/30" aria-hidden>
                /
              </span>
              <span className="text-white/70">Support</span>
            </nav>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-z-soft">Rust Cheats</span>{' '}
              <span className="text-white">Support</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-white/50 sm:text-lg">
              {SUPPORT_INTRO}
            </p>
            <p className="mt-3 text-base leading-relaxed text-white/50 sm:text-lg [&_a]:text-z-soft [&_a]:underline-offset-2 hover:[&_a]:underline">
              {renderLinkedText(SUPPORT_LEAD)}
            </p>

            <h2 className="mt-14 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              How we help
            </h2>

            <ol className="mt-8 space-y-10 sm:space-y-12">
              {SUPPORT_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4 sm:gap-5">
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-z-deep text-sm font-semibold text-white"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50 sm:text-base [&_a]:text-z-soft [&_a]:underline-offset-2 hover:[&_a]:underline">
                      {renderLinkedText(step.body)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <FaqSection
          id="faq"
          heading="Support FAQ"
          items={SUPPORT_FAQS}
          bordered={false}
          className="!pt-16 !pb-12 sm:!pt-20 sm:!pb-14"
        />

        <section className="page-x border-t border-white/[0.08] py-14 sm:py-16">
          <div className="mx-auto flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <div className="min-w-0 max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Need help now?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/50 sm:text-base">
                Confirm status on the product page, then buy or reopen your order for delivery
                support.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/rust-cheats"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Product details
              </a>
              <CheckoutLink className="cta-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Buy Rust Cheats
              </CheckoutLink>
            </div>
          </div>
        </section>

        <SiteFooter currentPath="/support" />
      </main>
    </div>
  )
}
