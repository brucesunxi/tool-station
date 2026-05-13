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

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free Online Color Converter</h2>
        <p className="text-sm text-gray-500">Convert between HEX, RGB, and HSL color formats instantly. Use the color picker or type values directly.</p>
      </div>
    </div>
  )
}

function textColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000'
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000' : '#fff'
}
