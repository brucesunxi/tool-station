'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type Direction = 'to bottom' | 'to right' | 'to bottom right' | 'to top' | 'to left' | 'to top left' | 'radial'
type ColorStop = { color: string; position: number }

const DEFAULT_STOPS: ColorStop[] = [
  { color: '#ff6b6b', position: 0 },
  { color: '#4ecdc4', position: 50 },
  { color: '#45b7d1', position: 100 },
]

function hslToString(h: number, s: number, l: number) {
  return `hsl(${h}, ${s}%, ${l}%)`
}

export default function GradientGeneratorPage() {
  const t = useTranslations('tools.gradient-generator')
  const ct = useTranslations('common')

  const [stops, setStops] = useState<ColorStop[]>(DEFAULT_STOPS)
  const [direction, setDirection] = useState<Direction>('to bottom')

  const addStop = () => {
    if (stops.length >= 8) return
    const last = stops[stops.length - 1]
    const pos = Math.min(100, last.position + 15)
    setStops([...stops, { color: '#a29bfe', position: pos }])
  }

  const removeStop = (i: number) => {
    if (stops.length <= 2) return
    setStops(stops.filter((_, idx) => idx !== i))
  }

  const updateStop = (i: number, partial: Partial<ColorStop>) => {
    setStops(stops.map((s, idx) => (idx === i ? { ...s, ...partial } : s)))
  }

  const cssGradient = (() => {
    const parts = stops
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
    if (direction === 'radial') return `radial-gradient(circle, ${parts.join(', ')})`
    return `linear-gradient(${direction}, ${parts.join(', ')})`
  })()

  const displayStops = [...stops].sort((a, b) => a.position - b.position)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>

      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8 space-y-6">
        {/* Live Preview */}
        <div
          className="h-48 rounded-lg border"
          style={{ background: cssGradient }}
        />

        {/* Direction */}
        <div>
          <label className="block text-sm font-medium mb-2">Direction</label>
          <div className="flex flex-wrap gap-2">
            {(['to bottom', 'to right', 'to bottom right', 'to top', 'to left', 'to top left', 'radial'] as Direction[]).map(
              (d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${
                    direction === d
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {d}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Color Stops */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Color Stops</span>
            <button
              onClick={addStop}
              disabled={stops.length >= 8}
              className="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Add Stop
            </button>
          </div>
          <div className="space-y-3">
            {displayStops.map((stop, i) => {
              const realIndex = stops.findIndex(
                (s) => s.color === stop.color && s.position === stop.position,
              )
              return (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(realIndex, { color: e.target.value })}
                    className="w-10 h-10 p-0.5 border rounded cursor-pointer"
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={(e) => updateStop(realIndex, { position: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-10 text-right">{stop.position}%</span>
                  <button
                    onClick={() => removeStop(realIndex)}
                    disabled={stops.length <= 2}
                    className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-lg leading-none"
                  >
                    &times;
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* CSS Output */}
        <div>
          <label className="block text-sm font-medium mb-2">CSS Code</label>
          <div className="relative">
            <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto border">
              <code>{`background: ${cssGradient};`}</code>
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(`background: ${cssGradient};`)}
              className="absolute top-2 right-2 px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Copy
            </button>
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
