'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type SourceType = 'book' | 'website' | 'article' | 'video'
type Style = 'mla' | 'apa' | 'chicago'

const sourceLabels: Record<SourceType, string> = {
  book: 'Book',
  website: 'Website',
  article: 'Journal Article',
  video: 'Video',
}

export default function CitationGeneratorPage() {
  const t = useTranslations('tools.citation-generator')
  const ct = useTranslations('common')

  const [sourceType, setSourceType] = useState<SourceType>('book')
  const [style, setStyle] = useState<Style>('mla')
  const [copied, setCopied] = useState('')

  // Book fields
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [publisher, setPublisher] = useState('')
  const [year, setYear] = useState('')
  const [city, setCity] = useState('')
  const [edition, setEdition] = useState('')
  const [pages, setPages] = useState('')

  // Website fields
  const [webAuthor, setWebAuthor] = useState('')
  const [webTitle, setWebTitle] = useState('')
  const [website, setWebsite] = useState('')
  const [url, setUrl] = useState('')
  const [accessDate, setAccessDate] = useState('')
  const [pubDate, setPubDate] = useState('')

  // Article fields
  const [artAuthor, setArtAuthor] = useState('')
  const [artTitle, setArtTitle] = useState('')
  const [journal, setJournal] = useState('')
  const [volume, setVolume] = useState('')
  const [issue, setIssue] = useState('')
  const [artYear, setArtYear] = useState('')
  const [artPages, setArtPages] = useState('')
  const [doi, setDoi] = useState('')

  // Video fields
  const [vidAuthor, setVidAuthor] = useState('')
  const [vidTitle, setVidTitle] = useState('')
  const [platform, setPlatform] = useState('')
  const [vidUrl, setVidUrl] = useState('')
  const [vidDate, setVidDate] = useState('')

  const generateCitations = (): string[] => {
    const results: string[] = []
    for (const s of [style]) {
      switch (sourceType) {
        case 'book': {
          const a = author || 'Author Last, First'
          const t = title || 'Book Title'
          const p = publisher || 'Publisher'
          const y = year || 'Year'
          if (s === 'mla') results.push(`${a}. <em>${t}</em>. ${p}, ${y}.`)
          else if (s === 'apa') results.push(`${a}. (${y}). <em>${t}</em>. ${p}.`)
          else results.push(`${a}. <em>${t}</em>. ${city || 'City'}: ${p}, ${y}.`)
          break
        }
        case 'website': {
          const a = webAuthor || 'Author'
          const t = webTitle || 'Page Title'
          const w = website || 'Website Name'
          const u = url || 'URL'
          const d = accessDate || 'Day Mon. Year'
          if (s === 'mla') results.push(`${a}. "${t}." <em>${w}</em>, ${pubDate || 'Date'}, ${u}. Accessed ${d}.`)
          else if (s === 'apa') results.push(`${a}. (${pubDate ? pubDate.split('-')[0] : 'n.d.'}). <em>${t}</em>. ${w}. ${u}`)
          else results.push(`${a}. "${t}." <em>${w}</em>. ${pubDate || 'n.d.'}. ${u} (accessed ${d}).`)
          break
        }
        case 'article': {
          const a = artAuthor || 'Author'
          const t = artTitle || 'Article Title'
          const j = journal || 'Journal Name'
          const v = volume || 'Vol.'
          const i = issue || 'No.'
          const y = artYear || 'Year'
          const p = artPages || 'Pages'
          if (s === 'mla') results.push(`${a}. "${t}." <em>${j}</em>, vol. ${v}, no. ${i}, ${y}, pp. ${p}.${doi ? ` ${doi}.` : ''}`)
          else if (s === 'apa') results.push(`${a}. (${y}). ${t}. <em>${j}, ${v}</em>(${i}), ${p}.${doi ? ` https://doi.org/${doi}` : ''}`)
          else results.push(`${a}. "${t}." <em>${j}</em> ${v}, no. ${i} (${y}): ${p}.${doi ? ` ${doi}.` : ''}`)
          break
        }
        case 'video': {
          const a = vidAuthor || 'Creator'
          const t = vidTitle || 'Video Title'
          const p = platform || 'Platform'
          const u = vidUrl || 'URL'
          const d = vidDate || 'Date'
          if (s === 'mla') results.push(`${a}. "${t}." <em>${p}</em>, ${d}, ${u}.`)
          else if (s === 'apa') results.push(`${a}. (${d}). <em>${t}</em> [Video]. ${p}. ${u}`)
          else results.push(`${a}. "${t}." ${p}. ${d}. ${u}.`)
          break
        }
      }
    }
    return results.filter(r => !r.includes('undefined'))
  }

  const citations = generateCitations()
  const citationText = citations.map(c => c.replace(/<em>|<\/em>/g, '')).join('\n')

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(text.slice(0, 20))
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      {/* Style + Type selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {(['mla', 'apa', 'chicago'] as Style[]).map(s => (
            <button key={s} onClick={() => setStyle(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${style === s ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'}`}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="w-px bg-gray-300 dark:bg-gray-600" />
        <div className="flex gap-2">
          {(Object.entries(sourceLabels) as [SourceType, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSourceType(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${sourceType === key ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-3">
          {sourceType === 'book' && (
            <>
              <Input label="Author" value={author} onChange={setAuthor} placeholder="Doe, John" />
              <Input label="Title" value={title} onChange={setTitle} placeholder="The Book Title" />
              <Input label="Publisher" value={publisher} onChange={setPublisher} placeholder="Penguin Books" />
              <div className="grid grid-cols-3 gap-2">
                <Input label="Year" value={year} onChange={setYear} placeholder="2024" />
                <Input label="City" value={city} onChange={setCity} placeholder="New York" />
                <Input label="Edition" value={edition} onChange={setEdition} placeholder="2nd" />
              </div>
              <Input label="Pages" value={pages} onChange={setPages} placeholder="1-100" />
            </>
          )}

          {sourceType === 'website' && (
            <>
              <Input label="Author" value={webAuthor} onChange={setWebAuthor} placeholder="Doe, John" />
              <Input label="Page Title" value={webTitle} onChange={setWebTitle} placeholder="Page Title" />
              <Input label="Website Name" value={website} onChange={setWebsite} placeholder="The New York Times" />
              <Input label="URL" value={url} onChange={setUrl} placeholder="https://..." />
              <Input label="Published Date" value={pubDate} onChange={setPubDate} placeholder="2024-01-15" />
              <Input label="Access Date" value={accessDate} onChange={setAccessDate} placeholder="15 Jan 2024" />
            </>
          )}

          {sourceType === 'article' && (
            <>
              <Input label="Author" value={artAuthor} onChange={setArtAuthor} placeholder="Doe, John" />
              <Input label="Article Title" value={artTitle} onChange={setArtTitle} placeholder="Article Title" />
              <Input label="Journal Name" value={journal} onChange={setJournal} placeholder="Journal of..." />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Volume" value={volume} onChange={setVolume} placeholder="15" />
                <Input label="Issue" value={issue} onChange={setIssue} placeholder="2" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input label="Year" value={artYear} onChange={setArtYear} placeholder="2024" />
                <Input label="Pages" value={artPages} onChange={setArtPages} placeholder="1-100" />
              </div>
              <Input label="DOI" value={doi} onChange={setDoi} placeholder="10.1234/..." />
            </>
          )}

          {sourceType === 'video' && (
            <>
              <Input label="Creator" value={vidAuthor} onChange={setVidAuthor} placeholder="Doe, John" />
              <Input label="Video Title" value={vidTitle} onChange={setVidTitle} placeholder="Video Title" />
              <Input label="Platform" value={platform} onChange={setPlatform} placeholder="YouTube" />
              <Input label="URL" value={vidUrl} onChange={setVidUrl} placeholder="https://..." />
              <Input label="Upload Date" value={vidDate} onChange={setVidDate} placeholder="2024-01-15" />
            </>
          )}

          <button onClick={() => {
            navigator.clipboard.writeText(citationText).catch(() => {})
            setCopied('all')
            setTimeout(() => setCopied(''), 1500)
          }} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Copy Citation{copied === 'all' ? ' ✓' : ''}
          </button>
        </div>

        {/* Output */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {style.toUpperCase()} Citation{sourceType !== 'book' ? ` (${sourceLabels[sourceType]})` : ''}
          </label>
          <div className="min-h-[300px] p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
            {citations[0] ? (
              <div
                className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: citations[0] }}
              />
            ) : (
              <p className="text-sm text-gray-400">Fill in the fields to generate a citation...</p>
            )}
          </div>
          {citations.length > 0 && (
            <div className="mt-3 space-y-2">
              {(['mla', 'apa', 'chicago'] as Style[]).map(s => (
                s !== style && (
                  <div key={s} className="flex items-center justify-between p-2 border rounded-lg text-sm">
                    <span className="text-xs text-gray-400 font-medium mr-2 shrink-0">{s.toUpperCase()}</span>
                    <span className="text-xs text-gray-500 truncate">
                      {generateCitations().join(' ').slice(0, 60)}...
                    </span>
                    <button onClick={() => handleCopy(generateCitations().join('\n'))}
                      className="text-xs text-blue-600 hover:underline shrink-0 ml-2">
                      {copied.startsWith(s) ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
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

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-0.5">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )
}
