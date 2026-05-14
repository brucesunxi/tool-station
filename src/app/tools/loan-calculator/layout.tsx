import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Loan Calculator',
  description: 'Calculate loan payments, total interest, and amortization schedules online free. Also includes compound interest calculator for investment growth.',
  keywords: ['loan calculator', 'amortization calculator', 'mortgage calculator', 'compound interest calculator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
