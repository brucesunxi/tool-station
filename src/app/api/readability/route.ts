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
    const { allowed } = checkRateLimit(`readability:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    if (!DEEPSEEK_API_KEY) return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    let res
    try {
      res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat', max_tokens: 2048,
          messages: [
            { role: 'system', content: 'You are a readability and writing style analyst. Analyze the text and output in this format:\n\n## Readability Score\n[score out of 100 and interpretation]\n\n## Statistics\n- Word count, sentence count, avg sentence length\n- Estimated reading time\n- Complex word percentage\n\n## Issues & Suggestions\n- [List specific readability issues with suggested fixes]\n\n## Simplified Version\n[A rewritten version of the text that is easier to read]\n\nNo extra commentary.' },
            { role: 'user', content: `Analyze the readability of this text:\n\n${text}` },
          ],
        }),
        signal: controller.signal,
      })
    } finally { clearTimeout(timeoutId) }

    if (!res.ok) return NextResponse.json({ error: `AI service error: ${res.status}` }, { status: 502 })
    const data = await res.json()
    return NextResponse.json({ result: data.choices?.[0]?.message?.content || '' })
  } catch (error: any) {
    if (error?.name === 'AbortError') return NextResponse.json({ error: 'Request timed out.' }, { status: 504 })
    return NextResponse.json({ error: `Failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}
export const maxDuration = 30
