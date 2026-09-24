import { FarmerDashboardView } from '@/components/dashboard/farmer-dashboard-view'
import { createClient } from '@/lib/supabase/server'
import { mockStore } from '@/lib/mock-store'
import type { CropLot, CropType, Order } from '@/lib/types'

export async function FarmerDashboard({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: lots } = await supabase
    .from('crop_lots')
    .select('*')
    .eq('farmer_id', userId)
    .order('created_at', { ascending: false })

  const cropLots = (lots ?? []) as CropLot[]

  const { data: orders } = await supabase
    .from('orders')
    .select('*, lot:crop_lots!inner(id, farmer_id, crop_type, unit, location)')
    .eq('lot.farmer_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  const recentOrders = (orders ?? []) as Order[]

  // Most common active crop for mandi price widget
  const activeLots = cropLots.filter((l) => ['listed', 'verified'].includes(l.status))
  const primaryCrop: CropType = activeLots.length > 0 ? activeLots[0].crop_type : 'soybean'

  // Buyer ratings and feedback
  const feedbackStats = mockStore.getSellerRatingStats(userId)

  return (
    <FarmerDashboardView
      cropLots={cropLots}
      recentOrders={recentOrders}
      feedbackStats={feedbackStats}
      primaryCrop={primaryCrop}
    />
  )
}
