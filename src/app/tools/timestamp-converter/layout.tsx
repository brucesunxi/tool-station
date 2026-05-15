import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Timestamp Converter Free Online — Unix Timestamp to Date',
  description: 'Free online timestamp converter. Convert Unix timestamps to human-readable dates and vice versa. Support for seconds, milliseconds, and multiple date formats.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
