import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

const stylePrompts: Record<string, { label: string; instruction: string }> = {
  formal: {
    label: 'Formal',
    instruction: 'Rewrite in a professional, formal tone. Use proper vocabulary, avoid contractions, and maintain a polished academic or business style.',
  },
  concise: {
    label: 'Concise',
    instruction: 'Rewrite to be brief and to-the-point. Remove unnecessary words while preserving all key information. Use bullet points if it helps clarity.',
  },
  casual: {
    label: 'Casual',
    instruction: 'Rewrite in a friendly, conversational tone. Use everyday language, contractions, and a warm voice. Make it feel like a friend explaining something.',
  },
  marketing: {
    label: 'Marketing',
    instruction: 'Rewrite as compelling marketing copy. Use persuasive language, power words, and emotional hooks. Make it engaging and action-oriented.',
  },
}

export async function POST(request: NextRequest) {
  try {
    const { text, style = 'formal' } = await request.json()

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`rewrite:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment before trying again.' }, { status: 429 })
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide text to rewrite' }, { status: 400 })
    }
    if (text.length > 10000) {
      return NextResponse.json({ error: 'Text must be under 10,000 characters' }, { status: 400 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'DEEPSEEK_API_KEY not configured.' }, { status: 500 })
    }

    const styleConfig = stylePrompts[style]
    if (!styleConfig) {
      return NextResponse.json({ error: 'Invalid style selected' }, { status: 400 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

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
          max_tokens: 4096,
          messages: [
            {
              role: 'system',
              content: 'You are a professional writing assistant. Rewrite text according to the requested style. Preserve the original meaning, facts, and key information. Maintain paragraph structure unless otherwise specified. Output ONLY the rewritten text, no explanations.',
            },
            {
              role: 'user',
              content: `${styleConfig.instruction}\n\nText:\n${text}`,
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
      return NextResponse.json(
        { error: `AI service returned status ${response.status}.` },
        { status: 502 }
      )
    }

    const data = await response.json()
    const rewrittenText = (data.choices?.[0]?.message?.content || '').trim()
    const wordCount = rewrittenText ? rewrittenText.split(/\s+/).length : 0

    return NextResponse.json({ rewrittenText, wordCount })
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return NextResponse.json({ error: 'Rewriting timed out. Try shorter text.' }, { status: 504 })
    }
    return NextResponse.json({ error: `Rewrite failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}

export const maxDuration = 30
