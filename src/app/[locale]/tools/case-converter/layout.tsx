import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Case Converter', 'Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more. 11 case formats. Free online tool.', 'case-converter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
