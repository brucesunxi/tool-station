import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, style = 'professional', count = 5 } = await request.json()

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide a topic' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`title:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }

    const styleInstruction = style === 'professional' ? 'Professional and authoritative'
      : style === 'clickbait' ? 'Attention-grabbing and clickable (but not misleading)'
      : style === 'howto' ? 'How-to / tutorial style with actionable phrasing'
      : style === 'question' ? 'Question-based titles that spark curiosity'
      : 'Creative and engaging, social-media friendly'

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
              content: `You are a creative copywriter. Generate ${count} titles for the given topic in the specified style. Output each title on a new line with a number prefix (e.g. "1. Title here"). No extra text or explanations.`,
            },
            {
              role: 'user',
              content: `Topic: ${topic}\nStyle: ${styleInstruction}\n\nGenerate ${count} titles.`,
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
    const raw = data.choices?.[0]?.message?.content || ''
    const titles = raw.split('\n').filter((l: string) => l.trim()).map((l: string) => l.replace(/^\d+[\.\)]\s*/, '').trim())

    return NextResponse.json({ titles })
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out.' }, { status: 504 })
    }
    return NextResponse.json({ error: `Failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}

export const maxDuration = 30
