/** Forum thread path helpers — keep post bodies out of shared chunks. */

export function blogPath(slug: string) {
  return `/forums/${slug}`
}

export function forumsPath() {
  return '/forums'
}

/** Stable anchor id for a forum section heading (shared by page + search). */
export function sectionId(heading: string) {
  return heading
    .replace(/^\d+\)\s*/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function blogSectionPath(slug: string, heading: string) {
  return `${blogPath(slug)}#${sectionId(heading)}`
}
