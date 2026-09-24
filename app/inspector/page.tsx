import { InspectorDashboard } from '@/components/inspector/inspector-dashboard'
import { InspectorPageHeader } from '@/components/inspector/inspector-page-header'
import { SiteHeader } from '@/components/site-header'
import { mockStore } from '@/lib/mock-store'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function InspectorPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect('/auth/login?redirect=/inspector')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', userData.user.id)
    .maybeSingle()

  const userRole = profile?.role ?? userData.user.user_metadata?.role
  if (userRole !== 'inspector') {
    redirect('/dashboard')
  }

  const allLots = mockStore.getLots()
  const pendingLots = allLots.filter((l) =>
    ['under_verification', 'listed'].includes(l.status) && !l.final_grade,
  )
  const inspections = mockStore.getInspections()

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <InspectorPageHeader />

        <InspectorDashboard
          pendingLots={pendingLots}
          inspections={inspections}
          inspectorName={profile?.name ?? 'Dr. Arun Joshi (APMC Inspector)'}
          inspectorId={userData.user.id}
        />
      </main>
    </div>
  )
}
