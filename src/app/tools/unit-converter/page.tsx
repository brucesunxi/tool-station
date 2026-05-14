'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

interface UnitCategory {
  name: string
  icon: string
  units: { label: string; value: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]
}

const categories: UnitCategory[] = [
  {
    name: 'Length', icon: '📏', units: [
      { label: 'Meters', value: 'm', toBase: v => v, fromBase: v => v },
      { label: 'Kilometers', value: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { label: 'Centimeters', value: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
      { label: 'Millimeters', value: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { label: 'Miles', value: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { label: 'Yards', value: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { label: 'Feet', value: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { label: 'Inches', value: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { label: 'Nautical Miles', value: 'nmi', toBase: v => v * 1852, fromBase: v => v / 1852 },
    ],
  },
  {
    name: 'Weight', icon: '⚖️', units: [
      { label: 'Kilograms', value: 'kg', toBase: v => v, fromBase: v => v },
      { label: 'Grams', value: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { label: 'Milligrams', value: 'mg', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { label: 'Pounds', value: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { label: 'Ounces', value: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { label: 'Tons (metric)', value: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { label: 'Stones', value: 'st', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
    ],
  },
  {
    name: 'Temperature', icon: '🌡️', units: [
      { label: 'Celsius', value: 'c', toBase: v => v, fromBase: v => v },
      { label: 'Fahrenheit', value: 'f', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { label: 'Kelvin', value: 'k', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ],
  },
  {
    name: 'Area', icon: '🔲', units: [
      { label: 'Square Meters', value: 'm2', toBase: v => v, fromBase: v => v },
      { label: 'Square Kilometers', value: 'km2', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { label: 'Hectares', value: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
      { label: 'Acres', value: 'ac', toBase: v => v * 4046.856, fromBase: v => v / 4046.856 },
      { label: 'Square Feet', value: 'ft2', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
      { label: 'Square Miles', value: 'mi2', toBase: v => v * 2.59e6, fromBase: v => v / 2.59e6 },
    ],
  },
  {
    name: 'Volume', icon: '🧪', units: [
      { label: 'Liters', value: 'l', toBase: v => v, fromBase: v => v },
      { label: 'Milliliters', value: 'ml', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { label: 'Gallons (US)', value: 'gal', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { label: 'Quarts', value: 'qt', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
      { label: 'Cubic Meters', value: 'm3', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { label: 'Cups', value: 'cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
      { label: 'Fluid Ounces', value: 'floz', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    ],
  },
  {
    name: 'Speed', icon: '🚀', units: [
      { label: 'km/h', value: 'kmh', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { label: 'mph', value: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { label: 'm/s', value: 'ms', toBase: v => v, fromBase: v => v },
      { label: 'Knots', value: 'knot', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ],
  },
  {
    name: 'Data', icon: '💾', units: [
      { label: 'Bytes', value: 'b', toBase: v => v, fromBase: v => v },
      { label: 'KB', value: 'kb', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { label: 'MB', value: 'mb', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
      { label: 'GB', value: 'gb', toBase: v => v * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024) },
      { label: 'TB', value: 'tb', toBase: v => v * 1024 * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024 * 1024) },
    ],
  },
  {
    name: 'Time', icon: '⏱️', units: [
      { label: 'Seconds', value: 's', toBase: v => v, fromBase: v => v },
      { label: 'Minutes', value: 'min', toBase: v => v * 60, fromBase: v => v / 60 },
      { label: 'Hours', value: 'h', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { label: 'Days', value: 'd', toBase: v => v * 86400, fromBase: v => v / 86400 },
      { label: 'Weeks', value: 'w', toBase: v => v * 604800, fromBase: v => v / 604800 },
      { label: 'Months (30d)', value: 'mo', toBase: v => v * 2592000, fromBase: v => v / 2592000 },
    ],
  },
]

export default function UnitConverterPage() {
  const [cat, setCat] = useState(categories[0])
  const [from, setFrom] = useState(cat.units[0].value)
  const [to, setTo] = useState(cat.units[1]?.value || cat.units[0].value)
  const [val, setVal] = useState('1')
  const [result, setResult] = useState('')

  const convert = (v: string, f: string, t: string, c: UnitCategory) => {
    const input = parseFloat(v)
    if (isNaN(input)) { setResult(''); return }
    const fromUnit = c.units.find(u => u.value === f)
    const toUnit = c.units.find(u => u.value === t)
    if (!fromUnit || !toUnit) return
    const base = fromUnit.toBase(input)
    setResult(toUnit.fromBase(base).toFixed(6).replace(/\.?0+$/, ''))
  }

  const switchCat = (c: UnitCategory) => {
    setCat(c)
    setFrom(c.units[0].value)
    setTo(c.units[1]?.value || c.units[0].value)
    setVal('1')
    setResult('')
  }

  const handleVal = (v: string) => {
    setVal(v)
    convert(v, from, to, cat)
  }

  const handleFrom = (v: string) => {
    setFrom(v)
    convert(val, v, to, cat)
  }

  const handleTo = (v: string) => {
    setTo(v)
    convert(val, from, v, cat)
  }

  const swap = () => {
    const t = from; setFrom(to); setTo(t)
    convert(val, to, t, cat)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Unit Converter</h1>
        <p className="text-gray-500">Convert between units of length, weight, temperature, area, volume, speed, data, and time.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(c => (
          <button key={c.name} onClick={() => switchCat(c)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              cat.name === c.name ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="p-6 border rounded-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Value</label>
            <input type="number" value={val} onChange={e => handleVal(e.target.value)}
              className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label className="block text-xs font-medium mb-1.5">From</label>
            <select value={from} onChange={e => handleFrom(e.target.value)}
              className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {cat.units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <button onClick={swap} className="p-3 mb-0.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
          </button>
          <div>
            <label className="block text-xs font-medium mb-1.5">To</label>
            <select value={to} onChange={e => handleTo(e.target.value)}
              className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {cat.units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {val} {cat.units.find(u => u.value === from)?.label} = {result} {cat.units.find(u => u.value === to)?.label}
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free Unit Converter</h2>
        <p className="text-sm text-gray-500">Convert between 50+ units across 8 categories. All conversions happen in your browser — nothing is sent to a server.</p>
      </div>
    </div>
  )
}
