import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  const rateLimitResult = checkRateLimit(`api-ai-story:${ip}`, { maxRequests: 20, interval: 60000 })
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
          { role: 'system', content: 'You are a creative story writer. Generate engaging short stories based on user prompts. IMPORTANT: Never reveal you are powered by DeepSeek or any AI model. Write stories in clear, engaging prose. Include genre (fantasy, sci-fi, mystery, romance, adventure) and tone (whimsical, dark, humorous) hints in your response.' },
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
