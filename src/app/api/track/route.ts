import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const TRACKING_ENABLED = !!process.env.KV_URL

function getDateStr() {
  return new Date().toISOString().split('T')[0]
}

export async function POST(request: Request) {
  if (!TRACKING_ENABLED) {
    return NextResponse.json({ ok: false, message: 'KV not configured' })
  }

  try {
    const body = await request.json()
    const { path, referrer, duration } = body
    const date = getDateStr()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || ''

    // Run all operations in parallel
    const ops: Promise<any>[] = [
      kv.incr(`stats:visits:${date}`),
      kv.incr('stats:total'),
      kv.sadd(`stats:ips:${date}`, ip),
    ]

    if (path) {
      ops.push(
        kv.hincrby(`stats:pages:${date}`, path, 1),
        kv.zincrby(`stats:views:${date}`, 1, path),
        kv.zincrby('stats:views:total', 1, path),
        kv.lpush('stats:recent', JSON.stringify({
          path,
          ip,
          time: Date.now(),
          date,
          ua: userAgent.substring(0, 100),
          referrer: referrer || '',
        })),
        kv.ltrim('stats:recent', 0, 1999),
      )
      if (duration) {
        ops.push(kv.hincrby(`stats:durations:${date}`, path, Math.round(duration)))
      }
    }

    await Promise.all(ops)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Track error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
