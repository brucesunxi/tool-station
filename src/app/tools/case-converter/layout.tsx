import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Case Converter',
  description: 'Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more. 11 case formats. Free online tool.',
  keywords: ['case converter', 'text case converter', 'uppercase to lowercase', 'camelCase converter'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
