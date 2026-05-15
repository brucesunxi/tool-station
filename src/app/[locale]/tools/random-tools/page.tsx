'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const tools = [
  { id: 'random', label: 'Random Number', icon: '🔢' },
  { id: 'dice', label: 'Dice Roll', icon: '🎲' },
  { id: 'coin', label: 'Coin Flip', icon: '🪙' },
  { id: 'lottery', label: 'Lottery', icon: '🎰' },
  { id: 'choose', label: 'Pick a Choice', icon: '🤔' },
] as const

type ToolId = (typeof tools)[number]['id']

export default function RandomToolsPage() {
  const t = useTranslations('tools.random-tools')
  const ct = useTranslations('common')

  const [active, setActive] = useState<ToolId>('random')
  const [result, setResult] = useState<string | React.ReactNode>('')

  // Random Number
  const [rMin, setRMin] = useState(1)
  const [rMax, setRMax] = useState(100)

  // Dice
  const [diceSides, setDiceSides] = useState(6)
  const [diceCount, setDiceCount] = useState(1)

  // Lottery
  const [lMin, setLMin] = useState(1)
  const [lMax, setLMax] = useState(49)
  const [lCount, setLCount] = useState(6)

  // Choice
  const [choices, setChoices] = useState('')

  const genRandom = useCallback(() => {
    if (rMin > rMax) { setResult('Min must be less than max'); return }
    setResult(String(randInt(rMin, rMax)))
  }, [rMin, rMax])

  const genDice = useCallback(() => {
    const rolls = Array.from({ length: diceCount }, () => randInt(1, diceSides))
    setResult(rolls.join(', '))
  }, [diceSides, diceCount])

  const flipCoin = useCallback(() => {
    setResult(Math.random() < 0.5 ? 'Heads' : 'Tails')
  }, [])

  const genLottery = useCallback(() => {
    if (lCount > (lMax - lMin + 1)) { setResult('Too many numbers for the range'); return }
    const nums = new Set<number>()
    while (nums.size < lCount) nums.add(randInt(lMin, lMax))
    setResult(Array.from(nums).sort((a, b) => a - b).join(' - '))
  }, [lMin, lMax, lCount])

  const genChoice = useCallback(() => {
    const items = choices.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
    if (items.length < 2) { setResult('Enter at least 2 choices'); return }
    setResult(items[randInt(0, items.length - 1)])
  }, [choices])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="flex flex-wrap gap-2 mb-6">
        {tools.map(t => (
          <button key={t.id} onClick={() => { setActive(t.id); setResult('') }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              active === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 border rounded-xl space-y-4 min-h-[220px]">
        {active === 'random' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium mb-1">Min</label>
                <input type="number" value={rMin} onChange={e => setRMin(Number(e.target.value))} className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700" /></div>
              <div><label className="block text-xs font-medium mb-1">Max</label>
                <input type="number" value={rMax} onChange={e => setRMax(Number(e.target.value))} className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700" /></div>
            </div>
            <button onClick={genRandom} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">{ct("generate")}</button>
          </>
        )}

        {active === 'dice' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium mb-1">Sides</label>
                <select value={diceSides} onChange={e => setDiceSides(Number(e.target.value))} className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700">
                  {[4, 6, 8, 10, 12, 20, 100].map(n => <option key={n} value={n}>d{n}</option>)}</select></div>
              <div><label className="block text-xs font-medium mb-1">Rolls</label>
                <select value={diceCount} onChange={e => setDiceCount(Number(e.target.value))} className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700">
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
            </div>
            <button onClick={genDice} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Roll Dice</button>
          </>
        )}

        {active === 'coin' && (
          <div className="text-center py-6">
            <button onClick={flipCoin} className="text-8xl mb-4 hover:scale-110 transition-transform cursor-pointer bg-transparent border-none">
              🪙
            </button>
            <p className="text-sm text-gray-400">Click the coin to flip</p>
          </div>
        )}

        {active === 'lottery' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-xs font-medium mb-1">From</label>
                <input type="number" value={lMin} onChange={e => setLMin(Number(e.target.value))} className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700" /></div>
              <div><label className="block text-xs font-medium mb-1">To</label>
                <input type="number" value={lMax} onChange={e => setLMax(Number(e.target.value))} className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700" /></div>
              <div><label className="block text-xs font-medium mb-1">{ct("count")}</label>
                <input type="number" value={lCount} onChange={e => setLCount(Number(e.target.value))} min={1} className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700" /></div>
            </div>
            <button onClick={genLottery} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Pick Numbers</button>
          </>
        )}

        {active === 'choose' && (
          <>
            <div><label className="block text-xs font-medium mb-1">Choices (one per line or comma-separated)</label>
              <textarea value={choices} onChange={e => setChoices(e.target.value)} rows={5} placeholder="Option 1&#10;Option 2&#10;Option 3"
                className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <button onClick={genChoice} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Pick</button>
          </>
        )}

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg text-center">
            <p className="text-lg font-semibold text-green-700 dark:text-green-300 break-all whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>

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
