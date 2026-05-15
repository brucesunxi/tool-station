import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'URL Encoder & Decoder', 'Encode and decode URLs and query parameters online free. Percent-encoding for special characters. No sign-up required.', 'url-encode')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
