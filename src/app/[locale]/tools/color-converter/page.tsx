'use client'

import { useState, useCallback, useEffect } from 'react'
import AdBanner from '@/components/AdBanner'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    const full = clean.split('').map(c => c + c).join('')
    const num = parseInt(full, 16)
    return isNaN(num) ? null : { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
  }
  if (clean.length === 6) {
    const num = parseInt(clean, 16)
    return isNaN(num) ? null : { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
  }
  return null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}

type ColorInput = 'hex' | 'rgb' | 'hsl'

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#3b82f6')
  const [rgb, setRgb] = useState('59, 130, 246')
  const [hsl, setHsl] = useState('217, 91%, 60%')
  const [colorPreview, setColorPreview] = useState('#3b82f6')
  const [activeInput, setActiveInput] = useState<ColorInput>('hex')

  const updateFromHex = useCallback((hexStr: string) => {
    const clean = hexStr.startsWith('#') ? hexStr : '#' + hexStr
    const rgbVal = hexToRgb(clean)
    if (rgbVal) {
      setHex(clean)
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b)
      setRgb(`${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}`)
      setHsl(`${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%`)
      setColorPreview(clean)
    }
  }, [])

  const updateFromRgb = useCallback((rgbStr: string) => {
    const parts = rgbStr.split(',').map(s => parseInt(s.trim()))
    if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
      const [r, g, b] = parts
      setRgb(`${r}, ${g}, ${b}`)
      const hexStr = rgbToHex(r, g, b)
      const hslVal = rgbToHsl(r, g, b)
      setHex(hexStr)
      setHsl(`${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%`)
      setColorPreview(hexStr)
    }
  }, [])

  const updateFromHsl = useCallback((hslStr: string) => {
    const parts = hslStr.split(',').map(s => parseInt(s.trim()))
    if (parts.length === 3 && parts.every(n => !isNaN(n))) {
      const [h, s, l] = parts
      if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
        const rgbVal = hslToRgb(h, s, l)
        const hexStr = rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b)
        setHsl(`${h}, ${s}%, ${l}%`)
        setHex(hexStr)
        setRgb(`${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}`)
        setColorPreview(hexStr)
      }
    }
  }, [])

  const handlePickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    updateFromHex(val)
  }, [updateFromHex])

  const presets = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#38d9a9', '#4dabf7', '#3b82f6', '#9775fa', '#e599f7', '#f783ac', '#868e96', '#000000']

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Color Converter</h1>
        <p className="text-gray-500">Convert colors between HEX, RGB, and HSL formats.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      {/* Color Preview */}
      <div className="rounded-xl overflow-hidden border mb-6">
        <div className="h-48 flex items-center justify-center transition-colors duration-200" style={{ backgroundColor: colorPreview }}>
          <span className="text-2xl font-bold" style={{ color: colorPreview === '#000000' ? '#fff' : (activeInput === 'hex' ? textColor(hex) : '#fff') }}>
            {colorPreview}
          </span>
        </div>
      </div>

      {/* Color Picker */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Pick a Color</label>
        <input type="color" value={colorPreview} onChange={handlePickerChange} className="w-full h-12 rounded-lg cursor-pointer border" />
      </div>

      {/* Presets */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map(c => (
            <button key={c} onClick={() => updateFromHex(c)} title={c}
              className="w-8 h-8 rounded-full border-2 border-white shadow hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">HEX</label>
          <input value={hex} onChange={e => { setActiveInput('hex'); updateFromHex(e.target.value) }}
            className="w-full p-3 border rounded-lg font-mono dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="#000000" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">RGB</label>
          <input value={rgb} onChange={e => { setActiveInput('rgb'); updateFromRgb(e.target.value) }}
            className="w-full p-3 border rounded-lg font-mono dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="255, 255, 255" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">HSL</label>
          <input value={hsl} onChange={e => { setActiveInput('hsl'); updateFromHsl(e.target.value) }}
            className="w-full p-3 border rounded-lg font-mono dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0, 0%, 100%" />
        </div>
      </div>

      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Use the color picker to select any color visually from the gradient strip.</li>
          <li>Click a preset color swatch for quick access to commonly used colors.</li>
          <li>Type a HEX value directly (e.g., <code>#3b82f6</code>) for precise input.</li>
          <li>Edit the RGB fields (e.g., <code>59, 130, 246</code>) for fine-grained control.</li>
          <li>Adjust the HSL values (e.g., <code>217, 91%, 60%</code>) for intuitive tint and shade tweaks.</li>
          <li>All three format fields update in real time as you change any input.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>Use the color picker for quick visual selection, then fine-tune with HSL for precise shade adjustments.</li>
          <li>HSL is often more intuitive than RGB for creating color variations &mdash; just adjust the hue angle.</li>
          <li>Preset swatches provide a great starting point for common design color palettes.</li>
          <li>Copy values directly from your CSS or design tools into the corresponding input field.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">What is the difference between RGB and HSL?</h3>
            <p>RGB defines color by red, green, and blue light levels (0&ndash;255 each). HSL defines color by hue (0&ndash;360), saturation (0&ndash;100%), and lightness (0&ndash;100%) &mdash; it is often more intuitive for making systematic adjustments.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I convert to CMYK for printing?</h3>
            <p>Currently we support HEX, RGB, and HSL. CMYK support may be added in a future update.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I use the color picker for accessibility?</h3>
            <p>Keep lightness values above 50% for background colors and below 50% for text foregrounds to ensure sufficient contrast ratios.</p>
          </div>
          <div>
            <h3 className="font-semibold">What are the value limits for each format?</h3>
            <p>HEX accepts 3 or 6-digit values. RGB values must be 0&ndash;255. HSL hue must be 0&ndash;360, while saturation and lightness must be 0&ndash;100%.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function textColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000'
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000' : '#fff'
}
