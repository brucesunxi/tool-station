import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()

    if (!description || description.trim().length === 0) {
      return NextResponse.json({ error: 'Please describe what regex you need' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`regex-gen:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    let response
    try {
      response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 1024,
          messages: [
            {
              role: 'system',
              content: 'You are a regex expert. Generate the correct regex pattern for the described use case. Provide:\n1. The regex pattern\n2. A short explanation of how it works\n3. Example matches and non-matches\n4. Any flags needed\n\nIf writing a regex that could cause catastrophic backtracking, warn the user.',
            },
            {
              role: 'user',
              content: `I need a regex that: ${description}\n\nProvide the regex pattern and explanation.`,
            },
          ],
        }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `AI service error: ${response.status}` }, { status: 502 })
    }

    const data = await response.json()
    const result = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({ result })
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out.' }, { status: 504 })
    }
    return NextResponse.json({ error: `Failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}

export const maxDuration = 30
