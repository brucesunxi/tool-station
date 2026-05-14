import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Code Converter',
  description: 'Convert code between 19 programming languages including Python, JavaScript, Java, Go, Rust, and more. Preserves logic and structure. Free online tool.',
  keywords: ['code converter', 'AI code conversion', 'code translator', 'convert programming language'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
