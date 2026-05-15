import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'IP Address Lookup Free Online — Find My IP & Location', 'Free IP address lookup tool. Find your public IP address, location, ISP, and more details. Look up any IP address for geolocation information.', 'ip-lookup')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
