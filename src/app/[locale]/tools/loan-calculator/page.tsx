'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type CalcMode = 'loan' | 'compound'

function toCurrency(n: number) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function LoanCalculatorPage() {
  const t = useTranslations('tools.loan-calculator')
  const ct = useTranslations('common')

  const [mode, setMode] = useState<CalcMode>('loan')

  // Loan
  const [amount, setAmount] = useState(300000)
  const [rate, setRate] = useState(6.5)
  const [term, setTerm] = useState(30)
  const [result, setResult] = useState<{ monthly: number; total: number; interest: number; schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] } | null>(null)

  // Compound
  const [principal, setPrincipal] = useState(10000)
  const [cRate, setCRate] = useState(7)
  const [cYears, setCYears] = useState(10)
  const [cContribution, setCContribution] = useState(500)
  const [cFreq, setCFreq] = useState(12)
  const [compoundResult, setCompoundResult] = useState<{ total: number; principal: number; earnings: number; final: number } | null>(null)

  const calcLoan = () => {
    const r = rate / 100 / 12
    const n = term * 12
    if (r === 0) {
      const monthly = amount / n
      setResult({ monthly, total: amount, interest: 0, schedule: [] })
      return
    }
    const monthly = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = monthly * n
    const interest = total - amount
    const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = []
    let balance = amount
    for (let i = 1; i <= Math.min(n, 360); i++) {
      const intPmt = balance * r
      const prinPmt = monthly - intPmt
      balance -= prinPmt
      schedule.push({ month: i, payment: monthly, principal: prinPmt, interest: intPmt, balance: Math.max(0, balance) })
      if (balance <= 0) break
    }
    setResult({ monthly, total, interest, schedule })
    setCompoundResult(null)
  }

  const calcCompound = () => {
    let balance = principal
    const totalPrincipal = principal + cContribution * cFreq * cYears
    const r = cRate / 100 / cFreq
    const totalPeriods = cFreq * cYears
    for (let i = 0; i < totalPeriods; i++) {
      balance += cContribution
      balance *= (1 + r)
    }
    const earnings = balance - totalPrincipal
    setCompoundResult({ total: balance, principal: totalPrincipal, earnings, final: balance })
    setResult(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="flex gap-2 mb-6">
        {[
          { value: 'loan' as const, label: 'Loan Calculator', icon: '🏠' },
          { value: 'compound' as const, label: 'Compound Interest', icon: '📈' },
        ].map(m => (
          <button key={m.value} onClick={() => { setMode(m.value); setResult(null); setCompoundResult(null) }}
            className={`flex-1 p-3 rounded-lg border text-center font-medium transition-all ${
              mode === m.value ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'
            }`}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {mode === 'loan' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div><label className="block text-xs font-medium mb-1">Loan Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-xs font-medium mb-1">Interest Rate (%)</label>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-xs font-medium mb-1">Term (Years)</label>
              <input type="number" value={term} onChange={e => setTerm(Number(e.target.value))} className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <button onClick={calcLoan} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">{ct("calculate")}</button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/10 text-center">
                  <p className="text-xs text-gray-500">Monthly Payment</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">{toCurrency(result.monthly)}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-xs text-gray-500">Total Payment</p>
                  <p className="text-xl font-bold">{toCurrency(result.total)}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-xs text-gray-500">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">{toCurrency(result.interest)}</p>
                </div>
              </div>
              {result.schedule.length > 0 && (
                <details>
                  <summary className="text-sm font-medium cursor-pointer text-blue-600">Amortization Schedule ({result.schedule.length} months)</summary>
                  <div className="mt-3 max-h-60 overflow-y-auto border rounded-lg text-xs">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                        <tr><th className="p-2 text-left">#</th><th className="p-2 text-right">Payment</th><th className="p-2 text-right">Principal</th><th className="p-2 text-right">Interest</th><th className="p-2 text-right">Balance</th></tr>
                      </thead>
                      <tbody>
                        {result.schedule.slice(0, 360).map(r => (
                          <tr key={r.month} className="border-t dark:border-gray-700">
                            <td className="p-2">{r.month}</td>
                            <td className="p-2 text-right">{toCurrency(r.payment)}</td>
                            <td className="p-2 text-right">{toCurrency(r.principal)}</td>
                            <td className="p-2 text-right">{toCurrency(r.interest)}</td>
                            <td className="p-2 text-right">{toCurrency(r.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
            </div>
          )}
        </>
      )}

      {mode === 'compound' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div><label className="block text-xs font-medium mb-1">Initial Investment</label>
              <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700" /></div>
            <div><label className="block text-xs font-medium mb-1">Annual Return (%)</label>
              <input type="number" step="0.1" value={cRate} onChange={e => setCRate(Number(e.target.value))} className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700" /></div>
            <div><label className="block text-xs font-medium mb-1">Years</label>
              <input type="number" value={cYears} onChange={e => setCYears(Number(e.target.value))} className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700" /></div>
            <div><label className="block text-xs font-medium mb-1">Compound Frequency</label>
              <select value={cFreq} onChange={e => setCFreq(Number(e.target.value))} className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700">
                <option value={1}>Annually</option>
                <option value={2}>Semi-Annually</option>
                <option value={4}>Quarterly</option>
                <option value={12}>Monthly</option>
                <option value={365}>Daily</option>
              </select></div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1">Monthly Contribution</label>
              <input type="number" value={cContribution} onChange={e => setCContribution(Number(e.target.value))} className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700" /></div>
          </div>
          <button onClick={calcCompound} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">{ct("calculate")}</button>

          {compoundResult && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/10 text-center">
                <p className="text-xs text-gray-500">Final Balance</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">{toCurrency(compoundResult.final)}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-gray-500">Total Contributions</p>
                <p className="text-xl font-bold">{toCurrency(compoundResult.principal)}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-gray-500">Investment Earnings</p>
                <p className="text-xl font-bold text-blue-600">{toCurrency(compoundResult.earnings)}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
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
