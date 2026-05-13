import Link from 'next/link'

interface ToolCardProps {
  title: string
  description: string
  icon: string
  href: string
  isNew?: boolean
  category?: string
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  image: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-300' },
  pdf: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-300' },
  ai: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-300' },
  dev: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-300' },
  text: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-300' },
  color: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-300' },
}

export default function ToolCard({ title, description, icon, href, isNew, category = 'dev' }: ToolCardProps) {
  const colors = categoryColors[category] || categoryColors.dev

  return (
    <Link
      href={href}
      className="group relative flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border hover:border-blue-400 hover:shadow-md transition-all duration-200"
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-sm z-10">
          NEW
        </span>
      )}
      <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center text-lg shrink-0 ${colors.text}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5 line-clamp-2">{description}</p>
      </div>
    </Link>
  )
}
