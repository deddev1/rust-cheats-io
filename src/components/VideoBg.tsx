import { useEffect, useRef, useState } from 'react'
import {
  HERO_POSTER_ALT,
  HERO_POSTER_HEIGHT,
  HERO_POSTER_JPG,
  HERO_POSTER_SIZES,
  HERO_POSTER_WEBP_SRCSET,
  HERO_POSTER_WIDTH,
} from '../data/hero-poster'

/** Cached, compressed hero loop — poster remains LCP. */
const HERO_MP4 = '/videos/rust-hero.mp4?v=hq1920'

type VideoBgProps = {
  /** Static full-bleed hero image — skips video when set. */
  image?: string
  imageAlt?: string
  /** Stronger dark + violet overlay for headline contrast (homepage). */
  readable?: boolean
}

function shouldSkipVideo() {
  if (typeof window === 'undefined') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  // Mobile / touch: keep poster only — biggest Lighthouse + cellular win
  if (window.matchMedia('(max-width: 1023px), (hover: none)').matches) return true
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection
  if (conn?.saveData) return true
  if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') return true
  return false
}

export function VideoBg({ image, imageAlt = '', readable = false }: VideoBgProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loadVideo, setLoadVideo] = useState(false)

  // Defer network until after first paint / idle so poster wins LCP
  useEffect(() => {
    if (image || shouldSkipVideo()) return

    let idleId = 0
    let timeoutId = 0

    const arm = () => setLoadVideo(true)

    const afterLoad = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(arm, { timeout: 1800 })
      } else {
        timeoutId = window.setTimeout(arm, 900)
      }
    }

    if (document.readyState === 'complete') afterLoad()
    else {
      window.addEventListener('load', afterLoad, { once: true })
      // Fallback if load already fired oddly
      timeoutId = window.setTimeout(afterLoad, 2500)
    }

    return () => {
      window.removeEventListener('load', afterLoad)
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [image])

  useEffect(() => {
    if (!loadVideo || image) return
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = true

    const kick = () => {
      void video.play().catch(() => {})
    }

    video.addEventListener('canplay', kick)
    kick()

    return () => {
      video.removeEventListener('canplay', kick)
    }
  }, [loadVideo, image])

  return (
    <div
      className={`hero-video-wrap absolute inset-0 z-0 overflow-hidden pointer-events-none select-none${readable ? ' hero-video--readable' : ''}${image ? ' hero-video--still' : ''}`}
    >
      <div className="absolute inset-0 z-0 bg-z-bg" aria-hidden />
      {image ? (
        <img
          src={image}
          alt={imageAlt}
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
          className="hero-video-bg absolute inset-0 z-[1] h-full w-full object-cover object-center"
        />
      ) : (
        <>
          {/* LCP still — always painted first; video swaps in later */}
          <picture>
            <source type="image/webp" srcSet={HERO_POSTER_WEBP_SRCSET} sizes={HERO_POSTER_SIZES} />
            <img
              src={HERO_POSTER_JPG}
              alt={HERO_POSTER_ALT}
              width={HERO_POSTER_WIDTH}
              height={HERO_POSTER_HEIGHT}
              sizes={HERO_POSTER_SIZES}
              decoding="sync"
              fetchPriority="high"
              className="hero-video-bg absolute inset-0 z-[1] h-full w-full object-cover object-center"
            />
          </picture>
          {loadVideo ? (
            <video
              ref={videoRef}
              className="hero-video-bg absolute inset-0 z-[1] h-full w-full object-cover object-center motion-reduce:hidden"
              src={HERO_MP4}
              poster={HERO_POSTER_JPG}
              muted
              autoPlay
              playsInline
              loop
              preload="none"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden
              tabIndex={-1}
            />
          ) : null}
        </>
      )}
      <div className="hero-video-tint pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div className="hero-video-tint-glow pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div
        className="hero-video-edge-bottom absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-z-bg via-z-bg/80 to-transparent"
        aria-hidden
      />
      <div
        className="hero-video-edge-top absolute inset-x-0 top-0 z-[3] h-24 bg-gradient-to-b from-z-bg/70 to-transparent"
        aria-hidden
      />
    </div>
  )
}
