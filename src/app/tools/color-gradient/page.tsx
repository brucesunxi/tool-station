'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type Direction = 'horizontal' | 'vertical' | 'diagonal'

function getDirectionValue(dir: Direction): string {
  switch (dir) {
    case 'horizontal': return 'to right'
    case 'vertical': return 'to bottom'
    case 'diagonal': return 'to bottom right'
  }
}

export default function ColorGradientPage() {
  const [color1, setColor1] = useState('#667eea')
  const [color2, setColor2] = useState('#764ba2')
  const [direction, setDirection] = useState<Direction>('horizontal')
  const [copied, setCopied] = useState(false)
  const [input1, setInput1] = useState('#667eea')
  const [input2, setInput2] = useState('#764ba2')

  const gradientCSS = `background: linear-gradient(${getDirectionValue(direction)}, ${color1}, ${color2});`

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(gradientCSS)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = gradientCSS
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const applyColor1 = () => {
    // Basic validation - check it's a 6-char hex
    const clean = input1.replace('#', '')
    if (/^[0-9a-fA-F]{6}$/.test(clean) || /^[0-9a-fA-F]{3}$/.test(clean)) {
      setColor1(input1.startsWith('#') ? input1 : '#' + clean)
    }
  }

  const applyColor2 = () => {
    const clean = input2.replace('#', '')
    if (/^[0-9a-fA-F]{6}$/.test(clean) || /^[0-9a-fA-F]{3}$/.test(clean)) {
      setColor2(input2.startsWith('#') ? input2 : '#' + clean)
    }
  }

  const directions: { value: Direction; label: string }[] = [
    { value: 'horizontal', label: '← Horizontal' },
    { value: 'vertical', label: '↑ Vertical' },
    { value: 'diagonal', label: '↗ Diagonal' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">CSS Gradient Generator Free Online — Color Gradient Maker</h1>
      <p className="text-gray-500 mb-6">Free online gradient generator. Create beautiful CSS gradients with two colors. Choose direction and preview in real-time. Copy CSS code instantly.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        {/* Gradient Preview */}
        <div className="h-48 rounded-xl mb-6"
          style={{ background: `linear-gradient(${getDirectionValue(direction)}, ${color1}, ${color2})` }} />

        {/* Color Pickers */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Color 1</label>
            <div className="flex gap-2">
              <input type="color" value={color1} onChange={e => { setColor1(e.target.value); setInput1(e.target.value) }}
                className="w-10 h-10 p-0.5 rounded border cursor-pointer" />
              <input type="text" value={input1} onChange={e => setInput1(e.target.value)}
                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono text-sm" />
              <button onClick={applyColor1}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Set</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color 2</label>
            <div className="flex gap-2">
              <input type="color" value={color2} onChange={e => { setColor2(e.target.value); setInput2(e.target.value) }}
                className="w-10 h-10 p-0.5 rounded border cursor-pointer" />
              <input type="text" value={input2} onChange={e => setInput2(e.target.value)}
                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono text-sm" />
              <button onClick={applyColor2}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Set</button>
            </div>
          </div>
        </div>

        {/* Direction */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Direction</label>
          <div className="flex gap-2">
            {directions.map(d => (
              <button key={d.value} onClick={() => setDirection(d.value)}
                className={`flex-1 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                  direction === d.value ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'
                }`}>{d.label}</button>
            ))}
          </div>
        </div>

        {/* CSS Code Output */}
        <div>
          <label className="block text-sm font-medium mb-2">CSS Code</label>
          <div className="relative">
            <pre className="p-4 bg-gray-900 text-green-400 rounded-xl text-sm overflow-x-auto font-mono">
              {gradientCSS}
            </pre>
            <button onClick={copyCode}
              className="absolute top-2 right-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Pick the first color using the color picker or enter a HEX code manually.</li>
          <li>Pick the second color for the gradient end point.</li>
          <li>Choose a gradient direction: horizontal, vertical, or diagonal.</li>
          <li>Copy the generated CSS code by clicking the &ldquo;Copy&rdquo; button.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Colors that are adjacent on the color wheel produce smooth, natural gradients.</li>
          <li>Use high-contrast color pairs for vibrant gradients, or similar hues for subtle transitions.</li>
          <li>Gradients work great as backgrounds for buttons, cards, hero sections, and banners.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>What CSS property does this generate?</h3>
          <p>The generator outputs a <code>background: linear-gradient(...)</code> CSS declaration that you can use directly in your stylesheets.</p>
          <h3>Can I add more than two colors?</h3>
          <p>This tool supports two-color gradients. For multi-color gradients, you can manually add color stops to the generated CSS code.</p>
          <h3>Does the CSS work in all browsers?</h3>
          <p>Yes, <code>linear-gradient</code> is supported in all modern browsers including Chrome, Firefox, Safari, and Edge.</p>
        </div>
      </section>
    </div>
  )
}
