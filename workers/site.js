/**
 * Worker entry for Astro static output in ./dist.
 * IMPORTANT: Always fetch assets via https://assets.local — never the request
 * hostname — or Cloudflare returns HTTP 522 on custom domains.
 */
const CANONICAL_HOST = 'rustcheats.io'
const LEGACY_HOSTS = new Set(['www.rustcheats.io'])

/** Crawler-critical files — always go through Worker for host redirects + MIME. */
const SEO_FILES = new Set([
  '/sitemap.xml',
  '/sitemap-pages.xml',
  '/sitemap-products.xml',
  '/sitemap-forums.xml',
  '/sitemap-images.xml',
  '/sitemap.css',
  '/robots.txt',
])

function needsCanonicalRedirect(url) {
  const host = url.hostname.toLowerCase()
  return url.protocol === 'http:' || LEGACY_HOSTS.has(host)
}

function canonicalRedirect(url) {
  const next = new URL(url.toString())
  next.protocol = 'https:'
  next.hostname = CANONICAL_HOST
  return Response.redirect(next.toString(), 301)
}

function assetsFetch(env, request, pathname) {
  return env.ASSETS.fetch(new Request(new URL(pathname, 'https://assets.local'), request))
}

function withHtmlCharset(response) {
  const contentType = response.headers.get('content-type') || ''
  const primary = contentType.split(',')[0].trim()
  if (!primary.toLowerCase().startsWith('text/html')) return response
  if (/charset=/i.test(primary)) {
    if (contentType.includes(',')) {
      const headers = new Headers(response.headers)
      headers.set('content-type', primary)
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    }
    return response
  }
  const headers = new Headers(response.headers)
  headers.set('content-type', 'text/html; charset=utf-8')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function looksLikeHtml(text, contentType) {
  const type = (contentType || '').toLowerCase()
  if (type.includes('text/html')) return true
  const head = text.slice(0, 256).toLowerCase()
  return (
    head.includes('<!doctype html') ||
    head.includes('<html') ||
    head.includes('<head>') ||
    head.includes('<body')
  )
}

function seoUnavailable() {
  return new Response('SEO file temporarily unavailable\n', {
    status: 503,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'retry-after': '120',
      'cache-control': 'no-store',
    },
  })
}

async function serveSeoFile(env, request, pathname, search) {
  try {
    const assetResponse = await assetsFetch(env, request, pathname + search)
    if (assetResponse.status >= 500) return seoUnavailable()

    const contentType = assetResponse.headers.get('content-type') || ''
    const bodyText = await assetResponse.text()

    // Never hand Google the HTML 404 page labeled as a sitemap
    if (
      assetResponse.status !== 200 ||
      looksLikeHtml(bodyText, contentType) ||
      (pathname.endsWith('.xml') && !bodyText.trimStart().startsWith('<?xml'))
    ) {
      return seoUnavailable()
    }

    const headers = new Headers()
    if (pathname === '/robots.txt') {
      headers.set('content-type', 'text/plain; charset=utf-8')
    } else if (pathname.endsWith('.css')) {
      headers.set('content-type', 'text/css; charset=utf-8')
    } else if (pathname.endsWith('.xml')) {
      headers.set('content-type', 'application/xml; charset=utf-8')
    } else {
      headers.set('content-type', contentType || 'text/plain; charset=utf-8')
    }
    headers.set('cache-control', 'public, max-age=300, must-revalidate')
    headers.set('x-content-type-options', 'nosniff')
    // Allow crawlers to use this URL as a sitemap (do not noindex the document itself in a confusing way)
    headers.set('vary', 'Accept')

    return new Response(bodyText, { status: 200, headers })
  } catch {
    return seoUnavailable()
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (needsCanonicalRedirect(url)) {
      return canonicalRedirect(url)
    }

    const pathname = url.pathname

    if (SEO_FILES.has(pathname)) {
      return serveSeoFile(env, request, pathname, url.search)
    }

    const assetResponse = await assetsFetch(env, request, pathname + url.search)
    return withHtmlCharset(assetResponse)
  },
}
