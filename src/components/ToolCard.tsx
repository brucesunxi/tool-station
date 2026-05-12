import Link from 'next/link'

interface ToolCardProps {
  title: string
  description: string
  icon: string
  href: string
  isNew?: boolean
  isPremium?: boolean
}

export default function ToolCard({ title, description, icon, href, isNew, isPremium }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group relative p-6 bg-white dark:bg-gray-800 rounded-xl border hover:border-blue-500 hover:shadow-md transition-all duration-200"
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
          NEW
        </span>
      )}
      {isPremium && (
        <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
          PRO
        </span>
      )}
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </Link>
  )
}
