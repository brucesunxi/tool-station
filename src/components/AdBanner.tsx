'use client'

export default function AdBanner({ className = '' }: { className?: string }) {
  // Placeholder for Google AdSense. Replace the div below with actual ad code
  // after getting AdSense approval.
  return (
    <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm ${className}`}>
      <div className="text-center p-4">
        <p className="text-xs uppercase tracking-wider mb-1">Advertisement</p>
        <p>Ad Space &mdash; 728x90</p>
      </div>
    </div>
  )
}
