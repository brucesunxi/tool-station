'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type Mode = 'difference' | 'add-subtract'

function pad(n: number) { return n.toString().padStart(2, '0') }

function formatDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function daysBetween(a: Date, b: Date) {
  const ms = Math.abs(a.getTime() - b.getTime())
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export default function DateCalculatorPage() {
  const [mode, setMode] = useState<Mode>('difference')
  const [startDate, setStartDate] = useState('2025-01-01')
  const [endDate, setEndDate] = useState('2025-12-31')
  const [operation, setOperation] = useState<'add' | 'subtract'>('add')
  const [daysInput, setDaysInput] = useState('90')
  const [baseDate, setBaseDate] = useState('2025-01-01')
  const [diffResult, setDiffResult] = useState<{ days: number; years: number; months: number; remainingDays: number } | null>(null)
  const [addResult, setAddResult] = useState<string | null>(null)

  const calcDifference = () => {
    const d1 = new Date(startDate)
    const d2 = new Date(endDate)
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return

    const totalDays = daysBetween(d1, d2)
    const years = Math.floor(totalDays / 365)
    const remainingAfterYears = totalDays % 365
    const months = Math.floor(remainingAfterYears / 30)
    const remainingDays = remainingAfterYears % 30

    setDiffResult({ days: totalDays, years, months, remainingDays })
    setAddResult(null)
  }

  const calcAddSubtract = () => {
    const d = new Date(baseDate)
    const n = parseInt(daysInput)
    if (isNaN(d.getTime()) || isNaN(n)) return

    if (operation === 'subtract') {
      d.setDate(d.getDate() - n)
    } else {
      d.setDate(d.getDate() + n)
    }
    setAddResult(formatDate(d))
    setDiffResult(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Date Calculator Free Online — Date Difference &amp; Add Days</h1>
      <p className="text-gray-500 mb-6">Free online date calculator. Calculate days between dates or add/subtract days from any date. Get results in years, months, and days.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex gap-2 mb-6">
          {[
            { value: 'difference' as Mode, label: 'Days Between Dates' },
            { value: 'add-subtract' as Mode, label: 'Add / Subtract Days' },
          ].map(m => (
            <button key={m.value} onClick={() => { setMode(m.value); setDiffResult(null); setAddResult(null) }}
              className={`flex-1 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                mode === m.value ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'
              }`}>{m.label}</button>
          ))}
        </div>

        {mode === 'difference' ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            <button onClick={calcDifference}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Calculate Difference
            </button>
            {diffResult && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">{diffResult.days}</div>
                  <div className="text-sm text-gray-500">Total Days</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {diffResult.years}y {diffResult.months}m {diffResult.remainingDays}d
                  </div>
                  <div className="text-sm text-gray-500">Years / Months / Days</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.floor(diffResult.days / 7)}</div>
                  <div className="text-sm text-gray-500">Weeks</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Base Date</label>
                <input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Days</label>
                <input type="number" value={daysInput} onChange={e => setDaysInput(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              <button onClick={() => { setOperation('add'); setAddResult(null) }}
                className={`flex-1 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                  operation === 'add' ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'
                }`}>Add Days</button>
              <button onClick={() => { setOperation('subtract'); setAddResult(null) }}
                className={`flex-1 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                  operation === 'subtract' ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'
                }`}>Subtract Days</button>
            </div>
            <button onClick={calcAddSubtract}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Calculate
            </button>
            {addResult && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
                <p className="text-sm text-gray-500 mb-1">
                  {operation === 'add' ? `${baseDate} + ${daysInput} days` : `${baseDate} - ${daysInput} days`}
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-300">{addResult}</p>
              </div>
            )}
          </>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Choose between &ldquo;Days Between Dates&rdquo; or &ldquo;Add / Subtract Days&rdquo; mode.</li>
          <li>Enter the start and end dates, or a base date and number of days.</li>
          <li>Click the calculate button to see the result instantly.</li>
          <li>View the difference in total days, years/months/days, and weeks.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use the &ldquo;Add Days&rdquo; mode to calculate project deadlines and delivery dates.</li>
          <li>For precise month calculations, remember that months have varying lengths (28&ndash;31 days).</li>
          <li>The calculator uses calendar days, not business days. For workday calculations, exclude weekends separately.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>Does the calculator include both start and end dates?</h3>
          <p>No, it calculates the difference between the two dates. For example, Jan 1 to Jan 2 is 1 day.</p>
          <h3>Can I calculate business days?</h3>
          <p>This calculator counts all calendar days. To calculate business days, you would need to exclude weekends and holidays manually.</p>
          <h3>What date format is used?</h3>
          <p>The calculator uses the YYYY-MM-DD format (ISO 8601), which is the standard date input format supported by all modern browsers.</p>
        </div>
      </section>
    </div>
  )
}
