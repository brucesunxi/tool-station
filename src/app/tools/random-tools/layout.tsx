import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Random Tools',
  description: 'Random tools collection: random number generator, dice roller, coin flip, lottery picker, and decision maker. All free, no sign-up.',
  keywords: ['random number generator', 'dice roller', 'coin flip', 'random tools', 'decision maker'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
