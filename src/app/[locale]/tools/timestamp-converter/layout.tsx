import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Timestamp Converter Free Online — Unix Timestamp to Date', 'Free online timestamp converter. Convert Unix timestamps to human-readable dates and vice versa. Support for seconds, milliseconds, and multiple date formats.', 'timestamp-converter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
