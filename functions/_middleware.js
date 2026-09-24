/**
 * Host redirects for legacy Pages Functions (if invoked).
 * Primary redirects live in workers/site.js for `npx wrangler deploy`.
 * /sitemap.xml is excluded in public/_routes.json so crawlers get a static file.
 */
const CANONICAL_HOST = 'rustcheats.io'
const LEGACY_HOSTS = new Set(['www.rustcheats.io'])

export async function onRequest(context) {
  const url = new URL(context.request.url)
  const host = url.hostname.toLowerCase()
  const needsHttps = url.protocol === 'http:'
  const needsHostFix = LEGACY_HOSTS.has(host)

  if ((host === CANONICAL_HOST || needsHostFix) && (needsHttps || needsHostFix)) {
    url.protocol = 'https:'
    url.hostname = CANONICAL_HOST
    return Response.redirect(url.toString(), 301)
  }

  return context.next()
}
