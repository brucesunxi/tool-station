import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Email Generator',
  description: 'Generate professional emails with AI. Choose from 8 scenarios: inquiry, complaint, follow-up, thank you, proposal, and more. Free online tool.',
  keywords: ['AI email generator', 'email writer', 'professional email', 'business email template'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
