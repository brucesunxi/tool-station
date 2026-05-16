'use client'

import { useState } from 'react'

interface ShareButtonProps {
  title: string
  url?: string
  description?: string
}

const platforms = [
  {
    id: 'twitter', name: 'Twitter / X',
    icon: <span className="text-base leading-none">𝕏</span>,
    color: 'hover:bg-black/5 dark:hover:bg-white/10',
    url: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
  },
  {
    id: 'facebook', name: 'Facebook',
    icon: <span className="text-base font-bold text-blue-600 leading-none">f</span>,
    color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    url: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  },
  {
    id: 'linkedin', name: 'LinkedIn',
    icon: <svg className="w-4 h-4 text-blue-700" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
    color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    url: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  },
  {
    id: 'whatsapp', name: 'WhatsApp',
    icon: <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
    color: 'hover:bg-green-50 dark:hover:bg-green-900/20',
    url: (u: string, t: string) => `https://wa.me/?text=${t}%20${u}`,
  },
  {
    id: 'telegram', name: 'Telegram',
    icon: <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>,
    color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    url: (u: string, t: string) => `https://t.me/share/url?url=${u}&text=${t}`,
  },
  {
    id: 'reddit', name: 'Reddit',
    icon: <svg className="w-4 h-4 text-orange-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.633 4.692 1.597.357-.307.82-.504 1.33-.504a1.95 1.95 0 011.95 1.95 1.95 1.95 0 01-1.95 1.95c-.389 0-.745-.114-1.048-.307-1.028.864-2.454 1.444-4.108 1.558l-.899 4.184 3.02.92c.197-.767.883-1.331 1.703-1.331a1.84 1.84 0 011.84 1.84 1.84 1.84 0 01-1.84 1.84c-.736 0-1.364-.432-1.629-1.055l-3.237-.987a.413.413 0 01-.304-.443l.958-4.463c-1.579-.137-2.926-.697-3.908-1.512-.29.18-.629.285-1.003.285a1.95 1.95 0 01-1.95-1.95 1.95 1.95 0 011.95-1.95c.513 0 .99.215 1.345.568 1.16-.93 2.756-1.475 4.517-1.557l1.136-5.058a.412.412 0 01.483-.311l3.573.652c.089-.46.494-.808.977-.808z" /></svg>,
    color: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
    url: (u: string, t: string) => `https://reddit.com/submit?url=${u}&title=${t}`,
  },
  {
    id: 'email', name: 'Email',
    icon: <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    color: 'hover:bg-gray-50 dark:hover:bg-gray-700',
    url: (u: string, t: string, d?: string) => `mailto:?subject=${t}&body=${d ? d + '%0A%0A' : ''}${u}`,
  },
]

export default function ShareButton({ title, url, description }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url: shareUrl })
        return
      } catch { /* user cancelled */ }
    }
    setOpen(!open)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  const shareTo = (platform: (typeof platforms)[0]) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)
    const encodedDesc = description ? encodeURIComponent(description) : undefined
    const url = platform.url(encodedUrl, encodedTitle, encodedDesc)
    window.open(url, '_blank', 'noopener')
    setOpen(false)
  }

  return (
    <div className="relative">
      <button onClick={handleShare}
        className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        title="Share">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 border rounded-xl shadow-lg p-3 min-w-[220px]">
            {/* Copy Link */}
            <button onClick={copyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-1">
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-600 font-medium">Link Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <div className="border-t my-1.5" />

            {/* Social Grid */}
            <div className="grid grid-cols-2 gap-1">
              {platforms.map((p) => (
                <button key={p.id} onClick={() => shareTo(p)}
                  className={`flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg transition-colors ${p.color}`}>
                  <span className="shrink-0">{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
