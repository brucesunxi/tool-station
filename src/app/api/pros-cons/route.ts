import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, aspect = 'all' } = await request.json()

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide a topic to analyze' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`pros-cons:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }

    const aspectInstruction = aspect === 'all' ? 'Consider all relevant aspects'
      : aspect === 'cost' ? 'Focus primarily on cost and financial aspects'
      : 'Focus primarily on time, effort, and practical implementation'

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
              content: 'You are an analytical decision-making assistant. Analyze the given topic and provide balanced pros and cons. Be objective, specific, and practical. Output in this format:\n\n## Pros\n- pro 1 (with brief explanation)\n- pro 2\n\n## Cons\n- con 1 (with brief explanation)\n- con 2\n\n## Verdict\nA balanced summary and recommendation.\n\nNo extra commentary.',
            },
            {
              role: 'user',
              content: `Analyze this topic for pros and cons: ${topic}\n\n${aspectInstruction}\n\nProvide a balanced analysis.`,
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
