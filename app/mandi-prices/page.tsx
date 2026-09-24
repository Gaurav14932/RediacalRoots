import { MandiPriceChart } from '@/components/mandi/mandi-price-chart'
import { MandiPricesHeader } from '@/components/mandi/mandi-prices-header'
import { SiteHeader } from '@/components/site-header'
import { Card, CardContent } from '@/components/ui/card'
import { getLatestPrices } from '@/lib/mandi-data'
import { CROP_LABELS } from '@/lib/constants'
import type { CropType } from '@/lib/types'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

const CROPS: CropType[] = ['soybean', 'tur', 'wheat', 'chana', 'watermelon', 'kharbuja', 'onion']

export default function MandiPricesPage() {
  const cropSummaries = CROPS.map((crop) => {
    const latest = getLatestPrices(crop)
    const nashik = latest.find((p) => p.mandi_name === 'Nashik')
    return { crop, price: nashik?.modal_price ?? null }
  })

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <MandiPricesHeader />

        {/* Quick crop price summary */}
        <div className="mb-8 grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          {cropSummaries.map(({ crop, price }) => (
            <Card key={crop} className="border-border/60">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground truncate">{CROP_LABELS[crop].split(' ')[0]}</p>
                <p className="mt-1 font-semibold text-foreground">
                  {price ? `₹${price.toLocaleString('en-IN')}` : '—'}
                </p>
                <p className="text-xs text-muted-foreground">/quintal</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main chart */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <MandiPriceChart />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
