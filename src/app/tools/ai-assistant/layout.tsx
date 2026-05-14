import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Chat Assistant',
  description: 'Chat with AI for writing, coding, analysis, and research. Free online AI assistant — no sign-up required. Ask anything and get instant answers.',
  keywords: ['AI chat', 'online AI assistant', 'chatbot', 'AI chatbot free'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
