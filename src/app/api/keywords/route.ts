import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide text to analyze' }, { status: 400 })
    }
    if (text.length > 10000) {
      return NextResponse.json({ error: 'Text must be under 10,000 characters' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`keywords:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    let response
    try {
      response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 2048,
          messages: [
            {
              role: 'system',
              content: 'You are an SEO keyword research expert. Extract the most important keywords and key phrases from the given text. Group them into:\n- Primary Keywords (3-5 main themes)\n- Secondary Keywords (supporting terms)\n- Long-tail Phrases (2-4 word phrases relevant to the content)\n\nOutput in this format:\n\n## Primary Keywords\nkeyword1, keyword2, keyword3\n\n## Secondary Keywords\nkeyword1, keyword2, keyword3\n\n## Long-tail Phrases\n- phrase one\n- phrase two\n\nNo extra commentary.',
            },
            { role: 'user', content: text },
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
