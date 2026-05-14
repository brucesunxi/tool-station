import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Generate strong, secure passwords online free. Customize length, character types, and strength requirements. Password strength indicator included.',
  keywords: ['password generator', 'password creator', 'strong password', 'secure password generator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
