import sharp from 'sharp'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const W = 1200
const H = 630

// Scale the favicon (viewBox 48×46) to 260px tall, preserving aspect ratio
const ICON_H = 260
const ICON_W = Math.round(ICON_H * (48 / 46))
const ICON_X = Math.round((W - ICON_W) / 2)
const ICON_Y = Math.round((H - ICON_H) / 2)

const faviconSvg = readFileSync(join(__dirname, '../public/favicon.svg'), 'utf-8')

// Strip the outer <svg> wrapper to get embeddable inner content
const innerContent = faviconSvg
  .replace(/^<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .trim()

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#1a1a18"/>
  <svg x="${ICON_X}" y="${ICON_Y}" width="${ICON_W}" height="${ICON_H}" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${innerContent}
  </svg>
</svg>`

await sharp(Buffer.from(card))
  .png()
  .toFile(join(__dirname, '../public/og-image.png'))

console.log(`og-image.png generated (${W}x${H})`)
