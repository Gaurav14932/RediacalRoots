import { BuyerDashboardView } from '@/components/dashboard/buyer-dashboard-view'
import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/lib/types'

export async function BuyerDashboard({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, lot:crop_lots(id, crop_type, unit, location, farmer_id)')
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false })
    .limit(6)

  const recentOrders = (orders ?? []) as Order[]
  const totalSpend = recentOrders.reduce(
    (sum, order) => sum + order.price_agreed * order.quantity,
    0,
  )

  return (
    <BuyerDashboardView
      recentOrders={recentOrders}
      totalSpend={totalSpend}
    />
  )
}
