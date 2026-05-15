'use client'

import { useState, useEffect } from 'react'
import AdBanner from '@/components/AdBanner'

function formatUnix(ts: number, fmt: string) {
  const d = new Date(ts * 1000)
  switch (fmt) {
    case 'iso': return d.toISOString()
    case 'locale': return d.toLocaleString()
    case 'date': return d.toLocaleDateString()
    case 'time': return d.toLocaleTimeString()
    case 'utc': return d.toUTCString()
    default: return d.toISOString()
  }
}

function toUnix(d: Date) {
  return Math.floor(d.getTime() / 1000)
}

export default function TimestampConverterPage() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000))
  const [tsInput, setTsInput] = useState<string>('')
  const [tsFormat, setTsFormat] = useState('iso')
  const [convertedDate, setConvertedDate] = useState<string>('')
  const [dateInput, setDateInput] = useState<string>('')
  const [convertedTs, setConvertedTs] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(timer)
  }, [])

  const convertToDate = () => {
    const ts = parseInt(tsInput)
    if (isNaN(ts) || ts < 0) { setConvertedDate(''); return }
    // Auto-detect milliseconds (if > year 2286)
    const seconds = ts > 10000000000 ? Math.floor(ts / 1000) : ts
    const d = new Date(seconds * 1000)
    if (isNaN(d.getTime())) { setConvertedDate(''); return }
    setConvertedDate(formatUnix(seconds, tsFormat))
  }

  const convertToTimestamp = () => {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) { setConvertedTs(''); return }
    setConvertedTs(toUnix(d).toString())
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Timestamp Converter Free Online — Unix Timestamp to Date</h1>
      <p className="text-gray-500 mb-6">Free online timestamp converter. Convert Unix timestamps to human-readable dates and vice versa. Support for seconds, milliseconds, and multiple date formats.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8 space-y-6">
        {/* Current Timestamp */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
          <div className="text-sm text-gray-500 mb-1">Current Unix Timestamp</div>
          <div className="text-2xl font-mono font-bold text-blue-600">{now}</div>
          <div className="text-sm text-gray-400 mt-1">{new Date(now * 1000).toISOString()}</div>
        </div>

        {/* Timestamp to Date */}
        <div>
          <h3 className="font-semibold mb-3">Unix Timestamp → Date</h3>
          <div className="flex gap-2 mb-3">
            <input type="number" value={tsInput} onChange={e => setTsInput(e.target.value)}
              placeholder="Enter Unix timestamp (e.g., 1700000000)"
              className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono" />
          </div>
          <div className="flex gap-2 mb-3 flex-wrap">
            {['iso', 'locale', 'date', 'time', 'utc'].map(f => (
              <button key={f} onClick={() => setTsFormat(f)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  tsFormat === f ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'
                }`}>{f.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={convertToDate}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Convert to Date
          </button>
          {convertedDate && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center font-mono text-green-700 dark:text-green-300">
              {convertedDate}
            </div>
          )}
        </div>

        {/* Date to Timestamp */}
        <div>
          <h3 className="font-semibold mb-3">Date → Unix Timestamp</h3>
          <input type="datetime-local" value={dateInput} onChange={e => setDateInput(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mb-3" />
          <button onClick={convertToTimestamp}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Convert to Timestamp
          </button>
          {convertedTs && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center font-mono text-green-700 dark:text-green-300">
              Unix: {convertedTs}<br />
              <span className="text-xs text-gray-400">Milliseconds: {convertedTs}000</span>
            </div>
          )}
        </div>
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>View the current Unix timestamp displayed at the top, updating every second.</li>
          <li>To convert a timestamp to a date, enter the Unix timestamp and select your preferred format, then click &ldquo;Convert to Date.&rdquo;</li>
          <li>To convert a date to a timestamp, pick a date and time, then click &ldquo;Convert to Timestamp.&rdquo;</li>
          <li>Copy the result for use in your application, database, or script.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Unix timestamps are in seconds since January 1, 1970 (epoch). The converter auto-detects millisecond timestamps.</li>
          <li>Use the ISO 8601 format for maximum compatibility with APIs and databases.</li>
          <li>The current timestamp display is useful for debugging and setting time-based events.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>What is a Unix timestamp?</h3>
          <p>A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (midnight UTC), not counting leap seconds.</p>
          <h3>What is the difference between seconds and milliseconds?</h3>
          <p>Unix timestamps are typically in seconds (10 digits). JavaScript&rsquo;s Date.now() returns milliseconds (13 digits). The converter automatically handles both.</p>
          <h3>Does the converter handle time zones?</h3>
          <p>The Unix timestamp is always UTC. The human-readable date formats respect your local time zone for &ldquo;locale&rdquo; and &ldquo;date&rdquo; formats.</p>
        </div>
      </section>
    </div>
  )
}
