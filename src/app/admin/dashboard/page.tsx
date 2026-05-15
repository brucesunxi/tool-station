'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface StatsData {
  configured: boolean
  overview?: {
    total: number
    today: number
    todayUnique: number
    todayPages: number
  }
  dailyTrend?: { date: string; visits: number; uniqueIps: number }[]
  todayPages?: Record<string, string>
  weeklyPages?: Record<string, number>
  recentVisits?: { path: string; ip: string; time: number; date: string; ua: string; referrer: string }[]
  todayRanking?: { name: string; score: number }[]
  allTimeRanking?: { name: string; score: number }[]
  error?: string
  message?: string
}

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function Bar({ value, max, label, color = 'bg-blue-500' }: { value: number; max: number; label?: string; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-gray-500 w-24 truncate shrink-0">{label}</span>}
      <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.max(pct, 1)}%` }} />
      </div>
      <span className="text-xs font-medium w-16 text-right shrink-0">{value.toLocaleString()}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/stats')
      if (res.status === 401) {
        router.push('/admin')
        return
      }
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin')
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  // Not configured
  if (data && !data.configured) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <button onClick={handleLogout} className="text-sm px-3 py-1.5 border rounded-lg text-gray-500">Logout</button>
        </div>
        <div className="text-center py-16 border rounded-xl">
          <p className="text-lg mb-2">No data yet</p>
          <p className="text-sm text-gray-400">Start browsing the site to collect data.</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-sm text-red-500">Error: {error}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Retry</button>
            <button onClick={handleLogout} className="px-4 py-2 border rounded-lg text-sm">Logout</button>
          </div>
        </div>
      </div>
    )
  }

  const overview = data?.overview
  const trend = data?.dailyTrend?.slice(-14) || []
  const maxTrend = Math.max(...trend.map(d => d.visits), 1)
  const allRanking = data?.allTimeRanking || []
  const maxAllRank = Math.max(...allRanking.map(r => r.score), 1)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500">Self-hosted tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Refresh</button>
          <button onClick={handleLogout} className="text-sm px-3 py-1.5 border rounded-lg text-gray-500 hover:text-red-500 transition-colors">Logout</button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card label="Total Visits" value={overview?.total ?? 0} />
        <Card label="Today Visits" value={overview?.today ?? 0} />
        <Card label="Today Unique IPs" value={overview?.todayUnique ?? 0} />
        <Card label="Pages Today" value={overview?.todayPages ?? 0} />
      </div>

      {/* All-time Popular Tools */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Most Visited Tools (All Time)</h2>
        <div className="bg-white dark:bg-gray-800 border rounded-xl p-4">
          {allRanking.length > 0 ? (
            <div className="space-y-2">
              {allRanking.slice(0, 20).map((r, i) => (
                <Bar key={i} value={r.score} max={maxAllRank} label={r.name} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Collecting data...</p>
          )}
        </div>
      </section>

      {/* Daily Trend */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Daily Visits (14 days)</h2>
        <div className="bg-white dark:bg-gray-800 border rounded-xl p-4">
          {trend.length > 0 ? (
            <div className="space-y-1.5">
              {trend.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-12 shrink-0">{fmtDate(d.date)}</span>
                  <div className="flex-1 flex gap-1">
                    <Bar value={d.visits} max={maxTrend} color="bg-blue-500" />
                  </div>
                  {d.uniqueIps > 0 && (
                    <span className="text-[10px] text-gray-400 w-12 text-right">{d.uniqueIps} IPs</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
          )}
        </div>
      </section>

      {/* Recent Visits */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Recent Visitors</h2>
        <div className="bg-white dark:bg-gray-800 border rounded-xl overflow-hidden">
          {data?.recentVisits && data.recentVisits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left px-4 py-2 font-medium">Time</th>
                    <th className="text-left px-4 py-2 font-medium">IP</th>
                    <th className="text-left px-4 py-2 font-medium">Page</th>
                    <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Referrer</th>
                    <th className="text-left px-4 py-2 font-medium hidden md:table-cell">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentVisits.slice(0, 30).map((v, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-2 whitespace-nowrap text-gray-500">{fmtTime(v.time)}</td>
                      <td className="px-4 py-2 font-mono">{v.ip}</td>
                      <td className="px-4 py-2 max-w-[120px] truncate">{v.path}</td>
                      <td className="px-4 py-2 max-w-[150px] truncate text-gray-500 hidden sm:table-cell">{v.referrer || '-'}</td>
                      <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{v.ua.includes('Mobile') ? '📱' : v.ua.includes('Mac') ? '💻' : '🖥️'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No visits recorded yet</p>
          )}
        </div>
      </section>
    </div>
  )
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-xl p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}
