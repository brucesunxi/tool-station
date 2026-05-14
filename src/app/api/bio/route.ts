import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { role, tone = 'professional', platform = 'linkedin', details = '' } = await request.json()
    if (!role || role.trim().length === 0) {
      return NextResponse.json({ error: 'Please describe your role or profession' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`bio:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    if (!DEEPSEEK_API_KEY) return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })

    const toneDesc = tone === 'professional' ? 'Professional and polished'
      : tone === 'creative' ? 'Creative and unique'
      : 'Fun and casual'

    const detailContext = details.trim() ? `\nInclude these details: ${details}` : ''

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    let res
    try {
      res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat', max_tokens: 1024,
          messages: [
            { role: 'system', content: `You are a professional bio writer. Generate 3 bio options for ${platform}. Tone: ${toneDesc}. Each bio should be concise and impactful. Label them "Option 1:", "Option 2:", "Option 3:". No extra commentary.` },
            { role: 'user', content: `Role: ${role}${detailContext}\n\nGenerate 3 bio options for ${platform}.` },
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
