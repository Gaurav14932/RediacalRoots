import { CropFilter } from '@/components/marketplace/crop-filter'
import { CropLotCard } from '@/components/marketplace/crop-lot-card'
import { EmptyLotsState } from '@/components/marketplace/empty-lots-state'
import { MarketplaceHeader } from '@/components/marketplace/marketplace-header'
import { SiteHeader } from '@/components/site-header'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import type { CropLot, CropType } from '@/lib/types'
import { Store } from 'lucide-react'
import { Suspense } from 'react'

async function MarketplaceGrid({ crop }: { crop?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('crop_lots')
    .select('*')
    .in('status', ['listed', 'under_verification', 'verified'])
    .order('created_at', { ascending: false })

  if (crop) {
    query = query.eq('crop_type', crop as CropType)
  }

  const { data: lots } = await query
  const cropLots = (lots ?? []) as CropLot[]

  if (cropLots.length === 0) {
    return <EmptyLotsState />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cropLots.map((lot) => (
        <CropLotCard key={lot.id} lot={lot} />
      ))}
    </div>
  )
}

function MarketplaceGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-border/60 animate-pulse">
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-5 w-28 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted/60 rounded" />
              </div>
              <div className="h-6 w-16 bg-muted rounded-full" />
            </div>
            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <div className="h-4 w-32 bg-muted/60 rounded" />
              <div className="h-4 w-24 bg-muted/60 rounded" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 w-24 bg-muted rounded" />
              <div className="h-8 w-20 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ crop?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <MarketplaceHeader />
        <div className="mb-6">
          <Suspense fallback={<div className="h-9 w-full bg-muted/40 animate-pulse rounded-lg" />}>
            <CropFilter />
          </Suspense>
        </div>
        <Suspense fallback={<MarketplaceGridSkeleton />}>
          <MarketplaceGrid crop={params.crop} />
        </Suspense>
      </main>
    </div>
  )
}
