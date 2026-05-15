'use client'
import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

interface Shadow {
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

function shadowCss(s: Shadow): string {
  const parts = [s.inset ? 'inset' : '', `${s.offsetX}px`, `${s.offsetY}px`, `${s.blur}px`, `${s.spread}px`, s.color]
  return parts.filter(Boolean).join(' ')
}

export default function BoxShadowPage() {
  const [shadow, setShadow] = useState<Shadow>({
    offsetX: 2,
    offsetY: 4,
    blur: 10,
    spread: 0,
    color: '#00000040',
    inset: false,
  })
  const [copied, setCopied] = useState(false)

  const css = useMemo(() => `box-shadow: ${shadowCss(shadow)};`, [shadow])

  const update = (partial: Partial<Shadow>) => setShadow((s) => ({ ...s, ...partial }))

  const handleCopy = () => {
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">CSS Box Shadow Generator Free Online — Shadow Effects Maker</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Free online CSS box-shadow generator. Create custom shadow effects with visual controls. Adjust
        offset, blur, spread, and color. Copy CSS code. Perfect for web design.
      </p>

      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8 space-y-6">
        {/* Live Preview */}
        <div
          className="h-48 rounded-lg flex items-center justify-center text-gray-500 text-sm bg-gray-50 dark:bg-gray-900"
          style={{ boxShadow: shadowCss(shadow) }}
        >
          Preview Box
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { label: 'Offset X', key: 'offsetX', min: -50, max: 50 },
            { label: 'Offset Y', key: 'offsetY', min: -50, max: 50 },
            { label: 'Blur', key: 'blur', min: 0, max: 100 },
            { label: 'Spread', key: 'spread', min: -50, max: 50 },
          ] as const).map(({ label, key, min, max }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">
                {label}: {shadow[key]}px
              </label>
              <input
                type="range"
                min={min}
                max={max}
                value={shadow[key]}
                onChange={(e) => update({ [key]: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{min}px</span>
                <span>{max}px</span>
              </div>
            </div>
          ))}
        </div>

        {/* Color & Inset */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={shadow.color.length === 9 ? '#' + shadow.color.slice(3, 9) : shadow.color.slice(0, 7)}
                onChange={(e) => {
                  const hex = e.target.value
                  const alpha = shadow.color.length === 9 ? shadow.color.slice(-2) : '40'
                  update({ color: hex + alpha })
                }}
                className="w-10 h-10 p-0.5 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={shadow.color}
                onChange={(e) => update({ color: e.target.value })}
                className="w-24 px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Opacity</label>
            <input
              type="range"
              min={0}
              max={100}
              value={parseInt(shadow.color.slice(-2), 16) || 255}
              onChange={(e) => {
                const a = Math.round(parseInt(e.target.value) * (100 / 255))
                const hex = (a * 255 / 100)
                const alpha = Math.round(hex).toString(16).padStart(2, '0')
                const base = shadow.color.length === 9 ? shadow.color.slice(0, 7) : shadow.color
                update({ color: base + alpha })
              }}
              className="w-full"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={shadow.inset}
              onChange={(e) => update({ inset: e.target.checked })}
              className="rounded"
            />
            Inset
          </label>
        </div>

        {/* CSS Output */}
        <div>
          <label className="block text-sm font-medium mb-2">CSS Code</label>
          <div className="relative">
            <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto border">
              <code>{css}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Adjust the <strong>Offset X</strong> and <strong>Offset Y</strong> sliders to position the shadow horizontally and vertically.</li>
          <li>Use the <strong>Blur</strong> slider to control how soft or sharp the shadow edge appears.</li>
          <li>Set the <strong>Spread</strong> to expand or contract the shadow size, and pick a <strong>Color</strong> using the color picker.</li>
          <li>Toggle <strong>Inset</strong> to switch between an outer shadow (default) and an inner shadow effect, then copy the generated CSS.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Small blur values (2-6px) create sharp, realistic shadows for UI elements like buttons and cards.</li>
          <li>Use semi-transparent black or gray (e.g., rgba(0,0,0,0.15)) for natural-looking shadows instead of solid colors.</li>
          <li>Layer multiple box-shadows by separating them with commas for complex effects like glow + drop shadow.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>What is the difference between blur and spread?</h3>
          <p>
            Blur controls how the shadow fades at its edges. A higher blur creates a softer, more diffuse
            shadow. Spread controls the size of the shadow before the blur is applied. Positive spread
            values make the shadow larger than the element; negative values make it smaller.
          </p>

          <h3>Can I create multiple shadows on one element?</h3>
          <p>
            Yes. You can layer multiple box-shadow values by separating them with commas. For example:
            <code> box-shadow: 2px 2px 4px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1);</code>. This
            tool generates a single shadow, but you can manually combine outputs in your CSS.
          </p>

          <h3>Does the inset keyword change the shadow appearance?</h3>
          <p>
            Yes. Without inset (the default), the shadow is cast outside the element&apos;s border. With
            inset, the shadow is drawn inside the element, creating a recessed or &ldquo;inner shadow&rdquo;
            effect. Inset shadows are commonly used for pressed button states or inset panels.
          </p>
        </div>
      </section>
    </div>
  )
}
