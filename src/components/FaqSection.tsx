import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '../data/faqs'
import { renderLinkedText } from '../lib/linked-text'

type FaqSectionProps = {
  id?: string
  heading: string
  intro?: string
  items: FaqItem[]
  className?: string
  footerHref?: string
  footerLabel?: string
  /** Top rule — default true */
  bordered?: boolean
}

/**
 * Accordion FAQ: H2 + optional intro + chevron rows.
 * Native <details> — no client JS required for open/close.
 */
export function FaqSection({
  id = 'faq',
  heading,
  intro,
  items,
  className = '',
  footerHref,
  footerLabel = 'Full FAQ →',
  bordered = true,
}: FaqSectionProps) {
  return (
    <section
      id={id}
      className={`page-x py-16 sm:py-20 ${bordered ? 'border-t border-white/[0.06]' : ''} ${className}`.trim()}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id={`${id}-heading`}
          className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
        >
          {heading}
        </h2>
        {intro ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
            {intro}
          </p>
        ) : null}

        <div className="mt-10 border-t border-white/[0.08]">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-white/[0.08]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="pr-2 text-base font-semibold leading-snug text-white sm:text-lg">
                  {item.q}
                </span>
                <ChevronDown
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </summary>
              <div className="pb-5 pr-10 text-sm leading-relaxed text-white/50 sm:text-base">
                {renderLinkedText(item.a)}
              </div>
            </details>
          ))}
        </div>

        {footerHref ? (
          <a
            href={footerHref}
            className="mt-8 inline-flex text-sm font-medium text-z-soft transition-colors hover:text-z-ink"
          >
            {footerLabel}
          </a>
        ) : null}
      </div>
    </section>
  )
}
