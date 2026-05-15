import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Age Calculator Free Online — Calculate Exact Age',
  description: 'Free online age calculator. Calculate your exact age in years, months, and days. Find out how many days until your next birthday.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
