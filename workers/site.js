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
  // Force HTTPS on the canonical host, or redirect www → rustcheats.io.
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

function withSeoHeaders(pathname, response) {
  const headers = new Headers(response.headers)
  if (pathname === '/robots.txt') {
    headers.set('content-type', 'text/plain; charset=utf-8')
  } else if (pathname.endsWith('.css')) {
    headers.set('content-type', 'text/css; charset=utf-8')
  } else if (pathname.endsWith('.xml')) {
    // text/xml is widely accepted by GSC; keep charset explicit
    headers.set('content-type', 'text/xml; charset=utf-8')
  }
  headers.set('cache-control', 'public, max-age=3600')
  headers.set('x-content-type-options', 'nosniff')
  headers.set('x-robots-tag', 'noindex')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (needsCanonicalRedirect(url)) {
      return canonicalRedirect(url)
    }

    const pathname = url.pathname

    // SEO files: never 500 to crawlers — soft-fail with 503 + Retry-After
    if (SEO_FILES.has(pathname)) {
      try {
        const assetResponse = await assetsFetch(env, request, pathname + url.search)
        if (assetResponse.status >= 500) {
          return new Response('SEO file temporarily unavailable\n', {
            status: 503,
            headers: {
              'content-type': 'text/plain; charset=utf-8',
              'retry-after': '120',
              'cache-control': 'no-store',
            },
          })
        }
        return withSeoHeaders(pathname, assetResponse)
      } catch {
        return new Response('SEO file temporarily unavailable\n', {
          status: 503,
          headers: {
            'content-type': 'text/plain; charset=utf-8',
            'retry-after': '120',
            'cache-control': 'no-store',
          },
        })
      }
    }

    const assetResponse = await assetsFetch(env, request, pathname + url.search)
    return withHtmlCharset(assetResponse)
  },
}
