'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

interface PdfMetadata {
  title: string
  author: string
  subject: string
  keywords: string
  producer: string
  creator: string
  creationDate: string
  modificationDate: string
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A'
  try {
    const date = new Date(dateStr)
    return date.toLocaleString()
  } catch {
    return dateStr
  }
}

export default function PdfMetadataPage() {
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pageCount, setPageCount] = useState(0)

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || f.type !== 'application/pdf') {
      setError('Please select a valid PDF file.')
      return
    }
    setError('')
    setMetadata(null)
    setFile(f)
    setLoading(true)

    try {
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

      const buffer = await f.arrayBuffer()
      const pdfDoc = await pdfjs.getDocument({ data: buffer }).promise
      const meta = await pdfDoc.getMetadata()

      setPageCount(pdfDoc.numPages)

      const info = meta.info || {}
      setMetadata({
        title: (info as Record<string, string>).Title || 'N/A',
        author: (info as Record<string, string>).Author || 'N/A',
        subject: (info as Record<string, string>).Subject || 'N/A',
        keywords: (info as Record<string, string>).Keywords || 'N/A',
        producer: (info as Record<string, string>).Producer || 'N/A',
        creator: (info as Record<string, string>).Creator || 'N/A',
        creationDate: formatDate((info as Record<string, string>).CreationDate || null),
        modificationDate: formatDate((info as Record<string, string>).ModDate || null),
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to read PDF metadata: ${msg}`)
    }
    setLoading(false)
  }, [])

  const metadataRows = metadata
    ? [
        { label: 'Title', value: metadata.title },
        { label: 'Author', value: metadata.author },
        { label: 'Subject', value: metadata.subject },
        { label: 'Keywords', value: metadata.keywords },
        { label: 'Producer', value: metadata.producer },
        { label: 'Creator', value: metadata.creator },
        { label: 'Creation Date', value: metadata.creationDate },
        { label: 'Modification Date', value: metadata.modificationDate },
        { label: 'Pages', value: String(pageCount) },
      ]
    : []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">PDF Metadata Viewer</h1>
      <p className="text-gray-500 mb-6">
        View PDF document properties including title, author, subject, and creation date.
      </p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300 hover:file:bg-blue-100"
          />
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Reading PDF metadata...</p>
          </div>
        )}

        {metadata && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Property
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {metadataRows.map((row) => (
                  <tr key={row.label} className="border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {row.label}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 break-all">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!file && !loading && !metadata && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Upload a PDF to view its metadata</p>
          </div>
        )}

        {file && !loading && !metadata && !error && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Ready to read metadata from <strong>{file.name}</strong></p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Upload a PDF file using the file picker.</li>
          <li>The tool automatically reads and displays all available metadata from the PDF.</li>
          <li>View properties including title, author, subject, keywords, and creation dates.</li>
          <li>Use the information to verify document details or organize your PDF collection.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Not all PDFs contain complete metadata — some fields may show &quot;N/A&quot; if the document creator did not fill them in.</li>
          <li>Creation and modification dates are displayed in your local timezone for easy reference.</li>
          <li>Use metadata to identify the source application or PDF producer that generated the document.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">What metadata can this tool extract?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The tool extracts all standard PDF document information dictionary fields: Title, Author, Subject, Keywords, Producer (the application that created the PDF), Creator (the original document application), Creation Date, and Modification Date. It also shows the total page count.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I edit the metadata with this tool?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No, this tool is read-only. It displays the existing metadata embedded in the PDF file but does not provide editing capabilities. You would need a dedicated PDF editor to modify metadata fields.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Why can&apos;t I see metadata for some PDFs?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Some PDFs, especially those created by certain applications or scanners, may have minimal or no metadata embedded. Additionally, encrypted or password-protected PDFs may not expose their metadata until decrypted. This is normal and depends on how the PDF was originally created.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
