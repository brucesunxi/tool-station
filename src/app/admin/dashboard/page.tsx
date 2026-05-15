'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AnalyticsData {
  configured: boolean
  overview?: {
    activeUsers: number
    pageViews: number
    sessions: number
    avgSessionDuration: number
    newUsers: number
    bounceRate: number
  }
  topPages?: { dimensions: string[]; metrics: string[] }[]
  dailyTrend?: { dimensions: string[]; metrics: string[] }[]
  countries?: { dimensions: string[]; metrics: string[] }[]
  trafficSources?: { dimensions: string[]; metrics: string[] }[]
  devices?: { dimensions: string[]; metrics: string[] }[]
  error?: string
  message?: string
}

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Bar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-gray-500 w-24 truncate shrink-0">{label}</span>}
      <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium w-16 text-right shrink-0">{value.toLocaleString()}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/analytics')
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

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-red-500 mb-2">Failed to load analytics</p>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Retry</button>
          <button onClick={handleLogout} className="px-4 py-2 text-gray-500 text-sm ml-2">Logout</button>
        </div>
      </div>
    )
  }

  if (data && !data.configured) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-xl mb-2">GA4 Not Configured</p>
          <p className="text-sm text-gray-500 mb-6">{data.message}</p>
          <button onClick={handleLogout} className="px-4 py-2 text-gray-500 border rounded-lg text-sm">Logout</button>
        </div>
      </div>
    )
  }

  const overview = data?.overview
  const maxViews = data?.topPages?.length ? Math.max(...data.topPages.map(p => parseInt(p.metrics[0] || '0'))) : 0
  const maxUsers = data?.dailyTrend?.length ? Math.max(...data.dailyTrend.map(d => parseInt(d.metrics[0] || '0'))) : 0
  const maxCountry = data?.countries?.length ? Math.max(...data.countries.map(c => parseInt(c.metrics[0] || '0'))) : 0
  const maxSource = data?.trafficSources?.length ? Math.max(...data.trafficSources.map(s => parseInt(s.metrics[0] || '0'))) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500">Last 7 days · GA4 data</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Refresh</button>
          <button onClick={handleLogout} className="text-sm px-3 py-1.5 border rounded-lg text-gray-500 hover:text-red-500 transition-colors">Logout</button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card label="Active Users" value={overview?.activeUsers ?? 0} />
        <Card label="Page Views" value={overview?.pageViews ?? 0} />
        <Card label="Sessions" value={overview?.sessions ?? 0} />
        <Card label="Avg. Duration" value={fmtTime(overview?.avgSessionDuration ?? 0)} />
        <Card label="New Users" value={overview?.newUsers ?? 0} />
        <Card label="Bounce Rate" value={overview?.bounceRate != null ? `${overview.bounceRate.toFixed(1)}%` : '0%'} />
      </div>

      {/* Top Pages */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Top Tools & Pages</h2>
        <div className="bg-white dark:bg-gray-800 border rounded-xl p-4">
          {data?.topPages?.length ? (
            <div className="space-y-2">
              {data.topPages.map((p, i) => (
                <Bar key={i} value={parseInt(p.metrics[0] || '0')} max={maxViews} label={p.dimensions[1] || p.dimensions[0]} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
          )}
        </div>
      </section>

      {/* Daily Trend + Geography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <section>
          <h2 className="text-lg font-bold mb-3">Daily Trend (14 days)</h2>
          <div className="bg-white dark:bg-gray-800 border rounded-xl p-4">
            {data?.dailyTrend?.length ? (
              <div className="space-y-1.5">
                {data.dailyTrend.slice(-7).map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-12 shrink-0">{fmtDate(d.dimensions[0])}</span>
                    <Bar value={parseInt(d.metrics[0] || '0')} max={maxUsers} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">Traffic Sources</h2>
          <div className="bg-white dark:bg-gray-800 border rounded-xl p-4">
            {data?.trafficSources?.length ? (
              <div className="space-y-2">
                {data.trafficSources.map((s, i) => (
                  <Bar key={i} value={parseInt(s.metrics[0] || '0')} max={maxSource} label={s.dimensions[0] || '(direct)'} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
            )}
          </div>
        </section>
      </div>

      {/* Countries + Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-bold mb-3">Top Countries</h2>
          <div className="bg-white dark:bg-gray-800 border rounded-xl p-4">
            {data?.countries?.length ? (
              <div className="space-y-2">
                {data.countries.map((c, i) => (
                  <Bar key={i} value={parseInt(c.metrics[0] || '0')} max={maxCountry} label={c.dimensions[0]} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">Devices</h2>
          <div className="bg-white dark:bg-gray-800 border rounded-xl p-4">
            {data?.devices?.length ? (
              <div className="space-y-2">
                {(() => { const mx = Math.max(...(data.devices || []).map(x => parseInt(x.metrics[0] || '0'))); return (data.devices || []).map((d, i) => <Bar key={i} value={parseInt(d.metrics[0] || '0')} max={mx} label={d.dimensions[0]} />); })()}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
            )}
          </div>
        </section>
      </div>
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
