/**
 * FPO Dashboard Server Component
 *
 * Fetches member farmer lots from Supabase and passes them to the
 * FpoDashboardClient for interactive aggregation UI.
 */
import { FpoDashboardClient } from '@/components/dashboard/fpo-dashboard'
import { createClient } from '@/lib/supabase/server'
import type { CropLot } from '@/lib/types'

interface FpoDashboardServerProps {
  userId: string
  userName: string
}

export async function FpoDashboardServer({ userId, userName }: FpoDashboardServerProps) {
  const supabase = await createClient()

  // Fetch all lots from farmers associated with this FPO
  // In production, filter by fpo_id; for demo, fetch all non-buyer lots
  const { data: lots } = await supabase
    .from('crop_lots')
    .select('*')
    .order('created_at', { ascending: false })

  const cropLots = (lots ?? []) as CropLot[]

  return <FpoDashboardClient lots={cropLots} fpoName={userName} />
}
