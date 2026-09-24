import { useEffect, useRef, useState } from 'react'
import { getResponsiveSpec } from '../data/responsive-images'
import { ResponsiveImage } from './ResponsiveImage'

const REVIEWS_VIDEO = '/videos/rust-card-loop'

type LocalVideoStripProps = {
  className?: string
  /** Path without extension, e.g. `/videos/rust-card-loop` — serves .mp4 */
  src?: string
  /** Optional soft seek after playback starts (seconds). Prefer 0 for reliability. */
  startAt?: number
  /** @deprecated Prefer lazy IO — kept for API compat, ignored for Lighthouse */
  eager?: boolean
  poster?: string
  posterAlt?: string
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function saveDataOrSlow() {
  if (typeof navigator === 'undefined') return false
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection
  if (conn?.saveData) return true
  return conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g'
}

function stripBase(src: string) {
  return src.replace(/\.(webm|mp4)$/i, '')
}

export function LocalVideoStrip({
  className = '',
  src = REVIEWS_VIDEO,
  startAt = 0,
  poster = '/media/rust-product-preview-poster.jpg',
  posterAlt = 'Rust cheats gameplay still from product video',
}: LocalVideoStripProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(false)
  const [failed, setFailed] = useState(false)
  const base = stripBase(src)

  useEffect(() => {
    if (prefersReducedMotion() || saveDataOrSlow()) return

    const root = wrapRef.current
    if (!root) return

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true)
          io.disconnect()
        }
      },
      { rootMargin: '120px 0px', threshold: 0.01 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    const video = ref.current
    if (!video) return

    let cancelled = false
    let showTimer: ReturnType<typeof setTimeout> | undefined
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    let seekTimer: ReturnType<typeof setTimeout> | undefined
    const reduced = prefersReducedMotion()

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = true
    video.controls = false
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    const show = () => {
      if (!cancelled) setVisible(true)
    }

    const softSeek = () => {
      if (!startAt || reduced) return
      if (!Number.isFinite(video.duration) || video.duration <= startAt + 0.5) return
      try {
        if (Math.abs(video.currentTime - startAt) > 0.35) {
          video.currentTime = startAt
        }
      } catch {
        /* ignore */
      }
    }

    const play = () => {
      if (cancelled) return
      if (reduced) {
        show()
        return
      }
      void video
        .play()
        .then(() => {
          show()
          seekTimer = setTimeout(softSeek, 250)
        })
        .catch(() => {
          if (video.readyState >= 2) show()
          retryTimer = setTimeout(() => {
            if (cancelled) return
            void video.play().then(show).catch(() => show())
          }, 350)
        })
    }

    const onLoadedData = () => play()
    const onCanPlay = () => play()
    const onPlaying = () => show()
    const onEnded = () => {
      softSeek()
      void video.play().catch(() => {})
    }
    const onError = () => {
      setFailed(true)
      show()
    }
    const onVisibility = () => {
      if (document.hidden || reduced || cancelled) return
      if (video.paused) void video.play().catch(() => {})
    }

    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)
    document.addEventListener('visibilitychange', onVisibility)

    showTimer = setTimeout(show, 1200)

    if (video.readyState >= 2) play()
    else video.load()

    return () => {
      cancelled = true
      if (showTimer) clearTimeout(showTimer)
      if (retryTimer) clearTimeout(retryTimer)
      if (seekTimer) clearTimeout(seekTimer)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [active, base, startAt])

  return (
    <div
      ref={wrapRef}
      className={`video-strip relative w-full overflow-hidden pointer-events-none select-none ${className}`.trim()}
    >
      <div className="absolute inset-0 z-0 bg-z-band" aria-hidden />
      {poster ? (
        <ResponsiveImage
          spec={getResponsiveSpec(poster)}
          src={poster}
          alt={posterAlt}
          width={800}
          height={450}
          sizes="100vw"
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-70"
        />
      ) : null}
      {active && !failed ? (
        <video
          ref={ref}
          className={`video-strip-local absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          autoPlay
          playsInline
          loop
          preload="none"
          poster={poster}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
        >
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      ) : null}
      <div className="video-strip-tint pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div className="video-strip-tint-glow pointer-events-none absolute inset-0 z-[2]" aria-hidden />
    </div>
  )
}
