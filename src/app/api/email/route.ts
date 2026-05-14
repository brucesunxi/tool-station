import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

const scenarios: Record<string, string> = {
  complaint: 'A complaint or escalation email — polite but firm',
  inquiry: 'An inquiry or request for information',
  followup: 'A follow-up email after a meeting or previous communication',
  thank_you: 'A thank-you email expressing gratitude',
  proposal: 'A professional proposal or pitch via email',
  apology: 'An apology email for a mistake or delay',
  introduction: 'A self-introduction or business introduction email',
  reminder: 'A gentle reminder email about an upcoming deadline or payment',
}

export async function POST(request: NextRequest) {
  try {
    const { scenario = 'inquiry', details = '', tone = 'professional', recipient = '' } = await request.json()

    if (!details.trim()) {
      return NextResponse.json({ error: 'Please provide key points for the email' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`email:${ip}`, { interval: 60_000, maxRequests: 20 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }

    const scenarioDesc = scenarios[scenario] || 'A general email'

    const toneInstruction = tone === 'professional' ? 'Professional and polite'
      : tone === 'friendly' ? 'Warm and friendly'
      : 'Short and direct'

    const recipientContext = recipient ? `\nRecipient: ${recipient}` : ''

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    let response
    try {
      response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 2048,
          messages: [
            {
              role: 'system',
              content: 'You are a professional email writer. Generate a well-formatted email draft based on the scenario and key points provided. Include a subject line starting with "Subject:". Use appropriate salutation and closing. Output ONLY the email draft, no explanations.',
            },
            {
              role: 'user',
              content: `Scenario: ${scenarioDesc}\nTone: ${toneInstruction}${recipientContext}\n\nKey points to include:\n${details}\n\nWrite a complete email draft.`,
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
    const email = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({ email })
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out.' }, { status: 504 })
    }
    return NextResponse.json({ error: `Failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}

export const maxDuration = 30
