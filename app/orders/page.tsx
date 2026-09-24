import { OrdersClientView } from '@/components/orders/orders-client-view'
import { SiteHeader } from '@/components/site-header'
import { createClient } from '@/lib/supabase/server'
import type { Order, UserRole } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect('/auth/login?redirect=/orders')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', userData.user.id)
    .maybeSingle()

  const role = (profile?.role ?? 'buyer') as UserRole

  const query = supabase
    .from('orders')
    .select(
      '*, lot:crop_lots(id, crop_type, unit, location, farmer_id), buyer:profiles!orders_buyer_id_fkey(id, name)',
    )
    .order('created_at', { ascending: false })

  const { data: orders } =
    role === 'farmer'
      ? await query.eq('lot.farmer_id', userData.user.id)
      : await query.eq('buyer_id', userData.user.id)

  const allOrders = (orders ?? []) as Order[]

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <OrdersClientView
          allOrders={allOrders}
          role={role}
          buyerName={profile?.name ?? 'Verified Buyer'}
        />
      </main>
    </div>
  )
}
