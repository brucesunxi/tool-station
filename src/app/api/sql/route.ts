import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { question, dialect = 'standard' } = await request.json()
    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Please describe what data you want to query' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`sql:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    if (!DEEPSEEK_API_KEY) return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })

    const dialectHint = dialect !== 'standard' ? ` Use ${dialect.toUpperCase()} syntax.` : ' Use standard SQL syntax.'

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
            { role: 'system', content: `You are a SQL expert. Convert natural language queries to SQL.${dialectHint} Provide the SQL query in a code block and a brief explanation of what it does. If assumptions are needed about table structure, state them clearly.` },
            { role: 'user', content: `Write a SQL query for: ${question}` },
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
