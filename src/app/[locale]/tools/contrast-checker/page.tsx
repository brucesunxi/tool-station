'use client'

import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
  }
  return null
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(v => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(fg: string, bg: string): number | null {
  const f = hexToRgb(fg)
  const b = hexToRgb(bg)
  if (!f || !b) return null
  const l1 = relativeLuminance(f.r, f.g, f.b)
  const l2 = relativeLuminance(b.r, b.g, b.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function wcagLevel(ratio: number, isLarge: boolean) {
  const aa = ratio >= (isLarge ? 3 : 4.5)
  const aaa = ratio >= (isLarge ? 4.5 : 7)
  return { aa, aaa }
}

export default function ContrastCheckerPage() {
  const t = useTranslations('tools.contrast-checker')
  const ct = useTranslations('common')

  const [fgColor, setFgColor] = useState('#1a1a1a')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [fgInput, setFgInput] = useState('#1a1a1a')
  const [bgInput, setBgInput] = useState('#ffffff')

  const ratio = useMemo(() => contrastRatio(fgColor, bgColor), [fgColor, bgColor])

  const applyFg = () => {
    const rgb = hexToRgb(fgInput)
    if (rgb) setFgColor(fgInput)
  }
  const applyBg = () => {
    const rgb = hexToRgb(bgInput)
    if (rgb) setBgColor(bgInput)
  }

  const renderPassFail = (pass: boolean) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
      pass ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    }`}>
      <span className={`w-2 h-2 rounded-full ${pass ? 'bg-green-500' : 'bg-red-500'}`} />
      {pass ? 'PASS' : 'FAIL'}
    </span>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {/* Foreground */}
          <div>
            <label className="block text-sm font-medium mb-2">Foreground (Text)</label>
            <div className="flex gap-2 mb-2">
              <input type="color" value={fgColor} onChange={e => { setFgColor(e.target.value); setFgInput(e.target.value) }}
                className="w-10 h-10 p-0.5 rounded border cursor-pointer" />
              <input type="text" value={fgInput} onChange={e => setFgInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono text-sm" />
              <button onClick={applyFg}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Apply</button>
            </div>
            <div className="h-24 rounded-lg flex items-center justify-center p-4 text-center"
              style={{ backgroundColor: bgColor, color: fgColor }}>
              <span className="text-lg font-bold">Sample Text</span>
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="block text-sm font-medium mb-2">Background</label>
            <div className="flex gap-2 mb-2">
              <input type="color" value={bgColor} onChange={e => { setBgColor(e.target.value); setBgInput(e.target.value) }}
                className="w-10 h-10 p-0.5 rounded border cursor-pointer" />
              <input type="text" value={bgInput} onChange={e => setBgInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono text-sm" />
              <button onClick={applyBg}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Apply</button>
            </div>
            <div className="h-24 rounded-lg flex items-center justify-center p-4 text-center"
              style={{ backgroundColor: bgColor, color: fgColor, fontSize: '12px' }}>
              <span className="font-bold">Small Text Sample</span>
            </div>
          </div>
        </div>

        {ratio !== null && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
              <div className="text-sm text-gray-500 mb-1">Contrast Ratio</div>
              <div className="text-4xl font-bold">{ratio.toFixed(2)} : 1</div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <h4 className="font-semibold mb-3 text-sm">Normal Text (&lt;18px / &lt;14px bold)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AA</span>
                    {renderPassFail(wcagLevel(ratio, false).aa)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AAA</span>
                    {renderPassFail(wcagLevel(ratio, false).aaa)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <h4 className="font-semibold mb-3 text-sm">Large Text (&ge;18px / &ge;14px bold)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AA</span>
                    {renderPassFail(wcagLevel(ratio, true).aa)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AAA</span>
                    {renderPassFail(wcagLevel(ratio, true).aaa)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {ratio === null && (
          <p className="text-red-500 text-sm text-center">Please enter valid HEX color codes.</p>
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
