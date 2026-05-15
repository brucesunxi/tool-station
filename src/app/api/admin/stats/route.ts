import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/admin-auth'
import { kv } from '@vercel/kv'

function getDates() {
  const today = new Date()
  const dates: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.KV_URL) {
    return NextResponse.json({ configured: false, message: 'KV not configured' })
  }

  try {
    const dates = getDates()
    const today = dates[dates.length - 1]
    const last7 = dates.slice(-7)

    // Run all queries in parallel
    const [
      totalVisits,
      todayVisits,
      todayUniqueIps,
      todayPages,
      weeklyPages,
      recentVisitsRaw,
      todayRanking,
      allTimeRanking,
    ] = await Promise.all([
      kv.get<number>('stats:total'),
      kv.get<number>(`stats:visits:${today}`),
      kv.scard(`stats:ips:${today}`),
      kv.hgetall<Record<string, string>>(`stats:pages:${today}`),
      (async () => {
        const result: Record<string, number> = {}
        for (const date of last7) {
          const pages = await kv.hgetall<Record<string, string>>(`stats:pages:${date}`)
          if (pages) {
            for (const [path, count] of Object.entries(pages)) {
              result[path] = (result[path] || 0) + parseInt(count)
            }
          }
        }
        return result
      })(),
      kv.lrange('stats:recent', 0, 49),
      kv.zrange(`stats:views:${today}`, 0, 20, { rev: true, withScores: true }),
      kv.zrange('stats:views:total', 0, 50, { rev: true, withScores: true }),
    ])

    // Daily trend (last 30 days)
    const dailyTrend = await Promise.all(dates.map(async date => {
      const [visits, uniqueIps] = await Promise.all([
        kv.get<number>(`stats:visits:${date}`),
        kv.scard(`stats:ips:${date}`),
      ])
      return { date, visits: visits || 0, uniqueIps: uniqueIps || 0 }
    }))

    // Format recent visits
    const recentVisits = (recentVisitsRaw || []).map(r => {
      try { return typeof r === 'string' ? JSON.parse(r) : r } catch { return null }
    }).filter(Boolean)

    // Parse ranking data
    const parseZSet = (data: (string | number)[]) => {
      const result: { name: string; score: number }[] = []
      for (let i = 0; i < data.length; i += 2) {
        result.push({ name: data[i] as string, score: data[i + 1] as number })
      }
      return result
    }

    return NextResponse.json({
      configured: true,
      overview: {
        total: totalVisits || 0,
        today: todayVisits || 0,
        todayUnique: todayUniqueIps || 0,
        todayPages: Object.keys(todayPages || {}).length,
      },
      todayPages: todayPages || {},
      weeklyPages,
      dailyTrend,
      recentVisits,
      todayRanking: parseZSet((todayRanking || []) as (string | number)[]),
      allTimeRanking: parseZSet((allTimeRanking || []) as (string | number)[]),
    })
  } catch (err: any) {
    console.error('Stats error:', err)
    return NextResponse.json({ error: err.message || 'Failed to load stats' }, { status: 500 })
  }
}
