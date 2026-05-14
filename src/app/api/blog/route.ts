import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords = '', format = 'outline', tone = 'professional' } = await request.json()

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide a topic' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`blog:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }

    const formatInstruction = format === 'outline' ? 'a detailed outline with sections and bullet points'
      : format === 'intro' ? 'an introductory paragraph only'
      : 'a full blog post with introduction, body paragraphs, and conclusion'

    const toneInstruction = tone === 'professional' ? 'Professional and informative'
      : tone === 'conversational' ? 'Conversational and engaging'
      : 'Persuasive and compelling'

    const keywordContext = keywords.trim() ? `\nInclude these keywords naturally: ${keywords}` : ''

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    let response
    try {
      response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 4096,
          messages: [
            {
              role: 'system',
              content: `You are a professional content writer. Generate ${formatInstruction} on the given topic. Tone: ${toneInstruction}. Output the content with clear section headings and proper formatting.`,
            },
            {
              role: 'user',
              content: `Topic: ${topic}${keywordContext}\n\nGenerate the content.`,
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
    const content = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({ content })
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out. Try a shorter topic.' }, { status: 504 })
    }
    return NextResponse.json({ error: `Failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}

export const maxDuration = 30
