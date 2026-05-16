import ToolActionBar from '@/components/ToolActionBar'

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolActionBar />
      {children}
    </>
  )
}
