'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const presetTips = [10, 15, 18, 20]

function toCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function TipCalculatorPage() {
  const t = useTranslations('tools.tip-calculator')
  const ct = useTranslations('common')

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
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
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
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">{ct("calculate")}</button>
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
