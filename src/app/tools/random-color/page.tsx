'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

interface ColorValues {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

function randomByte(): number {
  return Math.floor(Math.random() * 256)
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function generateRandomColor(): ColorValues {
  const r = randomByte(), g = randomByte(), b = randomByte()
  const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
  const hsl = rgbToHsl(r, g, b)
  return { hex, rgb: { r, g, b }, hsl }
}

export default function RandomColorPage() {
  const [color, setColor] = useState<ColorValues>(generateRandomColor)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const generate = useCallback(() => {
    setColor(generateRandomColor())
    setCopiedField(null)
  }, [])

  const copyText = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const isLight = (color.rgb.r * 299 + color.rgb.g * 587 + color.rgb.b * 114) / 1000 > 128

  const copyItems = [
    { label: 'HEX', value: color.hex, field: 'hex' },
    { label: 'RGB', value: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, field: 'rgb' },
    { label: 'HSL', value: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, field: 'hsl' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Random Color Generator Free Online — Random HEX, RGB &amp; HSL Colors</h1>
      <p className="text-gray-500 mb-6">Free random color generator. Generate random HEX, RGB, and HSL colors with live preview. Copy colors instantly for your design projects.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        {/* Color Preview */}
        <div className="h-48 rounded-xl mb-6 transition-colors duration-300 flex items-center justify-center"
          style={{ backgroundColor: color.hex }}>
          <span className={`text-2xl font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>
            {color.hex}
          </span>
        </div>

        <button onClick={generate}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-6">
          Generate New Color
        </button>

        {/* Color Values */}
        <div className="grid sm:grid-cols-3 gap-3">
          {copyItems.map(item => (
            <div key={item.field} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className="text-sm font-mono font-semibold truncate mb-2">{item.value}</div>
              <button onClick={() => copyText(item.value, item.field)}
                className="text-xs px-3 py-1.5 rounded-lg border hover:border-blue-300 transition-colors">
                {copiedField === item.field ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Open the tool to see a random color with live preview.</li>
          <li>Click &ldquo;Generate New Color&rdquo; to get a fresh random color.</li>
          <li>View the color values in HEX, RGB, and HSL formats.</li>
          <li>Click the &ldquo;Copy&rdquo; button next to any format to copy the value to your clipboard.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use this tool to discover new color palettes and break out of your usual color choices.</li>
          <li>HEX codes are best for web development, while RGB/HSL are useful for CSS and design software.</li>
          <li>Keep generating until you find a color that fits your project&rsquo;s theme.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>What color formats are supported?</h3>
          <p>The generator displays colors in HEX (#RRGGBB), RGB (red, green, blue), and HSL (hue, saturation, lightness) formats.</p>
          <h3>Are the colors truly random?</h3>
          <p>Each color is generated using JavaScript&rsquo;s Math.random() for each RGB channel, giving 16,777,216 possible colors.</p>
          <h3>Can I edit a generated color?</h3>
          <p>This tool generates random colors only. For fine-tuning, copy the color value to a color picker or use the Color Gradient tool.</p>
        </div>
      </section>
    </div>
  )
}
