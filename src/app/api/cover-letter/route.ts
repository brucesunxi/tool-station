import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, company, skills, tone = 'professional' } = await request.json()
    if (!jobTitle || !company) {
      return NextResponse.json({ error: 'Please provide job title and company name' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`cover-letter:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    if (!DEEPSEEK_API_KEY) return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })

    const toneDesc = tone === 'professional' ? 'Professional and confident'
      : tone === 'enthusiastic' ? 'Enthusiastic and passionate'
      : 'Concise and direct'

    const skillContext = skills?.trim() ? `\nKey skills/experience to highlight: ${skills}` : ''

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
            { role: 'system', content: 'You are a professional career coach and resume writer. Write a compelling cover letter for the given job application. Include a subject line, salutation, body paragraphs highlighting relevant skills and enthusiasm for the role, and a professional closing. Output the complete letter with proper formatting. No extra commentary.' },
            { role: 'user', content: `Job Title: ${jobTitle}\nCompany: ${company}${skillContext}\nTone: ${toneDesc}\n\nWrite a cover letter.` },
          ],
        }),
        signal: controller.signal,
      })
    } finally { clearTimeout(timeoutId) }

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `AI service error: ${res.status}` }, { status: 502 })
    }
    const data = await res.json()
    return NextResponse.json({ letter: data.choices?.[0]?.message?.content || '' })
  } catch (error: any) {
    if (error?.name === 'AbortError') return NextResponse.json({ error: 'Request timed out.' }, { status: 504 })
    return NextResponse.json({ error: `Failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}
export const maxDuration = 30
