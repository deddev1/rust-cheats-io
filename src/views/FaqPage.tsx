import { Navbar } from '../components/Navbar'
import { SiteFooter } from '../components/SiteFooter'
import { FaqSection } from '../components/FaqSection'
import { SITE_FAQS } from '../data/faqs'
import { SITE_NAME } from '../data/site'

/** Clean accordion FAQ — brand label, H1, intro, then All questions list. */
export function FaqPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-z-bg text-white">
      <div className="border-b border-white/[0.06] bg-z-bg/90 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="page-body">
        <section className="page-x pt-14 sm:pt-20 lg:pt-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-z-soft">
              {SITE_NAME}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Rust Cheats FAQ
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
              EAC status, ESP, Aimbot, wallhack, buying, loading, support and refunds —
              straight answers before you checkout.
            </p>
          </div>
        </section>

        <FaqSection
          id="faq"
          heading="All questions"
          items={SITE_FAQS}
          className="border-t-0 pb-20 pt-10 sm:pb-28 sm:pt-14"
        />

        <SiteFooter currentPath="/faq" />
      </main>
    </div>
  )
}
