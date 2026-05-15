'use client'

import { useState, useRef, useEffect } from 'react'
import AdBanner from '@/components/AdBanner'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const welcomeMessage = "Hi! I'm your AI assistant. I can help with writing, coding, analysis, research, and more. What can I help you with today?"

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: welcomeMessage },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setError(null)

    const userMessage: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Chat failed')
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Chat failed'
      setError(msg)
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${msg}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([{ role: 'assistant', content: welcomeMessage }])
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
        <p className="text-gray-500">Chat with AI for writing, coding, analysis, and more. Get instant help with any task.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Chat Container */}
      <div className="border rounded-xl dark:border-gray-700 overflow-hidden">
        {/* Messages */}
        <div className="h-[480px] overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/30">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border dark:border-gray-700'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything... (Enter to send, Shift+Enter for new line)"
              rows={2}
              className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600"
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0 self-end">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {messages.filter(m => m.role === 'user').length} messages
            </span>
            <button onClick={handleClear}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear chat</button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Chat Assistant</h2>
        <ol>
          <li>Type your question or request in the chat input field at the bottom of the chat container.</li>
          <li>Press Enter to send your message (use Shift+Enter for a new line).</li>
          <li>Read the AI&apos;s response, then ask follow-up questions to refine the answer.</li>
          <li>Use the &quot;Clear chat&quot; button to start a fresh conversation at any time.</li>
          <li>Review your message count to track your conversation history.</li>
        </ol>

        <h2>Tips for Getting the Best Responses</h2>
        <ul>
          <li>Be specific in your questions &mdash; instead of &quot;write code,&quot; try &quot;write a Python function to sort a list of dictionaries by a key.&quot;</li>
          <li>Use follow-up questions to refine answers. The AI remembers the conversation context.</li>
          <li>For complex tasks, break them into smaller steps and ask one at a time for more thorough responses.</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">What can the AI assistant help me with?</h3><p>The AI assistant can help with writing, coding, analysis, research, brainstorming, problem-solving, creative tasks, and general questions. It is a versatile tool for almost any task.</p></div>
          <div><h3 className="font-semibold">Does the AI assistant remember previous messages?</h3><p>Yes, the assistant maintains the conversation context within a single chat session, so it remembers what you discussed earlier in the conversation.</p></div>
          <div><h3 className="font-semibold">Is there a limit to how many messages I can send?</h3><p>No, there are no message limits. The AI assistant is completely free to use for unlimited conversations.</p></div>
        </div>
      </section>
    </div>
  )
}
