'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

interface IpData {
  ip: string
  city: string
  region: string
  country_name: string
  country: string
  latitude: number
  longitude: number
  org: string
  postal: string
  timezone: string
  error?: boolean
}

export default function IpLookupPage() {
  const t = useTranslations('tools.ip-lookup')
  const ct = useTranslations('common')

  const [myIp, setMyIp] = useState('')
  const [myData, setMyData] = useState<IpData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [lookupIp, setLookupIp] = useState('')
  const [lookupData, setLookupData] = useState<IpData | null>(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch IP data')
        return r.json()
      })
      .then((data: IpData) => {
        setMyIp(data.ip)
        setMyData(data)
        setError('')
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Could not retrieve IP information. Please try again later.')
        }
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const handleLookup = useCallback(() => {
    const ip = lookupIp.trim()
    if (!ip) return
    setLookupLoading(true)
    setLookupError('')
    setLookupData(null)
    fetch(`https://ipapi.co/${ip}/json/`)
      .then((r) => {
        if (!r.ok) throw new Error('Invalid IP address or lookup failed')
        return r.json()
      })
      .then((data: IpData) => {
        if (data.error) throw new Error('Invalid IP address')
        setLookupData(data)
      })
      .catch((err) => {
        setLookupError(err.message || 'Lookup failed')
      })
      .finally(() => setLookupLoading(false))
  }, [lookupIp])

  const DataRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium">{value || '—'}</span>
    </div>
  )

  const IpCard = ({
    title,
    data,
    loading,
    errorMsg,
  }: {
    title: string
    data: IpData | null
    loading: boolean
    errorMsg: string
  }) => (
    <div className="bg-white dark:bg-gray-800 border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : errorMsg ? (
        <p className="text-red-500 text-sm">{errorMsg}</p>
      ) : data ? (
        <div>
          <div className="mb-4">
            <span className="text-2xl font-bold font-mono">{data.ip}</span>
          </div>
          <DataRow label="Country" value={data.country_name || data.country} />
          <DataRow label="Region" value={data.region} />
          <DataRow label="City" value={data.city} />
          <DataRow label="Postal Code" value={data.postal} />
          <DataRow label="Latitude" value={data.latitude} />
          <DataRow label="Longitude" value={data.longitude} />
          <DataRow label="ISP" value={data.org} />
          <DataRow label="Timezone" value={data.timezone} />
          {data.latitude && data.longitude && (
            <div className="mt-4">
              <a
                href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View on Google Maps &rarr;
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      )}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Free IP address lookup tool. Find your public IP address, location, ISP, and more details. Look
        up any IP address for geolocation information.
      </p>

      <AdBanner className="mb-8 h-20" />

      <div className="space-y-6 mb-8">
        {/* My IP */}
        <IpCard
          title={myIp ? `Your IP: ${myIp}` : 'Your IP Address'}
          data={myData}
          loading={loading}
          errorMsg={error}
        />

        {/* Lookup */}
        <div className="bg-white dark:bg-gray-800 border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Look Up Another IP Address</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={lookupIp}
              onChange={(e) => setLookupIp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLookup}
              disabled={lookupLoading || !lookupIp.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {lookupLoading ? 'Loading...' : 'Lookup'}
            </button>
          </div>
          {lookupError && <p className="text-red-500 text-sm mt-2">{lookupError}</p>}
          {lookupData && (
            <div className="mt-4">
              <DataRow label="IP" value={lookupData.ip} />
              <DataRow label="Country" value={lookupData.country_name || lookupData.country} />
              <DataRow label="Region" value={lookupData.region} />
              <DataRow label="City" value={lookupData.city} />
              <DataRow label="ISP" value={lookupData.org} />
              <DataRow label="Latitude" value={lookupData.latitude} />
              <DataRow label="Longitude" value={lookupData.longitude} />
              <DataRow label="Timezone" value={lookupData.timezone} />
            </div>
          )}
        </div>
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>{t('howto.heading')}</h2>
        <ol>
          {(t.raw('howto.steps') as string[]).map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>

        <h2>{t('tips.heading')}</h2>
        <ul>
          {(t.raw('tips.items') as string[]).map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t('faq.heading')}</h2>
        <div className="space-y-4">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
