import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { text, count = 10 } = await request.json()
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide source text for flashcards' }, { status: 400 })
    }
    if (text.length > 15000) {
      return NextResponse.json({ error: 'Text must be under 15,000 characters' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`flashcards:${ip}`, { interval: 60_000, maxRequests: 20 })
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
          model: 'deepseek-chat', max_tokens: 4096,
          messages: [
            { role: 'system', content: `You are an educational content creator. Generate ${count} question-and-answer flashcards from the given text. Each card should have a clear question and a concise answer. Output in this format:\n\n## Card 1\n**Q:** [question]\n**A:** [answer]\n\n## Card 2\n...\n\nMake questions focus on key concepts, definitions, and important details.` },
            { role: 'user', content: `Generate ${count} flashcards from this text:\n\n${text}` },
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
