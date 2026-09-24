import { LotDetailView } from '@/components/marketplace/lot-detail-view'
import { SiteHeader } from '@/components/site-header'
import { createClient } from '@/lib/supabase/server'
import { mockStore } from '@/lib/mock-store'
import type { AggregatedLotContribution, CropLot } from '@/lib/types'
import { notFound } from 'next/navigation'

export default async function CropLotPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const ratingStats = mockStore.getLotRatingStats(id)

  const { data: userData } = await supabase.auth.getUser()

  const { data: lot } = await supabase
    .from('crop_lots')
    .select('*, farmer:profiles!crop_lots_farmer_id_fkey(id, name, location, phone)')
    .eq('id', id)
    .maybeSingle()

  if (!lot) {
    notFound()
  }

  const cropLot = lot as CropLot

  // Fetch traceability contributions for aggregated lots
  let contributions: AggregatedLotContribution[] = []
  if (cropLot.is_aggregated) {
    try {
      const { data: contribs } = await supabase
        .from('aggregated_lot_contributions')
        .select('*, farmer:profiles!aggregated_lot_contributions_farmer_id_fkey(name, location)')
        .eq('aggregated_lot_id', id)

      if (contribs && contribs.length > 0) {
        contributions = (contribs as Array<Record<string, unknown>>).map((c) => ({
          id: (c.id as string) ?? '',
          aggregated_lot_id: (c.aggregated_lot_id as string) ?? id,
          original_lot_id: (c.original_lot_id as string) ?? '',
          farmer_id: (c.farmer_id as string) ?? '',
          farmer_name: ((c.farmer as { name?: string })?.name ?? c.farmer_name ?? 'Farmer') as string,
          location: ((c.farmer as { location?: string })?.location ?? c.location ?? '') as string,
          quantity: Number(c.quantity),
          unit: (c.unit as string) ?? 'quintal',
          grade: (c.grade as import('@/lib/types').Grade) ?? null,
          created_at: (c.created_at as string) ?? new Date().toISOString(),
        }))
      }
    } catch {
      // aggregated_lot_contributions table may not exist in all environments
    }

    // Fallback: generate mock contributions from child lots
    if (contributions.length === 0) {
      const { data: childLots } = await supabase
        .from('crop_lots')
        .select('id, farmer_id, quantity, unit, location, final_grade, ai_prescreen_grade, farmer:profiles!crop_lots_farmer_id_fkey(name, location)')
        .eq('parent_lot_id', id)

      if (childLots && childLots.length > 0) {
        contributions = (childLots as Array<Record<string, unknown>>).map((cl, i: number) => ({
          id: `contrib-${i}`,
          aggregated_lot_id: id,
          original_lot_id: cl.id as string,
          farmer_id: cl.farmer_id as string,
          farmer_name: (cl.farmer as { name: string } | null)?.name ?? 'Farmer',
          location: (cl.farmer as { location: string } | null)?.location ?? (cl.location as string),
          quantity: Number(cl.quantity),
          unit: cl.unit as string,
          grade: (cl.final_grade ?? cl.ai_prescreen_grade ?? null) as import('@/lib/types').Grade | null,
          created_at: new Date().toISOString(),
        }))
      }
    }

    if (contributions.length === 0) {
      contributions = mockStore.getContributions(id)
    }
  }

  const currentUserId = userData.user?.id ?? null

  let userRole: import('@/lib/types').UserRole | null = null
  if (userData.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .maybeSingle()
    userRole = (profile?.role as import('@/lib/types').UserRole) ?? (userData.user.user_metadata?.role as import('@/lib/types').UserRole) ?? null
  }

  // Server-side PII protection:
  // Restrict PII: a buyer's name/contact and order/bid history must be visible solely to
  // that buyer, the farmer they ordered from, and Admin — not to other farmers or other buyers.
  const sanitizedReviews = ratingStats.reviews.map((rev) => {
    const canViewBuyerPII =
      userRole === 'admin' ||
      (Boolean(currentUserId) && (currentUserId === rev.buyer_id || currentUserId === cropLot.farmer_id))

    return {
      ...rev,
      buyer_name: canViewBuyerPII ? rev.buyer_name : 'Verified Buyer',
    }
  })

  const sanitizedRatingStats = {
    ...ratingStats,
    reviews: sanitizedReviews,
  }

  const farmerCount = contributions.length > 0
    ? contributions.length
    : cropLot.contributing_lots_count ?? null

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <LotDetailView
          cropLot={cropLot}
          contributions={contributions}
          farmerCount={farmerCount}
          ratingStats={sanitizedRatingStats}
          currentUserId={currentUserId}
          isSignedIn={!!userData.user}
        />
      </main>
    </div>
  )
}
