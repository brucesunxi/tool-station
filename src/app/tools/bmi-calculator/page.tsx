'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type Category = 'Underweight' | 'Normal' | 'Overweight' | 'Obese'

function getCategory(bmi: number): { label: Category; color: string; bg: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' }
  if (bmi < 25) return { label: 'Normal', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' }
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
  return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' }
}

export default function BmiCalculatorPage() {
  const [height, setHeight] = useState<string>('170')
  const [weight, setWeight] = useState<string>('70')
  const [bmi, setBmi] = useState<number | null>(null)

  const calcBmi = () => {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    if (!h || !w || h <= 0 || w <= 0) return
    const bmiVal = w / Math.pow(h / 100, 2)
    setBmi(Math.round(bmiVal * 100) / 100)
  }

  const cat = bmi !== null ? getCategory(bmi) : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">BMI Calculator Free Online — Body Mass Index Calculator</h1>
      <p className="text-gray-500 mb-6">Free online BMI calculator. Calculate your Body Mass Index instantly. Check if you&apos;re underweight, normal, overweight, or obese based on your height and weight.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" min={1} max={300} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" min={1} max={500} />
          </div>
        </div>
        <button onClick={calcBmi}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Calculate BMI
        </button>

        {bmi !== null && cat && (
          <div className={`mt-6 p-4 rounded-xl text-center ${cat.bg}`}>
            <div className="text-4xl font-bold mb-1">{bmi}</div>
            <div className={`text-lg font-semibold ${cat.color}`}>{cat.label}</div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-4 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{
                width: `${Math.min((bmi / 40) * 100, 100)}%`,
                background: bmi < 18.5 ? '#3b82f6' : bmi < 25 ? '#22c55e' : bmi < 30 ? '#eab308' : '#ef4444'
              }} />
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-500">
              <span>16</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Enter your height in centimeters (cm) in the Height field.</li>
          <li>Enter your weight in kilograms (kg) in the Weight field.</li>
          <li>Click the &ldquo;Calculate BMI&rdquo; button to compute your Body Mass Index.</li>
          <li>View your BMI value, weight category, and color-coded indicator instantly.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use accurate measurements for the most reliable BMI result.</li>
          <li>BMI is a screening tool, not a diagnostic test. Consult a healthcare provider for a full assessment.</li>
          <li>Track your BMI over time to monitor changes in your body composition.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>What is a healthy BMI range?</h3>
          <p>A BMI between 18.5 and 24.9 is considered a healthy weight range for most adults. Below 18.5 is underweight, 25&ndash;29.9 is overweight, and 30 or above is obese.</p>
          <h3>Is BMI accurate for athletes?</h3>
          <p>BMI may overestimate body fat in athletes and people with high muscle mass because it does not distinguish between muscle and fat. Additional measurements may be needed.</p>
          <h3>Can BMI be used for children?</h3>
          <p>BMI for children and teenagers uses percentiles based on age and sex. This calculator is designed for adults aged 18 and over.</p>
        </div>
      </section>
    </div>
  )
}
