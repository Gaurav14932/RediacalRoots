'use client'

import { NewLotDialog } from '@/components/dashboard/new-lot-dialog'
import { MandiSummaryCard } from '@/components/mandi/mandi-price-chart'
import { SellingWindowCard } from '@/components/dashboard/selling-window-card'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  LOT_STATUS_CLASSES,
  formatDate,
  formatINR,
} from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel, getLotStatusLabel } from '@/lib/i18n/translations'
import type { CropLot, CropType, Order } from '@/lib/types'
import { Package, ShoppingBasket, Sprout, Star } from 'lucide-react'
import Link from 'next/link'

interface FarmerDashboardViewProps {
  cropLots: CropLot[]
  recentOrders: Order[]
  feedbackStats: { average: number; count: number }
  primaryCrop: CropType
}

export function FarmerDashboardView({
  cropLots,
  recentOrders,
  feedbackStats,
  primaryCrop,
}: FarmerDashboardViewProps) {
  const { t, locale } = useI18n()

  const activeListings = cropLots.filter((lot) =>
    ['listed', 'under_verification', 'verified'].includes(lot.status),
  ).length
  const totalQuantity = cropLots.reduce((sum, lot) => sum + Number(lot.quantity), 0)

  return (
    <div className="flex flex-col gap-8">
      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Sprout className="size-5" />}
          label={t.farmer.activeLots}
          value={activeListings.toString()}
        />
        <StatCard
          icon={<Package className="size-5" />}
          label={t.common.crop + ' ' + t.common.quantity}
          value={cropLots.length.toString()}
        />
        <StatCard
          icon={<ShoppingBasket className="size-5" />}
          label={t.farmer.totalQuantityListed}
          value={`${totalQuantity.toLocaleString('en-IN')} qtl`}
        />
      </div>

      {/* Main Grid: Crop Lots + Mandi Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t.farmer.myCrops}</h2>
            <NewLotDialog />
          </div>

          {cropLots.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <Sprout className="size-8 text-muted-foreground" />
                <p className="font-medium text-foreground">{t.farmer.noLotsListed}</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {t.farmer.listFirstLot}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {cropLots.map((lot) => (
                <Card key={lot.id} className="border-border/60">
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{getCropLabel(lot.crop_type, locale)}</p>
                          {lot.is_aggregated && (
                            <Badge className="bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                              {t.marketplace.aggregatedBadge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {lot.quantity} {lot.unit} • {lot.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {lot.final_grade && (
                          <Badge variant="outline" className="text-xs font-semibold">
                            {t.marketplace.gradePrefix} {lot.final_grade}
                          </Badge>
                        )}
                        <Badge className={LOT_STATUS_CLASSES[lot.status]}>
                          {getLotStatusLabel(lot.status, locale)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="text-sm text-muted-foreground">{t.common.price}</span>
                      <span className="font-semibold text-primary">{formatINR(lot.price_expected)}</span>
                    </div>

                    {/* Selling window card for active lots */}
                    {['listed', 'verified'].includes(lot.status) && (
                      <SellingWindowCard cropType={lot.crop_type} />
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>{t.common.date}: {formatDate(lot.created_at)}</span>
                      <Link
                        href={`/marketplace/${lot.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {t.farmer.actionViewLot} →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Mandi Price Sidebar */}
        <div className="flex flex-col gap-4">
          <MandiSummaryCard crop={primaryCrop} />
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-foreground mb-1">
                {t.farmer.marketComparison}
              </p>
              <p className="text-xs text-muted-foreground">
                APMC modal rates from Nashik and Maharashtra mandis. Check{' '}
                <Link href="/mandi-prices" className="text-primary underline underline-offset-2">
                  {t.common.mandiPrices}
                </Link>{' '}
                for live multi-mandi comparisons.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {t.farmer.recentDispatches}
          </h2>
          {recentOrders.length > 0 && (
            <Link href="/orders" className="text-sm font-medium text-primary hover:underline">
              {t.common.view} {t.common.all}
            </Link>
          )}
        </div>
        {recentOrders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <Package className="size-6 text-muted-foreground/50" />
              <p className="text-sm font-medium text-foreground">{t.orders.noOrdersTitle}</p>
              <p className="text-xs text-muted-foreground">
                {t.orders.noOrdersFarmerDesc}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/60">
            <CardContent className="divide-y divide-border/60 p-0">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {order.lot ? getCropLabel(order.lot.crop_type, locale) : t.common.crop} •{' '}
                      {order.quantity} {order.lot?.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatINR(order.price_agreed * order.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Buyer Ratings */}
      <Card className="border-border/60">
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 ${feedbackStats.count > 0 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              <Star className={`size-5 ${feedbackStats.count > 0 ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`} />
              <span className="font-bold text-foreground text-lg">
                {feedbackStats.count > 0 ? feedbackStats.average.toFixed(1) : '—'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t.lotDetail.ratingsAndReviews}</p>
              <p className="text-xs text-muted-foreground">
                {feedbackStats.count > 0
                  ? `${feedbackStats.count} ${t.lotDetail.ratingsCountSuffix}`
                  : t.lotDetail.noReviewsYet}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              feedbackStats.count > 0
                ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'text-muted-foreground bg-muted'
            }`}
          >
            {feedbackStats.count > 0 ? t.lotDetail.verifiedSellerBadge : t.roles.farmer}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
