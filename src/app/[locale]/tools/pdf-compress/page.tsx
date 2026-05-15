'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { formatFileSize } from '@/lib/utils'
import AdBanner from '@/components/AdBanner'

export default function PdfCompressPage() {
  const t = useTranslations('tools.pdf-compress')
  const ct = useTranslations('common')

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ dataUrl: string; originalSize: number; compressedSize: number; ratio: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (f: File) => {
    setError(null); setResult(null)
    if (!f.name.toLowerCase().endsWith('.pdf')) { setError(ct("selectPdfFile")); return }
    if (f.size > 50 * 1024 * 1024) { setError(ct("fileMustBeUnder", { size: "50MB" })); return }
    setFile(f)
  }

  const handleCompress = async () => {
    if (!file) return
    setLoading(true); setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/pdf-compress', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || ct("compressionFailed"))
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : ct("compressionFailed"))
    } finally { setLoading(false) }
  }

  const handleReset = () => { setFile(null); setResult(null); setError(null) }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      {!file && !result && (
        <div className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]) }}
          onClick={() => {
            const el = document.createElement('input')
            el.type = 'file'; el.accept = '.pdf'; el.onchange = () => el.files?.[0] && handleFile(el.files[0]); el.click()
          }}>
          <p className="text-2xl mb-2">📄</p>
          <p className="font-medium">{ct("dropFileHere")}</p>
          <p className="text-sm text-gray-400 mt-1">{ct("maxFileSize", { size: "50MB" })}</p>
        </div>
      )}

      {file && !result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800">
            <span className="text-xl">📄</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{file.name}</p>
              <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
            </div>
            <button onClick={handleReset} className="text-gray-400 hover:text-red-500">✕</button>
          </div>
          <button onClick={handleCompress} disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? ct("compressing") : ct('compressPdf')}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl text-center">
            <p className="text-4xl mb-2">✅</p>
            <p className="text-xl font-bold mb-1">{ct("compressed")}</p>
            <p className="text-sm text-gray-500">
              {formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)}
              <span className="ml-2 text-green-600 font-semibold">-{result.ratio}%</span>
            </p>
          </div>
          <div className="flex gap-3">
            <a href={result.dataUrl} download={file?.name?.replace(/\.pdf$/i, '') + '-compressed.pdf'}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center transition-colors">
              Download ({formatFileSize(result.compressedSize)})
            </a>
            <button onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{ct("compressAnother")}</button>
          </div>
        </div>
      )}

      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
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
