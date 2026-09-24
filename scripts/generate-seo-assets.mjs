import { existsSync, unlinkSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { generateThemeHeroFromBox } from './lib/theme-hero-box.mjs'

const require = createRequire(import.meta.url)
const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ogDir = join(root, 'public', 'og')
const mediaDir = join(root, 'public', 'media')
const videoDir = join(root, 'public', 'videos')
const cheatDir = join(root, 'source-media', 'cheat')

await Promise.all([
  mkdir(ogDir, { recursive: true }),
  mkdir(mediaDir, { recursive: true }),
  mkdir(videoDir, { recursive: true }),
])

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function artwork(width, height, eyebrow, title, subtitle, footer = 'rustcheats.io') {
  const titleSize = Math.round(width * 0.066)
  const subtitleSize = Math.round(width * 0.026)
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#08060f"/>
          <stop offset="0.55" stop-color="#14101f"/>
          <stop offset="1" stop-color="#2a1548"/>
        </linearGradient>
        <radialGradient id="glow">
          <stop stop-color="#b040fb" stop-opacity=".7"/>
          <stop offset="1" stop-color="#b040fb" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="${width * 0.83}" cy="${height * 0.18}" r="${width * 0.34}" fill="url(#glow)"/>
      <circle cx="${width * 0.12}" cy="${height * 0.88}" r="${width * 0.28}" fill="url(#glow)" opacity=".35"/>
      <g transform="translate(${width * 0.075} ${height * 0.12})" fill="#c084fc">
        <path d="M60 60C60 93.1 33.1 120 0 120C0 86.9 26.9 60 60 60ZM60 60C93.1 60 120 86.9 120 120C86.9 120 60 93.1 60 60ZM0 0C33.1 0 60 26.9 60 60C26.9 60 0 33.1 0 0ZM120 0C120 33.1 93.1 60 60 60C60 26.9 86.9 0 120 0Z"/>
      </g>
      <text x="${width * 0.075}" y="${height * 0.47}" fill="#c084fc" font-size="${width * 0.022}" font-family="Arial, sans-serif" font-weight="700" letter-spacing="6">${escapeXml(eyebrow)}</text>
      <text x="${width * 0.075}" y="${height * 0.64}" fill="#ffffff" font-size="${titleSize}" font-family="Arial, sans-serif" font-weight="700">${escapeXml(title)}</text>
      <text x="${width * 0.075}" y="${height * 0.75}" fill="#c9bdd2" font-size="${subtitleSize}" font-family="Arial, sans-serif">${escapeXml(subtitle)}</text>
      <text x="${width * 0.075}" y="${height * 0.9}" fill="#9299a3" font-size="${width * 0.018}" font-family="Arial, sans-serif">${escapeXml(footer)}</text>
    </svg>
  `)
}

function cheatPath(index) {
  return join(cheatDir, `${String(index).padStart(2, '0')}.jpg`)
}

function hasCheatSources() {
  return [1, 2, 3, 4, 5, 6].every((i) => existsSync(cheatPath(i)))
}

async function fromCheat(index, width, height, outPath, format) {
  const input = cheatPath(index)
  let pipeline = sharp(input).rotate().resize(width, height, { fit: 'cover', position: 'centre' })
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality: 76, effort: 4 })
  } else {
    pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true })
  }
  await pipeline.toFile(outPath)
}

async function generatePlaceholderAssets() {
  await Promise.all([
    sharp(
      artwork(
        1200,
        630,
        'WINDOWS PC · LIVE STATUS',
        'Rust Cheats',
        'Player ESP · Radar · Aim Assistance',
      ),
    )
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toFile(join(ogDir, 'rust-cheats.jpg')),
    sharp(
      artwork(
        1440,
        810,
        'PRODUCT DETAILS · WINDOWS PC',
        'Rust ESP & Radar',
        'Features · Compatibility · Current Status',
      ),
    )
      .webp({ quality: 88 })
      .toFile(join(mediaDir, 'rust-product-hero.webp')),
    sharp(
      artwork(
        1000,
        1000,
        'Rust PRODUCT',
        'ESP · Radar · Aim',
        'Check compatibility before access',
      ),
    )
      .webp({ quality: 88 })
      .toFile(join(mediaDir, 'rust-product-cover.webp')),
    sharp(
      artwork(
        1200,
        675,
        'SURVIVAL · WINDOWS PC',
        'Rust Cheats',
        'Player intelligence · Resources · Raids',
      ),
    )
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toFile(join(mediaDir, 'rust-monument.jpg')),
    sharp(
      artwork(
        1200,
        675,
        'ONLINE · WIPE',
        'Rust ESP & Radar',
        'Built for current Steam builds',
      ),
    )
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toFile(join(mediaDir, 'rust-raid-party.jpg')),
    sharp(
      artwork(
        1920,
        1080,
        'FACEPUNCH · STEAM · PC',
        'Rust Cheats',
        'Awareness for wipes, monuments and online raids',
      ),
    )
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toFile(join(mediaDir, 'rust-soldier-hero.jpg')),
  ])
}

async function generateCheatAssets() {
  await Promise.all([
    fromCheat(1, 800, 800, join(mediaDir, 'rust-product-cover.webp'), 'webp'),
    fromCheat(2, 1280, 720, join(mediaDir, 'rust-product-hero.webp'), 'webp'),
    fromCheat(2, 1280, 720, join(mediaDir, 'rust-product-preview-poster.jpg'), 'jpeg'),
    fromCheat(3, 1280, 720, join(mediaDir, 'rust-monument.jpg'), 'jpeg'),
    fromCheat(4, 1280, 720, join(mediaDir, 'rust-raid-party.jpg'), 'jpeg'),
    fromCheat(5, 1280, 720, join(mediaDir, 'rust-soldier-hero.jpg'), 'jpeg'),
    fromCheat(6, 1200, 630, join(ogDir, 'rust-cheats.jpg'), 'jpeg'),
    fromCheat(1, 1280, 720, join(mediaDir, 'rust-hero-poster.jpg'), 'jpeg'),
  ])
}

function resolveFfmpeg() {
  try {
    return require('ffmpeg-static')
  } catch {
    return process.env.FFMPEG_PATH || 'ffmpeg'
  }
}

function encodeHeroClip(ff, heroMp4, { start, duration, width, baseName, crfH264, crfVp9 }) {
  const vf = `scale=${width}:-2:flags=lanczos`
  const mp4Out = join(videoDir, `${baseName}.mp4`)
  const webmOut = join(videoDir, `${baseName}.webm`)

  const mp4 = spawnSync(
    ff,
    [
      '-y',
      '-ss',
      String(start),
      '-t',
      String(duration),
      '-i',
      heroMp4,
      '-an',
      '-vf',
      vf,
      '-r',
      '24',
      '-c:v',
      'libx264',
      '-crf',
      String(crfH264),
      '-preset',
      'fast',
      '-movflags',
      '+faststart',
      '-pix_fmt',
      'yuv420p',
      mp4Out,
    ],
    { stdio: 'pipe' },
  )
  if (mp4.status !== 0) return false

  spawnSync(
    ff,
    [
      '-y',
      '-ss',
      String(start),
      '-t',
      String(duration),
      '-i',
      heroMp4,
      '-an',
      '-vf',
      vf,
      '-r',
      '24',
      '-c:v',
      'libvpx-vp9',
      '-crf',
      String(crfVp9),
      '-b:v',
      '0',
      '-row-mt',
      '1',
      '-deadline',
      'good',
      '-cpu-used',
      '4',
      webmOut,
    ],
    { stdio: 'pipe' },
  )
  return true
}

async function generateGameplayResponsive() {
  const stills = [
    ['rust-soldier-hero.jpg', 'rust-soldier-hero'],
    ['rust-monument.jpg', 'rust-monument'],
    ['rust-raid-party.jpg', 'rust-raid-party'],
  ]
  for (const [file, base] of stills) {
    const input = join(mediaDir, file)
    if (!existsSync(input)) continue
    for (const w of [480, 800]) {
      const h = Math.round((w * 9) / 16)
      await sharp(input)
        .rotate()
        .resize(w, h, { fit: 'cover', position: 'centre' })
        .webp({ quality: 74, effort: 4 })
        .toFile(join(mediaDir, `${base}-${w}w.webp`))
    }
  }

  const productHero = join(mediaDir, 'rust-product-hero.webp')
  if (existsSync(productHero)) {
    for (const w of [480, 800]) {
      const h = Math.round((w * 9) / 16)
      await sharp(productHero)
        .resize(w, h, { fit: 'cover', position: 'centre' })
        .webp({ quality: 74, effort: 4 })
        .toFile(join(mediaDir, `rust-product-hero-${w}w.webp`))
    }
  }
}

async function generateHeroPosters(ff) {
  const heroMp4 = join(videoDir, 'rust-hero.mp4')
  const posterJpg = join(mediaDir, 'rust-hero-poster.jpg')
  const framePath = join(mediaDir, '_hero-poster-frame.jpg')
  let input = null

  if (existsSync(heroMp4) && ff) {
    const frame = spawnSync(
      ff,
      ['-y', '-ss', '0.35', '-i', heroMp4, '-frames:v', '1', '-q:v', '3', framePath],
      { stdio: 'pipe' },
    )
    if (frame.status === 0 && existsSync(framePath)) input = framePath
  }
  if (!input && existsSync(posterJpg)) return
  if (!input) {
    const soldierHero = join(mediaDir, 'rust-soldier-hero.jpg')
    if (existsSync(soldierHero)) input = soldierHero
  }
  if (!input) return
  if (input === posterJpg) return

  await sharp(input)
    .rotate()
    .resize(1280, 720, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 76, mozjpeg: true })
    .toFile(posterJpg)

  for (const w of [640, 960, 1280]) {
    const h = Math.round((w * 720) / 1280)
    await sharp(input)
      .rotate()
      .resize(w, h, { fit: 'cover', position: 'centre' })
      .webp({ quality: 72, effort: 4 })
      .toFile(join(mediaDir, `rust-hero-poster-${w}w.webp`))
  }

  if (input === framePath && existsSync(framePath)) unlinkSync(framePath)
}

function encodeHeroClips(ff) {
  const heroMp4 = join(videoDir, 'rust-hero.mp4')
  if (!existsSync(heroMp4)) return

  encodeHeroClip(ff, heroMp4, {
    start: 1,
    duration: 6,
    width: 640,
    baseName: 'rust-card-loop',
    crfH264: 28,
    crfVp9: 36,
  })
  encodeHeroClip(ff, heroMp4, {
    start: 0,
    duration: 8,
    width: 854,
    baseName: 'rust-product-preview',
    crfH264: 28,
    crfVp9: 35,
  })
}

if (hasCheatSources()) {
  await generateCheatAssets()
  console.log('Generated optimized gameplay media from source-media/cheat')
} else {
  await generatePlaceholderAssets()
  console.log('Generated first-party SEO and product artwork (add source-media/cheat/01–06.jpg for gameplay shots)')
}

const ff = resolveFfmpeg()
encodeHeroClips(ff)
await generateHeroPosters(ff)
await generateGameplayResponsive()

if (await generateThemeHeroFromBox(root, { mediaDir, ogDir })) {
  console.log('Buy card exported from source-media/hero (gameplay stills unchanged)')
}
