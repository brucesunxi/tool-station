import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Loan Calculator', 'Calculate loan payments, total interest, and amortization schedules online free. Also includes compound interest calculator for investment growth.', 'loan-calculator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
