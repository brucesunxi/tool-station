'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type SimulationType = 'protanopia' | 'deuteranopia' | 'tritanopia'

interface SimulationResult {
  hex: string
  label: string
  description: string
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.trim()
  if (h.startsWith('#')) h = h.slice(1)
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  if (h.length !== 6) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return '#' + [clamp(r), clamp(g), clamp(b)].map(c => c.toString(16).padStart(2, '0')).join('')
}

// Simulation matrices based on the Brettel, Vienot, and Mollon (1997) algorithm
function simulateProtanopia(r: number, g: number, b: number): { r: number; g: number; b: number } {
  return {
    r: 0.10889 * r + 0.89111 * g - 0.00000 * b,
    g: 0.10889 * r + 0.89111 * g - 0.00000 * b,
    b: -0.00000 * r + 0.00000 * g + 1.00000 * b,
  }
}

function simulateDeuteranopia(r: number, g: number, b: number): { r: number; g: number; b: number } {
  return {
    r: 0.29031 * r + 0.70969 * g - 0.00000 * b,
    g: 0.29031 * r + 0.70969 * g - 0.00000 * b,
    b: -0.02197 * r + 0.02197 * g + 1.00000 * b,
  }
}

function simulateTritanopia(r: number, g: number, b: number): { r: number; g: number; b: number } {
  return {
    r: 1.00000 * r + 0.00000 * g - 0.00000 * b,
    g: 0.00000 * r + 1.00000 * g + 0.00000 * b,
    b: -0.70550 * r + 0.70550 * g + 1.00000 * b,
  }
}

const simTypes: { value: SimulationType; label: string; desc: string }[] = [
  { value: 'protanopia', label: 'Protanopia', desc: 'Red-blind (1% of males)' },
  { value: 'deuteranopia', label: 'Deuteranopia', desc: 'Green-blind (1% of males)' },
  { value: 'tritanopia', label: 'Tritanopia', desc: 'Blue-blind (rare)' },
]

export default function ColorBlindnessPage() {
  const t = useTranslations('tools.color-blindness')
  const ct = useTranslations('common')

  const [baseColor, setBaseColor] = useState('#ff6b6b')
  const [input, setInput] = useState('#ff6b6b')

  const applyColor = () => {
    const rgb = hexToRgb(input)
    if (rgb) setBaseColor(input.startsWith('#') ? input : '#' + input.replace('#', ''))
  }

  const rgb = hexToRgb(baseColor)
  const simulations: SimulationResult[] = []
  const isBaseLight = rgb ? (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 128 : true

  if (rgb) {
    const sims = [
      { type: 'protanopia' as SimulationType, fn: simulateProtanopia, label: 'Protanopia', desc: 'Red-blind (1% of males)' },
      { type: 'deuteranopia' as SimulationType, fn: simulateDeuteranopia, label: 'Deuteranopia', desc: 'Green-blind (1% of males)' },
      { type: 'tritanopia' as SimulationType, fn: simulateTritanopia, label: 'Tritanopia', desc: 'Blue-blind (rare)' },
    ]

    for (const sim of sims) {
      const result = sim.fn(rgb.r, rgb.g, rgb.b)
      const hex = rgbToHex(result.r, result.g, result.b)
      simulations.push({ hex, label: sim.label, description: sim.desc })
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input type="color" value={baseColor} onChange={e => { setBaseColor(e.target.value); setInput(e.target.value) }}
            className="w-12 h-12 p-0.5 rounded border cursor-pointer" />
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter HEX color (e.g., #ff6b6b)"
            className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono" />
          <button onClick={applyColor}
            className="px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Simulate
          </button>
        </div>

        {/* Original Color */}
        {rgb && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Original Color</h3>
            <div className="h-20 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: baseColor }}>
              <span className={`text-lg font-bold ${isBaseLight ? 'text-gray-800' : 'text-white'}`}>
                {baseColor.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Simulations */}
        {rgb && (
          <div className="grid sm:grid-cols-3 gap-4">
            {simulations.map(sim => {
              const sRgb = hexToRgb(sim.hex)
              const isLight = sRgb
                ? (sRgb.r * 299 + sRgb.g * 587 + sRgb.b * 114) / 1000 > 128
                : true
              return (
                <div key={sim.label} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <div className="h-16 rounded-lg mb-2 flex items-center justify-center"
                    style={{ backgroundColor: sim.hex }}>
                    <span className={`text-xs font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>
                      {sim.hex.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{sim.label}</div>
                    <div className="text-xs text-gray-500">{sim.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!rgb && (
          <p className="text-red-500 text-sm text-center">Please enter a valid HEX color code.</p>
        )}
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
