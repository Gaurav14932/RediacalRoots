import { FarmerDashboard } from '@/components/dashboard/farmer-dashboard'
import { BuyerDashboard } from '@/components/dashboard/buyer-dashboard'
import { FpoDashboardServer } from '@/components/dashboard/fpo-dashboard-server'
import { LogisticsDashboard } from '@/components/logistics/logistics-dashboard'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SiteHeader } from '@/components/site-header'
import { ROLE_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect('/auth/login?redirect=/dashboard')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', userData.user.id)
    .maybeSingle()

  const role = (profile?.role ?? 'buyer') as UserRole

  if (role === 'admin') {
    redirect('/admin')
  }
  if (role === 'inspector') {
    redirect('/inspector')
  }

  function getSubtitle() {
    if (role === 'farmer') return 'Manage your crop listings, track orders, and see price insights.'
    if (role === 'buyer') return 'Track your orders and discover fresh crop lots.'
    if (role === 'fpo') return 'Aggregate member farmer lots and create buyer-ready listings.'
    if (role === 'logistics') return 'Manage delivery runs and update stop statuses.'
    return `Signed in as ${ROLE_LABELS[role]}.`
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <DashboardHeader role={role} userName={profile?.name} />

        {role === 'farmer' && <FarmerDashboard userId={userData.user.id} />}
        {role === 'buyer' && <BuyerDashboard userId={userData.user.id} />}
        {role === 'fpo' && <FpoDashboardServer userId={userData.user.id} userName={profile?.name ?? 'FPO Manager'} />}
        {role === 'logistics' && <LogisticsDashboard />}
        {role !== 'farmer' && role !== 'buyer' && role !== 'fpo' && role !== 'logistics' && (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="font-medium text-foreground">{ROLE_LABELS[role]} tools are coming soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Head to the marketplace to see live crop listings in the meantime.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
