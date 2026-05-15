import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IP Address Lookup Free Online — Find My IP & Location',
  description:
    'Free IP address lookup tool. Find your public IP address, location, ISP, and more details. Look up any IP address for geolocation information.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
