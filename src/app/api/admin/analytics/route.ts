import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/admin-auth'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

function getPropertyId(): string | null {
  return process.env.GA4_PROPERTY_ID || null
}

async function getAnalyticsClient() {
  const credentials = process.env.GA4_SERVICE_ACCOUNT
  if (!credentials) return null
  try {
    const creds = JSON.parse(credentials)
    return new BetaAnalyticsDataClient({ credentials: creds })
  } catch {
    return null
  }
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const propertyId = getPropertyId()
  const client = await getAnalyticsClient()

  if (!propertyId || !client) {
    return NextResponse.json({
      configured: false,
      message: 'GA4 not configured. Set GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT in environment.',
    })
  }

  try {
    const property = `properties/${propertyId}`
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    // Helper to run report and extract first result
    const runReport = async (params: any) => {
      const result = await client.runReport(params)
      return Array.isArray(result) ? result[0] : result
    }

    // 1. Core metrics (last 7 days)
    const coreResponse = await runReport({
      property,
      dateRanges: [{ startDate: formatDate(sevenDaysAgo), endDate: formatDate(today) }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'newUsers' },
        { name: 'bounceRate' },
      ],
    })

    // 2. Top pages (last 7 days)
    const pagesResponse = await runReport({
      property,
      dateRanges: [{ startDate: formatDate(sevenDaysAgo), endDate: formatDate(today) }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'averageSessionDuration' }],
      orderBy: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 30,
    })

    // 3. Daily trend (last 14 days)
    const trendStart = new Date(today)
    trendStart.setDate(trendStart.getDate() - 14)
    const trendResponse = await runReport({
      property,
      dateRanges: [{ startDate: formatDate(trendStart), endDate: formatDate(today) }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
      orderBy: [{ dimension: { dimensionName: 'date' }, desc: false }],
    })

    // 4. Countries
    const countryResponse = await runReport({
      property,
      dateRanges: [{ startDate: formatDate(sevenDaysAgo), endDate: formatDate(today) }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
      orderBy: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 10,
    })

    // 5. Traffic sources
    const sourceResponse = await runReport({
      property,
      dateRanges: [{ startDate: formatDate(sevenDaysAgo), endDate: formatDate(today) }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
      orderBy: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    })

    // 6. Device categories
    const deviceResponse = await runReport({
      property,
      dateRanges: [{ startDate: formatDate(sevenDaysAgo), endDate: formatDate(today) }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseRows = (rows: any[] | undefined | null) =>
      (rows || []).map(r => ({
        dimensions: r.dimensionValues?.map((d: any) => d.value) || [],
        metrics: r.metricValues?.map((m: any) => m.value) || [],
      }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getMetric = (resp: any, idx: number) => resp?.rows?.[0]?.metricValues?.[idx]?.value || '0'

    return NextResponse.json({
      configured: true,
      overview: {
        activeUsers: parseInt(getMetric(coreResponse, 0)),
        pageViews: parseInt(getMetric(coreResponse, 1)),
        sessions: parseInt(getMetric(coreResponse, 2)),
        avgSessionDuration: parseFloat(getMetric(coreResponse, 3)),
        newUsers: parseInt(getMetric(coreResponse, 4)),
        bounceRate: parseFloat(getMetric(coreResponse, 5)),
      },
      topPages: parseRows(pagesResponse?.rows),
      dailyTrend: parseRows(trendResponse?.rows),
      countries: parseRows(countryResponse?.rows),
      trafficSources: parseRows(sourceResponse?.rows),
      devices: parseRows(deviceResponse?.rows),
    })
  } catch (err: any) {
    console.error('GA4 API error:', err)
    return NextResponse.json({
      configured: true,
      error: err.message || 'Failed to fetch analytics data',
    }, { status: 500 })
  }
}
