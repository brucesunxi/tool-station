import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { text, length = 'medium', style = 'paragraph' } = await request.json()

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`summarize:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment before trying again.' }, { status: 429 })
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide text to summarize' }, { status: 400 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY not configured. Go to Vercel → Settings → Environment Variables to add it, then Redeploy.' },
        { status: 500 }
      )
    }

    const lengthInstruction = length === 'short' ? '2-3 sentences'
      : length === 'medium' ? 'a short paragraph (4-6 sentences)'
      : 'a detailed summary (7-10 sentences) covering key points'

    const styleInstruction = style === 'paragraph' ? 'Write in flowing paragraph form.'
      : style === 'bullet' ? 'Write as bullet points.'
      : 'Write in one concise sentence.'

    // Create an AbortController with 15s timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    let response
    try {
      response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 1024,
          messages: [
            {
              role: 'system',
              content: 'You are a text summarization assistant. Provide clear, accurate summaries.',
            },
            {
              role: 'user',
              content: `Summarize the following text in ${lengthInstruction}. ${styleInstruction}\n\nText:\n${text}`,
            },
          ],
        }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepSeek API error:', response.status, error)
      return NextResponse.json(
        { error: `AI service returned status ${response.status}. Check your API key and quota.` },
        { status: 502 }
      )
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content || ''

    const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0

    return NextResponse.json({
      summary,
      wordCount,
      originalLength: text.length,
      length,
      style,
    })
  } catch (error: any) {
    console.error('Summarize error:', error?.message || error)

    if (error?.name === 'AbortError') {
      return NextResponse.json(
        { error: 'AI service timed out. DeepSeek API may be slow from your region. Try again or use shorter text.' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: `Failed to generate summary: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export const maxDuration = 30
