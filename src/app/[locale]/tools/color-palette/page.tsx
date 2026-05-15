'use client'

import { useTranslations } from 'next-intl'
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
  const t = useTranslations('tools.color-palette')
  const ct = useTranslations('common')

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
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>

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
                  <span className="text-xs text-green-600 font-medium">{ct("copied")}</span>
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
        <h2>{t('howto.heading')}</h2>
        <ol>
          {(t.raw('howto.steps') as string[]).map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>

        <h2>{t('tips.heading')}</h2>
        <ul>
          {(t.raw('tips.items') as string[]).map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t('faq.heading')}</h2>
        <div className="space-y-4">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
