import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'JSON to YAML Converter',
  description: 'Convert between JSON and YAML formats online free. Perfect for Kubernetes, Docker, and configuration files. No sign-up required.',
  keywords: ['JSON to YAML', 'YAML to JSON', 'data converter', 'config format converter'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
