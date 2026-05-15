'use client'
import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

type Harmony = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary'

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hexToHsl(hex: string): [number, number, number] {
  let r = 0,
    g = 0,
    b = 0
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16)
    g = parseInt(clean[1] + clean[1], 16)
    b = parseInt(clean[2] + clean[2], 16)
  } else {
    r = parseInt(clean.slice(0, 2), 16)
    g = parseInt(clean.slice(2, 4), 16)
    b = parseInt(clean.slice(4, 6), 16)
  }
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function generatePalette(baseHex: string, harmony: Harmony): string[] {
  const [h, s, l] = hexToHsl(baseHex)
  const colors: string[] = [baseHex]

  const clampH = (deg: number) => ((deg % 360) + 360) % 360

  switch (harmony) {
    case 'complementary': {
      colors.push(hslToHex(clampH(h + 180), s, l))
      colors.push(hslToHex(clampH(h + 30), s, l - 10))
      colors.push(hslToHex(clampH(h + 180 + 30), s, l - 10))
      colors.push(hslToHex(clampH(h + 90), s, l + 5))
      break
    }
    case 'analogous': {
      for (const offset of [-30, 30, -60, 60]) {
        colors.push(hslToHex(clampH(h + offset), s, l + (Math.abs(offset) === 60 ? -5 : 0)))
      }
      break
    }
    case 'triadic': {
      for (const offset of [120, 240]) {
        colors.push(hslToHex(clampH(h + offset), s, l))
      }
      colors.push(hslToHex(clampH(h + 60), s, l - 10))
      colors.push(hslToHex(clampH(h + 180), s, l - 10))
      break
    }
    case 'tetradic': {
      for (const offset of [60, 180, 240]) {
        colors.push(hslToHex(clampH(h + offset), s, l))
      }
      colors.push(hslToHex(clampH(h + 30), s, l - 8))
      break
    }
    case 'split-complementary': {
      for (const offset of [150, 210]) {
        colors.push(hslToHex(clampH(h + offset), s, l))
      }
      colors.push(hslToHex(clampH(h - 30), s, l - 8))
      colors.push(hslToHex(clampH(h + 30), s, l - 8))
      break
    }
  }

  while (colors.length < 5) colors.push(colors[colors.length - 1])
  return colors.slice(0, 5)
}

const HARMONY_NAMES: { value: Harmony; label: string; desc: string }[] = [
  {
    value: 'complementary',
    label: 'Complementary',
    desc: 'Colors opposite each other on the color wheel',
  },
  {
    value: 'analogous',
    label: 'Analogous',
    desc: 'Colors adjacent to each other on the color wheel',
  },
  {
    value: 'triadic',
    label: 'Triadic',
    desc: 'Three evenly spaced colors around the wheel',
  },
  {
    value: 'tetradic',
    label: 'Tetradic',
    desc: 'Two complementary pairs (rectangle)',
  },
  {
    value: 'split-complementary',
    label: 'Split Complementary',
    desc: 'Base color plus two adjacent to its complement',
  },
]

export default function ColorPalettePage() {
  const [baseColor, setBaseColor] = useState('#2563eb')
  const [harmony, setHarmony] = useState<Harmony>('complementary')

  const palette = useMemo(() => generatePalette(baseColor, harmony), [baseColor, harmony])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (color: string, i: number) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedIndex(i)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  const copyAll = () => {
    navigator.clipboard.writeText(palette.join(', ')).then(() => {
      setCopiedIndex(-1)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Color Palette Generator Free Online — Harmonious Color Schemes</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Free online color palette generator. Create harmonious color schemes using color theory rules.
        Generate complementary, analogous, triadic, and tetradic palettes from any color.
      </p>

      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-12 h-12 p-0.5 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^#[0-9a-fA-F]{0,6}$/.test(val)) setBaseColor(val)
                }}
                className="w-24 px-2 py-1 text-sm font-mono border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Harmony Rule</label>
            <select
              value={harmony}
              onChange={(e) => setHarmony(e.target.value as Harmony)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              {HARMONY_NAMES.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          {HARMONY_NAMES.find((h) => h.value === harmony)?.desc}
        </p>

        {/* Palette Swatches */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Generated Palette</h3>
            <button
              onClick={copyAll}
              className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {copiedIndex === -1 ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {palette.map((color, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-full aspect-square rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopy(color, i)}
                  title="Click to copy"
                />
                <span className="text-xs font-mono mt-1">{color}</span>
                <span className="text-xs text-gray-400">Click to copy</span>
                {copiedIndex === i && (
                  <span className="text-xs text-green-600 font-medium">Copied!</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Color Values */}
        <div>
          <h3 className="text-sm font-medium mb-2">Color Values</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2 pr-4">#</th>
                  <th className="text-left py-2 pr-4">HEX</th>
                  <th className="text-left py-2 pr-4">Swatch</th>
                </tr>
              </thead>
              <tbody>
                {palette.map((color, i) => (
                  <tr key={i} className="border-b dark:border-gray-700 last:border-0">
                    <td className="py-2 pr-4">{i + 1}</td>
                    <td className="py-2 pr-4 font-mono">{color}</td>
                    <td className="py-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: color }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Select a <strong>base color</strong> using the color picker or type a hex value directly.</li>
          <li>Choose a <strong>harmony rule</strong> from the dropdown — complementary, analogous, triadic, tetradic, or split complementary.</li>
          <li>View the generated 5-color palette. Click any swatch or hex value to copy it to your clipboard.</li>
          <li>Use the &ldquo;Copy All&rdquo; button to copy all palette colors at once as a comma-separated list.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Analogous palettes create subtle, harmonious designs — great for backgrounds and main content areas.</li>
          <li>Complementary and triadic palettes produce high contrast — use for call-to-action buttons and accents.</li>
          <li>Use the darkest and lightest colors from your palette for text and backgrounds respectively to ensure proper contrast ratios.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>What is color harmony?</h3>
          <p>
            Color harmony is a design principle based on color theory that uses specific geometric
            relationships on the color wheel to create visually pleasing color combinations.
            Common harmonies include complementary (opposite colors), analogous (adjacent colors),
            triadic (equally spaced), and tetradic (two complementary pairs).
          </p>

          <h3>Can I use these palettes for accessible design?</h3>
          <p>
            The generated palettes are based on hue relationships but do not automatically guarantee
            WCAG contrast compliance. Always check contrast ratios for text on background colors,
            especially with complementary or triadic schemes. You may need to adjust lightness values
            to meet accessibility standards.
          </p>

          <h3>Why does the palette look different when I change the harmony rule?</h3>
          <p>
            Each harmony rule uses a different geometric relationship on the color wheel to select
            colors. Complementary picks the opposite color, analogous picks neighbors, triadic picks
            three evenly spaced colors, and tetradic picks four colors in a rectangle pattern. The
            generated colors maintain the saturation and lightness of your base color for consistency.
          </p>
        </div>
      </section>
    </div>
  )
}
