import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { FormEvent, KeyboardEvent } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { BLOGS, blogPath, blogSectionPath } from '../data/blogs'
import { guidePath } from '../data/games'

type SearchHit = {
  href: string
  label: string
  meta: string
  priority: number
}

type RouteRow = {
  keys: string[]
  href: string
  label: string
  meta: string
  priority: number
}

type HeroSearchProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

const PRODUCT = guidePath('rust')

/**
 * One keyword can map to many destinations (product + forum + setup).
 * Searching "esp" should list every relevant option, not a single winner.
 */
const ROUTES: RouteRow[] = [
  // —— Product / site pages ——
  {
    keys: ['buy', 'get', 'purchase', 'checkout', 'price', 'pricing', 'order', 'product', 'license'],
    href: PRODUCT,
    label: 'Buy Rust Cheats',
    meta: 'Product',
    priority: 100,
  },
  {
    keys: ['faq', 'faqs', 'question', 'questions'],
    href: '/faq',
    label: 'FAQ',
    meta: 'FAQ',
    priority: 100,
  },
  {
    keys: ['review', 'reviews', 'rating', 'ratings', 'feedback'],
    href: '/reviews',
    label: 'Reviews',
    meta: 'Reviews',
    priority: 100,
  },
  {
    keys: ['support', 'ticket', 'contact', 'help'],
    href: '/support',
    label: 'Support',
    meta: 'Support',
    priority: 100,
  },

  // —— ESP / wallhack / aimbot → product + forum + setup + hotkeys ——
  {
    keys: ['esp', 'wallhack', 'wallhacks', 'loot', 'aimbot', 'softaim', 'stream', 'streamproof', 'finder', 'feature', 'features'],
    href: PRODUCT,
    label: 'ESP & features',
    meta: 'Product',
    priority: 100,
  },
  {
    keys: ['esp', 'wallhack', 'wallhacks', 'loot', 'aimbot', 'softaim', 'stream', 'streamproof', 'finder', 'feature', 'features'],
    href: blogPath('features-list'),
    label: 'ESP checklist',
    meta: 'Forum',
    priority: 96,
  },
  {
    keys: ['esp', 'wallhack', 'wallhacks', 'loot', 'aimbot', 'softaim', 'feature', 'features'],
    href: blogSectionPath('features-list', 'Features list'),
    label: 'Feature checklist',
    meta: 'Forum',
    priority: 95,
  },
  {
    keys: ['esp', 'wallhack', 'wallhacks', 'enable', 'config'],
    href: blogPath('complete-setup'),
    label: 'Enable ESP after load',
    meta: 'Setup',
    priority: 92,
  },
  {
    keys: ['esp', 'wallhack', 'wallhacks', 'toggle', 'hotkey', 'hotkeys'],
    href: blogPath('hotkeys'),
    label: 'ESP hotkeys',
    meta: 'Hotkeys',
    priority: 90,
  },
  {
    keys: ['soft aim'],
    href: PRODUCT,
    label: 'Soft aim product',
    meta: 'Product',
    priority: 99,
  },
  {
    keys: ['soft aim'],
    href: blogSectionPath('features-list', 'Features list'),
    label: 'Soft aim features',
    meta: 'Forum',
    priority: 97,
  },

  // —— Setup / load ——
  {
    keys: ['steam', 'load', 'loading', 'loader'],
    href: blogSectionPath('complete-setup', '3) Load order'),
    label: 'Load order',
    meta: 'Setup',
    priority: 95,
  },
  {
    keys: ['steam', 'load', 'loading', 'loader'],
    href: PRODUCT,
    label: 'Status before load',
    meta: 'Product',
    priority: 88,
  },
  {
    keys: ['setup', 'install', 'instructions', 'checklist'],
    href: blogPath('complete-setup'),
    label: 'Complete setup',
    meta: 'Setup',
    priority: 94,
  },
  {
    keys: ['setup', 'install', 'instructions', 'checklist'],
    href: PRODUCT,
    label: 'Buy then setup',
    meta: 'Product',
    priority: 86,
  },
  {
    keys: ['hotkey', 'hotkeys', 'keys', 'menu', 'toggle'],
    href: blogPath('hotkeys'),
    label: 'Hotkeys',
    meta: 'Hotkeys',
    priority: 95,
  },
  {
    keys: ['antivirus', 'defender', 'exclusion', 'allowlist', 'quarantine', 'norton', 'avast'],
    href: blogPath('disable-antivirus'),
    label: 'AV exclusions',
    meta: 'Antivirus',
    priority: 95,
  },
  {
    keys: ['undetected', 'status', 'updating', 'eac', 'refund', 'refunds', 'changelog'],
    href: '/status',
    label: 'Status changelog',
    meta: 'Status',
    priority: 98,
  },
  {
    keys: ['undetected', 'status', 'updating', 'eac', 'refund', 'refunds'],
    href: blogPath('undetected-status'),
    label: 'Check before you buy',
    meta: 'Status',
    priority: 95,
  },
  {
    keys: ['undetected', 'status', 'updating', 'eac'],
    href: PRODUCT,
    label: 'Live product status',
    meta: 'Product',
    priority: 93,
  },
  {
    keys: ['spoofer', 'hwid', 'spoof'],
    href: blogPath('features-list'),
    label: 'HWID spoofer',
    meta: 'Features',
    priority: 94,
  },
  {
    keys: ['spoofer', 'hwid', 'spoof'],
    href: PRODUCT,
    label: 'Spoofer on product',
    meta: 'Product',
    priority: 90,
  },
]

function wordsOf(raw: string): string[] {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean)
}

function keyMatches(q: string, qWords: string[], key: string): boolean {
  if (key.includes(' ')) return q.includes(key)
  if (q === key || q === `${key}s`) return true
  return qWords.some(
    (w) => w === key || w === `${key}s` || (key.length >= 3 && (w.startsWith(key) || key.startsWith(w))),
  )
}

function buildHits(raw: string): SearchHit[] {
  const q = raw.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!q) return []
  const qWords = wordsOf(q)
  const hits: SearchHit[] = []

  if (
    q === 'rust' ||
    q === 'rust cheat' ||
    q === 'rust cheats' ||
    q === 'cheats' ||
    q === 'hack' ||
    q === 'hacks'
  ) {
    hits.push({
      href: PRODUCT,
      label: 'Buy Rust Cheats',
      meta: 'Product',
      priority: 90,
    })
    hits.push({
      href: blogPath('features-list'),
      label: 'ESP checklist',
      meta: 'Forum',
      priority: 85,
    })
    hits.push({
      href: blogPath('complete-setup'),
      label: 'Complete setup guide',
      meta: 'Setup',
      priority: 84,
    })
  }

  for (const row of ROUTES) {
    if (row.keys.some((k) => keyMatches(q, qWords, k))) {
      hits.push({
        href: row.href,
        label: row.label,
        meta: row.meta,
        priority: row.priority,
      })
    }
  }

  for (const post of BLOGS) {
    const slugWords = wordsOf(post.slug)
    const titleWords = wordsOf(post.title)
    const tagWords = wordsOf(post.tag)
    const termWords = wordsOf(post.searchTerms)
    const excerptWords = wordsOf(post.excerpt)
    const bank = new Set([...slugWords, ...titleWords, ...tagWords, ...termWords, ...excerptWords])

    let score = 0
    for (const w of qWords) {
      if (w.length < 3) continue
      if (w === 'rust' || w === 'cheat' || w === 'cheats') continue
      if (slugWords.includes(w)) score = Math.max(score, 88)
      else if (tagWords.includes(w)) score = Math.max(score, 86)
      else if (termWords.includes(w)) score = Math.max(score, 84)
      else if (titleWords.includes(w)) score = Math.max(score, 82)
      else if (excerptWords.includes(w) || bank.has(w)) score = Math.max(score, 80)
    }

    if (q === post.tag.toLowerCase() || q === post.slug.replace(/-/g, ' ')) score = Math.max(score, 93)
    if (q === post.title.toLowerCase()) score = Math.max(score, 97)

    // Phrase contained in guide text
    const hay = `${post.title} ${post.excerpt} ${post.tag} ${post.searchTerms} ${post.slug}`.toLowerCase()
    if (score === 0 && hay.includes(q)) score = 78

    if (score > 0) {
      hits.push({
        href: blogPath(post.slug),
        label: post.title,
        meta: post.tag,
        priority: score,
      })
    }
  }

  hits.sort((a, b) => b.priority - a.priority || a.label.localeCompare(b.label))

  // Keep every distinct destination (product vs forum vs setup vs #section)
  const seen = new Set<string>()
  const out: SearchHit[] = []
  for (const h of hits) {
    if (h.href === '/forums' || h.href.startsWith('/forums?')) continue
    if (seen.has(h.href)) continue
    seen.add(h.href)
    out.push(h)
    if (out.length >= 14) break
  }
  return out
}

/** Always prefer a concrete thread/page — never /forums?q= */
function resolveHref(raw: string, hits: SearchHit[], active: number): string {
  const pick = hits[Math.min(active, Math.max(hits.length - 1, 0))] ?? hits[0]
  if (pick?.href) return pick.href

  const q = raw.trim().toLowerCase()
  if (!q) return PRODUCT

  const soft = BLOGS.find((b) => {
    const hay = `${b.title} ${b.excerpt} ${b.tag} ${b.searchTerms} ${b.slug}`.toLowerCase()
    return hay.includes(q) || wordsOf(q).some((w) => w.length >= 3 && hay.includes(w))
  })
  if (soft) return blogPath(soft.slug)

  return PRODUCT
}

export function HeroSearch({
  value,
  onChange,
  placeholder = 'Search Rust Cheats…',
  autoFocus = false,
  className = '',
}: HeroSearchProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLFormElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [internal, setInternal] = useState(value ?? '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null)

  const q = value !== undefined ? value : internal
  const hits = useMemo(() => buildHits(q), [q])

  useEffect(() => {
    if (value !== undefined) setInternal(value)
  }, [value])

  useLayoutEffect(() => {
    if (!open || hits.length === 0) {
      setMenuPos(null)
      return
    }
    function place() {
      const el = boxRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setMenuPos({ top: r.bottom + 8, left: r.left, width: r.width })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, hits.length, q])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node
      if (rootRef.current?.contains(t) || listRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function setQuery(next: string) {
    if (value === undefined) setInternal(next)
    onChange?.(next)
    setOpen(true)
    setActive(0)
  }

  function navigate(href: string) {
    setOpen(false)
    window.location.assign(href)
  }

  function runSearch() {
    const term = q.trim()
    const nextHits = buildHits(term)
    const href = resolveHref(term, nextHits, active)
    navigate(href)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    runSearch()
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!hits.length) return
      setOpen(true)
      setActive((i) => Math.min(i + 1, hits.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      runSearch()
      return
    }
    if (e.key === 'Escape') setOpen(false)
  }

  const showList = open && hits.length > 0 && menuPos

  return (
    <div ref={rootRef} className={`relative z-[60] w-full max-w-xl pointer-events-auto ${className}`}>
      <form
        ref={boxRef}
        role="search"
        onSubmit={onSubmit}
        className="relative z-[60] flex w-full max-w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white sm:p-1.5 sm:shadow-[0_8px_32px_rgba(176,64,251,0.28)]"
      >
        <div className="flex w-full min-w-0 items-center gap-2 rounded-full bg-white px-4 py-3 sm:flex-1 sm:rounded-none sm:bg-transparent sm:px-4 sm:py-2">
          <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.75} aria-hidden />
          <input
            type="text"
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (buildHits(q).length) setOpen(true)
            }}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            placeholder={placeholder}
            aria-label={placeholder}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={Boolean(showList)}
            className="w-full min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder-gray-400"
            autoComplete="off"
            enterKeyHint="go"
          />
        </div>
        <button
          type="submit"
          className="cta-gradient inline-flex w-full items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto sm:shrink-0 sm:py-2.5"
        >
          Go
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </form>

      {showList && menuPos
        ? createPortal(
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              style={{
                position: 'fixed',
                top: menuPos.top,
                left: menuPos.left,
                width: menuPos.width,
                zIndex: 10000,
              }}
              className="search-results max-h-80 overflow-y-auto rounded-2xl border border-z-soft/20 bg-z-card py-2 shadow-glow"
            >
              {hits.map((hit, i) => (
                <li key={`${hit.href}-${hit.label}`} role="option" aria-selected={i === active}>
                  <a
                    href={hit.href}
                    onMouseEnter={() => setActive(i)}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(hit.href)
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm no-underline transition-colors ${
                      i === active
                        ? 'bg-z-accent/20 text-z-ink'
                        : 'text-white/75 hover:bg-z-accent/10'
                    }`}
                  >
                    <span className="min-w-0 truncate font-medium">{hit.label}</span>
                    <span className="shrink-0 text-xs text-z-soft/70">{hit.meta}</span>
                  </a>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
}
