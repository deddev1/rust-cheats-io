import type { ReactNode } from 'react'

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

/** Render FAQ/body text with simple markdown links: [label](/path) */
export function renderLinkedText(text: string): ReactNode {
  const parts: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  const re = new RegExp(LINK_RE.source, 'g')
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const [, label, href] = match
    const external = href.startsWith('http')
    parts.push(
      <a
        key={`${href}-${match.index}`}
        href={href}
        className="text-white underline underline-offset-2 hover:text-z-soft"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>,
    )
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 1 ? parts[0] : parts
}
