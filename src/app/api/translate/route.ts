import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang = 'auto', targetLang = 'en' } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide text to translate' }, { status: 400 })
    }
    if (text.length > 10000) {
      return NextResponse.json({ error: 'Text must be under 10,000 characters' }, { status: 400 })
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY not configured.' },
        { status: 500 }
      )
    }

    const languageNames: Record<string, string> = {
      auto: 'auto-detect', en: 'English', zh: 'Chinese', ja: 'Japanese',
      ko: 'Korean', fr: 'French', de: 'German', es: 'Spanish',
      pt: 'Portuguese', ru: 'Russian', ar: 'Arabic', hi: 'Hindi',
      it: 'Italian', nl: 'Dutch', pl: 'Polish', tr: 'Turkish',
      vi: 'Vietnamese', th: 'Thai', id: 'Indonesian',
    }

    const sourceLabel = languageNames[sourceLang] || sourceLang
    const targetLabel = languageNames[targetLang] || targetLang
    const detectInstruction = sourceLang === 'auto'
      ? 'First detect the source language, then translate to ' + targetLabel + '.'
      : `Translate from ${sourceLabel} to ${targetLabel}.`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    let response
    try {
      response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 4096,
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator. Translate accurately and naturally. Preserve the original formatting, including line breaks and paragraphs. Output ONLY the translation, no explanations or notes.',
            },
            {
              role: 'user',
              content: `${detectInstruction}\n\nText:\n${text}`,
            },
          ],
        }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `AI service returned status ${response.status}.` },
        { status: 502 }
      )
    }

    const data = await response.json()
    const translatedText = (data.choices?.[0]?.message?.content || '').trim()

    return NextResponse.json({ translatedText })
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return NextResponse.json({ error: 'Translation timed out. Try shorter text.' }, { status: 504 })
    }
    return NextResponse.json({ error: `Translation failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}

export const maxDuration = 30
