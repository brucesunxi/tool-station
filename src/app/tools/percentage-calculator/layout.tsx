import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Percentage Calculator Free Online — Calculate Percentages Instantly',
  description: 'Free online percentage calculator. Find what is X% of Y, X is what percent of Y, and percentage increase/decrease. Fast and accurate calculations.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
