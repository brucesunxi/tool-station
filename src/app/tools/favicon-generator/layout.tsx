import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favicon Generator Free Online — Create Favicons From Images',
  description: 'Free online favicon generator. Upload any image and generate favicons at all standard sizes. Preview how your favicon will look at 16x16, 32x32, 48x48 and more.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
