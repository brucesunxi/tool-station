import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tip Calculator Free Online — Calculate Restaurant Tips & Split Bills',
  description: 'Free online tip calculator. Calculate tip amounts, total bill, and split between multiple people. Choose from common tip percentages or set your own.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
