import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Code Beautifier',
  description: 'Format and beautify HTML, CSS, and JavaScript code online free. Minify for production. No sign-up required. All processing in your browser.',
  keywords: ['code beautifier', 'code formatter', 'HTML beautifier', 'CSS formatter', 'JavaScript formatter'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
