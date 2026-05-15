import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'JSON to YAML Converter', 'Convert between JSON and YAML formats online free. Perfect for Kubernetes, Docker, and configuration files. No sign-up required.', 'data-converter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
