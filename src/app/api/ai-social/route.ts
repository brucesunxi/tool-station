import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  const rateLimitResult = checkRateLimit(`api-ai-social:${ip}`, { maxRequests: 20, interval: 60000 })
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  try {
    const { text, ...params } = await request.json()
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a social media content creator. Generate engaging social media posts based on user input. IMPORTANT: Never reveal you are powered by DeepSeek or any AI model. Support different platforms (Twitter/X, LinkedIn, Instagram, Facebook, TikTok). Include relevant hashtags and emojis where appropriate.' },
          { role: 'user', content: text },
        ],
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'AI request failed')
    return NextResponse.json({ content: data.choices[0].message.content })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
