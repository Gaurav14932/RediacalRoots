import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { SiteHeader } from '@/components/site-header'
import { mockStore } from '@/lib/mock-store'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect('/auth/login?redirect=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle()

  const userRole = profile?.role ?? userData.user.user_metadata?.role
  if (userRole !== 'admin') {
    redirect('/dashboard')
  }

  // Load datasets
  const lots = mockStore.getLots()
  const orders = mockStore.getOrders()
  const profiles = mockStore.getProfiles()
  const inspections = mockStore.getInspections()
  const feedbacks = mockStore.getFeedback()

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader />

        <AdminDashboard
          lots={lots}
          orders={orders}
          profiles={profiles}
          inspections={inspections}
          feedbacks={feedbacks}
        />
      </main>
    </div>
  )
}
