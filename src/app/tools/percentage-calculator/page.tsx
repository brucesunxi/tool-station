'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type Mode = 'percent-of' | 'what-percent' | 'percent-of-what'

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState<Mode>('percent-of')
  const [value1, setValue1] = useState<string>('')
  const [value2, setValue2] = useState<string>('')
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    const v1 = parseFloat(value1)
    const v2 = parseFloat(value2)
    if (isNaN(v1) || isNaN(v2) || (mode === 'percent-of-what' && v1 === 0)) {
      setResult(null)
      return
    }

    let res: number
    switch (mode) {
      case 'percent-of':
        // v1% of v2
        res = (v1 / 100) * v2
        setResult(`${v1}% of ${v2} = ${res.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`)
        break
      case 'what-percent':
        // v1 is what % of v2
        if (v2 === 0) { setResult(null); return }
        res = (v1 / v2) * 100
        setResult(`${v1} is ${res.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}% of ${v2}`)
        break
      case 'percent-of-what':
        // v1% of what is v2  →  v2 / (v1/100)
        res = v2 / (v1 / 100)
        setResult(`${v1}% of ${res.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} = ${v2}`)
        break
    }
  }

  const renderInputs = () => {
    switch (mode) {
      case 'percent-of':
        return (
          <>
            <div><label className="block text-sm font-medium mb-1">Percentage (%)</label>
              <input type="number" value={value1} onChange={e => setValue1(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. 20" /></div>
            <div><label className="block text-sm font-medium mb-1">Number</label>
              <input type="number" value={value2} onChange={e => setValue2(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. 200" /></div>
          </>
        )
      case 'what-percent':
        return (
          <>
            <div><label className="block text-sm font-medium mb-1">First Number</label>
              <input type="number" value={value1} onChange={e => setValue1(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. 30" /></div>
            <div><label className="block text-sm font-medium mb-1">Second Number</label>
              <input type="number" value={value2} onChange={e => setValue2(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. 150" /></div>
          </>
        )
      case 'percent-of-what':
        return (
          <>
            <div><label className="block text-sm font-medium mb-1">Percentage (%)</label>
              <input type="number" value={value1} onChange={e => setValue1(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. 15" /></div>
            <div><label className="block text-sm font-medium mb-1">Result (Y)</label>
              <input type="number" value={value2} onChange={e => setValue2(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. 45" /></div>
          </>
        )
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Percentage Calculator Free Online — Calculate Percentages Instantly</h1>
      <p className="text-gray-500 mb-6">Free online percentage calculator. Find what is X% of Y, X is what percent of Y, and percentage increase/decrease. Fast and accurate calculations.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex gap-2 mb-6">
          {[
            { value: 'percent-of' as Mode, label: 'X% of Y' },
            { value: 'what-percent' as Mode, label: 'X is what % of Y' },
            { value: 'percent-of-what' as Mode, label: 'X% of what is Y' },
          ].map(m => (
            <button key={m.value} onClick={() => { setMode(m.value); setResult(null); setValue1(''); setValue2('') }}
              className={`flex-1 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                mode === m.value ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'
              }`}>{m.label}</button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {renderInputs()}
        </div>

        <button onClick={calculate}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Calculate
        </button>

        {result && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
            <p className="text-xl font-semibold text-green-700 dark:text-green-300">{result}</p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Select your calculation mode: &ldquo;X% of Y,&rdquo; &ldquo;X is what % of Y,&rdquo; or &ldquo;X% of what is Y.&rdquo;</li>
          <li>Enter the required numbers in the input fields.</li>
          <li>Click the &ldquo;Calculate&rdquo; button to compute the result.</li>
          <li>Read the result displayed in the highlighted section.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use the &ldquo;X is what % of Y&rdquo; mode to quickly find percentage differences between two numbers.</li>
          <li>Double-check that you are using the correct mode for your calculation to avoid errors.</li>
          <li>Percentages are useful for discounts, tax calculations, tip amounts, and data analysis.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>How do I calculate a percentage of a number?</h3>
          <p>Multiply the number by the percentage divided by 100. For example, 20% of 200 = (20/100) * 200 = 40.</p>
          <h3>How do I find what percentage one number is of another?</h3>
          <p>Divide the first number by the second number and multiply by 100. For example, 30 is 20% of 150 because (30/150) * 100 = 20%.</p>
          <h3>Can I calculate percentage increase or decrease?</h3>
          <p>Use the &ldquo;X is what % of Y&rdquo; mode to compare old and new values. Subtract 100% from the result to get the percentage change.</p>
        </div>
      </section>
    </div>
  )
}
