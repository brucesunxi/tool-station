import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { code, fromLang, toLang } = await request.json()
    if (!code || code.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide code to convert' }, { status: 400 })
    }
    if (code.length > 10000) {
      return NextResponse.json({ error: 'Code must be under 10,000 characters' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`code-convert:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    if (!DEEPSEEK_API_KEY) return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    let res
    try {
      res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat', max_tokens: 4096,
          messages: [
            { role: 'system', content: `You are a code conversion expert. Convert code from ${fromLang} to ${toLang}. Preserve the original logic, comments, and structure. Output in a code block. After the code, briefly note any key differences or caveats.` },
            { role: 'user', content: `Convert this ${fromLang} code to ${toLang}:\n\n${code}` },
          ],
        }),
        signal: controller.signal,
      })
    } finally { clearTimeout(timeoutId) }

    if (!res.ok) return NextResponse.json({ error: `AI service error: ${res.status}` }, { status: 502 })
    const data = await res.json()
    return NextResponse.json({ result: data.choices?.[0]?.message?.content || '' })
  } catch (error: any) {
    if (error?.name === 'AbortError') return NextResponse.json({ error: 'Request timed out. Try shorter code.' }, { status: 504 })
    return NextResponse.json({ error: `Failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}
export const maxDuration = 30
