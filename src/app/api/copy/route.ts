import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { product, type = 'ad', tone = 'professional', audience = '' } = await request.json()
    if (!product || product.trim().length === 0) {
      return NextResponse.json({ error: 'Please describe the product or service' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`copy:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    if (!DEEPSEEK_API_KEY) return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })

    const typeDesc = type === 'ad' ? 'A compelling advertisement'
      : type === 'description' ? 'A product description for an e-commerce page'
      : 'A social media post to promote the product/service'

    const audienceContext = audience.trim() ? `\nTarget audience: ${audience}` : ''

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
            { role: 'system', content: `You are a professional copywriter. Write ${typeDesc} with a ${tone} tone. Include a headline/title followed by body copy. Make it persuasive and benefit-driven. No extra commentary.` },
            { role: 'user', content: `Product/service: ${product}${audienceContext}\n\nWrite the copy.` },
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
