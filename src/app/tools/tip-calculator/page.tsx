'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const presetTips = [10, 15, 18, 20]

function toCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function TipCalculatorPage() {
  const [bill, setBill] = useState<string>('75.50')
  const [tipPercent, setTipPercent] = useState<number>(15)
  const [customTip, setCustomTip] = useState<string>('')
  const [split, setSplit] = useState<number>(2)
  const [result, setResult] = useState<{
    tipAmount: number
    total: number
    tipPerPerson: number
    totalPerPerson: number
  } | null>(null)

  const calculate = () => {
    const b = parseFloat(bill)
    if (isNaN(b) || b <= 0) return

    const pct = customTip !== '' ? parseFloat(customTip) : tipPercent
    if (isNaN(pct) || pct < 0) return

    const s = Math.max(1, split)
    const tip = b * (pct / 100)
    const total = b + tip

    setResult({
      tipAmount: tip,
      total: total,
      tipPerPerson: tip / s,
      totalPerPerson: total / s,
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Tip Calculator Free Online — Calculate Restaurant Tips &amp; Split Bills</h1>
      <p className="text-gray-500 mb-6">Free online tip calculator. Calculate tip amounts, total bill, and split between multiple people. Choose from common tip percentages or set your own.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Bill Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input type="number" value={bill} onChange={e => setBill(e.target.value)}
                className="w-full pl-8 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" step="0.01" min={0} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tip Percentage</label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {presetTips.map(p => (
                <button key={p} onClick={() => { setTipPercent(p); setCustomTip('') }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    tipPercent === p && customTip === '' ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'
                  }`}>{p}%</button>
              ))}
              <div className="relative">
                <input type="number" value={customTip} onChange={e => setCustomTip(e.target.value)}
                  placeholder="Custom %"
                  className="w-24 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm" min={0} max={1000} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Split Between</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setSplit(Math.max(1, split - 1))}
                className="w-10 h-10 rounded-lg border flex items-center justify-center hover:border-blue-300 transition-colors text-lg font-bold">&minus;</button>
              <span className="text-2xl font-semibold min-w-[3rem] text-center">{split}</span>
              <button onClick={() => setSplit(split + 1)}
                className="w-10 h-10 rounded-lg border flex items-center justify-center hover:border-blue-300 transition-colors text-lg font-bold">+</button>
              <span className="text-sm text-gray-500">{split === 1 ? 'person' : 'people'}</span>
            </div>
          </div>

          <button onClick={calculate}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
              <div className="text-sm text-gray-500">Tip Amount</div>
              <div className="text-xl font-bold text-blue-600">{toCurrency(result.tipAmount)}</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
              <div className="text-sm text-gray-500">Total Bill</div>
              <div className="text-xl font-bold text-green-600">{toCurrency(result.total)}</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
              <div className="text-sm text-gray-500">Tip / Person</div>
              <div className="text-xl font-bold text-purple-600">{toCurrency(result.tipPerPerson)}</div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center">
              <div className="text-sm text-gray-500">Total / Person</div>
              <div className="text-xl font-bold text-amber-600">{toCurrency(result.totalPerPerson)}</div>
            </div>
            {split > 1 && (
              <div className="col-span-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
                <div className="text-sm text-gray-500">Split {split} ways</div>
              </div>
            )}
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Enter the bill amount in the input field (e.g., $75.50).</li>
          <li>Select a tip percentage from the presets (10%, 15%, 18%, 20%) or enter a custom percentage.</li>
          <li>Adjust the number of people splitting the bill using the +/- buttons.</li>
          <li>Click &ldquo;Calculate&rdquo; to see the tip amount, total bill, and per-person amounts.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>A 15%&ndash;20% tip is standard for good restaurant service in the United States.</li>
          <li>Check your bill for an included gratuity (auto-grat) before adding an additional tip.</li>
          <li>When splitting a bill, consider using the &ldquo;Total / Person&rdquo; amount to ensure everyone pays their fair share including tax and tip.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>What is a standard tip percentage?</h3>
          <p>Standard restaurant tipping in the US ranges from 15% to 20% of the pretax bill amount. Some restaurants include a service charge for large parties.</p>
          <h3>Should I tip on the pre-tax or post-tax amount?</h3>
          <p>Most tipping guidelines recommend tipping on the pre-tax amount, though many people tip on the total bill including tax.</p>
          <h3>How do I split the tip unevenly among people?</h3>
          <p>This calculator splits the tip evenly. For uneven splits, calculate each person&rsquo;s tip separately based on their individual bill amount.</p>
        </div>
      </section>
    </div>
  )
}
