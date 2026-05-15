import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Code Converter', 'Convert code between 19 programming languages including Python, JavaScript, Java, Go, Rust, and more. Preserves logic and structure. Free online tool.', 'ai-code-convert')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
