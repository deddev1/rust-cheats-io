import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import {
  RUST_PRODUCT_PREVIEW_MP4,
  RUST_PRODUCT_PREVIEW_POSTER,
} from '../data/media'

const POSTER_WEBP = '/media/rust-product-preview-poster.webp'

type ProductPreviewVideoProps = {
  className?: string
  label?: string
}

/**
 * Product-page preview: poster paints first; MP4 loads only after Play.
 * Keeps Lighthouse from counting a multi‑MB video against LCP / network.
 */
export function ProductPreviewVideo({
  className = '',
  label = 'Rust cheats gameplay preview',
}: ProductPreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const video = videoRef.current
    if (!video) return
    void video.play().catch(() => {})
  }, [armed])

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-z-soft/20 bg-black ${className}`.trim()}
    >
      <div className="relative aspect-video w-full lg:aspect-[21/9]">
        {!armed ? (
          <button
            type="button"
            onClick={() => setArmed(true)}
            className="group absolute inset-0 z-[1] flex h-full w-full items-center justify-center"
            aria-label={`Play ${label}`}
          >
            <picture>
              <source type="image/webp" srcSet={POSTER_WEBP} />
              <img
                src={RUST_PRODUCT_PREVIEW_POSTER}
                alt=""
                width={960}
                height={540}
                decoding="async"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
            <span className="relative z-[2] inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/55 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors group-hover:border-white/40 group-hover:bg-black/70">
              <Play className="h-4 w-4 fill-current" strokeWidth={0} aria-hidden />
              Play preview
            </span>
          </button>
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={RUST_PRODUCT_PREVIEW_POSTER}
            aria-label={label}
          >
            <source src={`${RUST_PRODUCT_PREVIEW_MP4}?v=lh720`} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  )
}
