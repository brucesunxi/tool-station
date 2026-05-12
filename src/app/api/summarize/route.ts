import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { text, length = 'medium', style = 'paragraph' } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide text to summarize' }, { status: 400 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'AI API key not configured. Please set DEEPSEEK_API_KEY in Vercel environment variables.' },
        { status: 500 }
      )
    }

    const lengthInstruction = length === 'short' ? '2-3 sentences'
      : length === 'medium' ? 'a short paragraph (4-6 sentences)'
      : 'a detailed summary (7-10 sentences) covering key points'

    const styleInstruction = style === 'paragraph' ? 'Write in flowing paragraph form.'
      : style === 'bullet' ? 'Write as bullet points.'
      : 'Write in one concise sentence.'

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: 'You are a text summarization assistant. Provide clear, accurate summaries.',
          },
          {
            role: 'user',
            content: `Summarize the following text in ${lengthInstruction}. ${styleInstruction}\n\nText:\n${text}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepSeek API error:', error)
      return NextResponse.json(
        { error: 'AI service error. Please try again later.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content || ''

    const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0

    return NextResponse.json({
      summary,
      wordCount,
      originalLength: text.length,
      length,
      style,
    })
  } catch (error) {
    console.error('Summarize error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    )
  }
}
