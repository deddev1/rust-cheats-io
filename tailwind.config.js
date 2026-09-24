/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        z: {
          bg: '#08060f',
          elevated: '#0c0a1a',
          band: '#100c1a',
          card: '#14101f',
          hover: '#1a1529',
          ink: '#f3f0ff',
          accent: '#b040fb',
          soft: '#a78bfa',
          deep: '#7c3aed',
          success: '#c084fc',
        },
      },
      fontFamily: {
        geist: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        silkscreen: ['Silkscreen', 'cursive'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(176, 64, 251, 0.12)',
      },
    },
  },
  plugins: [],
}
