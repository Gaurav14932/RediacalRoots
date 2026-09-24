import { LogisticsDashboard } from '@/components/logistics/logistics-dashboard'
import { LogisticsPageHeader } from '@/components/logistics/logistics-page-header'
import { SiteHeader } from '@/components/site-header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LogisticsPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect('/auth/login?redirect=/logistics')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle()

  const userRole = profile?.role ?? userData.user.user_metadata?.role
  if (userRole !== 'logistics') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <LogisticsPageHeader />
        <LogisticsDashboard />
      </main>
    </div>
  )
}
