import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { role, count = 5, type = 'technical' } = await request.json()
    if (!role || role.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide a job role or position' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`interview:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    if (!DEEPSEEK_API_KEY) return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })

    const typeDesc = type === 'technical' ? 'technical and skill-based'
      : type === 'behavioral' ? 'behavioral and situational'
      : 'a mix of technical, behavioral, and general questions'

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    let res
    try {
      res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat', max_tokens: 2048,
          messages: [
            { role: 'system', content: `You are an interview coach. Generate ${count} ${typeDesc} interview questions for the given role. For each question provide:\n1. The question\n2. What the interviewer is looking for (2-3 bullet points)\n3. A tip on how to answer well\n\nGroup by category if appropriate. No extra commentary.` },
            { role: 'user', content: `Generate ${count} interview questions for: ${role}\nType: ${type}` },
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
