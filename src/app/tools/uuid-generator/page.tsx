'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

function generateUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function generateUuidV7(): string {
  const timestamp = Date.now().toString(16).padStart(12, '0')
  const random1 = Math.random().toString(16).slice(2, 7)
  const random2 = (Math.random() * 0x10000 | 0).toString(16).padStart(4, '0')
  const random3 = Math.random().toString(16).slice(2, 8)
  return `${timestamp.slice(0, 8)}-${timestamp.slice(8)}-7${random1.slice(1)}-${('8' + random2[0])}${random2.slice(1)}-${random3.padEnd(12, '0')}`
}

export default function UuidGeneratorPage() {
  const [version, setVersion] = useState<'v4' | 'v7'>('v4')
  const [count, setCount] = useState(5)
  const [caseUpper, setCaseUpper] = useState(false)
  const [uuids, setUuids] = useState<string[]>([])

  const generate = useCallback(() => {
    const fn = version === 'v4' ? generateUuidV4 : generateUuidV7
    const list = Array.from({ length: count }, () => {
      const id = fn()
      return caseUpper ? id.toUpperCase() : id
    })
    setUuids(list)
  }, [version, count, caseUpper])

  const copyAll = async () => {
    if (uuids.length === 0) return
    try { await navigator.clipboard.writeText(uuids.join('\n')) } catch { /* */ }
  }

  const copyOne = async (uuid: string) => {
    try { await navigator.clipboard.writeText(uuid) } catch { /* */ }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">UUID Generator</h1>
        <p className="text-gray-500">Generate UUID v4 (random) and v7 (time-based) identifiers.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          <button onClick={() => setVersion('v4')}
            className={`px-4 py-2 rounded-lg border text-sm transition-all ${version === 'v4' ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-400'}`}>UUID v4</button>
          <button onClick={() => setVersion('v7')}
            className={`px-4 py-2 rounded-lg border text-sm transition-all ${version === 'v7' ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-400'}`}>UUID v7</button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Count:</label>
          <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="w-20 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" checked={caseUpper} onChange={e => setCaseUpper(e.target.checked)} className="accent-blue-600" />
          Uppercase
        </label>
      </div>

      <button onClick={generate} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mb-6">
        Generate {count} UUID{count > 1 ? 's' : ''}
      </button>

      {uuids.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{uuids.length} generated</span>
            <button onClick={copyAll} className="text-sm px-3 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy All</button>
          </div>
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-2 p-3 border rounded-lg font-mono text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 group">
              <span className="text-gray-400 w-6">{i + 1}.</span>
              <span className="flex-1">{uuid}</span>
              <button onClick={() => copyOne(uuid)}
                className="text-xs px-2 py-1 border rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Copy</button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free Online UUID Generator</h2>
        <p className="text-sm text-gray-500">Generate UUID v4 (random) and v7 (time-ordered) identifiers for databases, APIs, and software development. Supports batch generation up to 100 at once. All processing in your browser.</p>
      </div>
    </div>
  )
}
