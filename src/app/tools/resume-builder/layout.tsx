import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Resume Builder',
  description: 'Build a professional resume online for free. Add experience, education, and skills. Download as PDF with print-ready formatting. No sign-up required.',
  keywords: ['resume builder', 'free resume builder', 'online resume maker', 'create resume PDF'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
