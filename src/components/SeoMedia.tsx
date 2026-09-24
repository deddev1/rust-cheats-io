import type { SeoMediaItem } from '../data/media'
import { getResponsiveSpec } from '../data/responsive-images'
import { ResponsiveImage } from './ResponsiveImage'

type SeoMediaProps = {
  media: SeoMediaItem
  priority?: boolean
  className?: string
  showVideo?: boolean
}

export function SeoMedia({
  media,
  priority = false,
  className = '',
  showVideo = true,
}: SeoMediaProps) {
  const hasVideo = showVideo && media.video
  const responsive = getResponsiveSpec(media.image)
  return (
    <figure className={`page-card overflow-hidden rounded-2xl ${className}`.trim()}>
      <div className={`grid ${hasVideo ? 'lg:grid-cols-2' : ''}`}>
        <ResponsiveImage
          spec={responsive}
          src={media.image}
          alt={media.alt}
          title={media.title}
          width={800}
          height={450}
          priority={priority}
          className="aspect-video h-full w-full object-cover"
        />
        {hasVideo ? (
          <video
            muted
            autoPlay
            loop
            playsInline
            preload="none"
            poster={media.image}
            aria-label={media.videoTitle || media.title}
            className="aspect-video h-full w-full bg-black object-cover"
          >
            <source src={media.video} type="video/mp4" />
          </video>
        ) : null}
      </div>
      <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-white/50">
        {media.caption}
      </figcaption>
    </figure>
  )
}
