import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav user={user} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}
