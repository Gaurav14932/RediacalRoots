'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ORDER_STATUS_CLASSES,
  formatDate,
  formatINR,
} from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel, getOrderStatusLabel } from '@/lib/i18n/translations'
import type { Order } from '@/lib/types'
import { ClipboardList, ShoppingBasket, Store } from 'lucide-react'
import Link from 'next/link'

interface BuyerDashboardViewProps {
  recentOrders: Order[]
  totalSpend: number
}

export function BuyerDashboardView({ recentOrders, totalSpend }: BuyerDashboardViewProps) {
  const { t, locale } = useI18n()

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<ClipboardList className="size-5" />}
          label={t.buyer.ordersPlaced}
          value={recentOrders.length.toString()}
        />
        <StatCard
          icon={<ShoppingBasket className="size-5" />}
          label={t.buyer.totalOrderValue}
          value={formatINR(totalSpend)}
        />
        <Card className="flex items-center justify-center border-dashed border-primary/40 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
            <Store className="size-6 text-primary" />
            <Button size="sm" nativeButton={false} render={<Link href="/marketplace" />}>
              {t.buyer.browseMarketplaceBtn}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {t.buyer.recentOrdersTitle}
          </h2>
          {recentOrders.length > 0 && (
            <Link
              href="/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t.buyer.viewAllLink}
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <ShoppingBasket className="size-8 text-muted-foreground" />
              <p className="font-medium text-foreground">{t.buyer.noOrdersYetTitle}</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {t.buyer.noOrdersYetDesc}
              </p>
              <Button
                size="sm"
                className="mt-2"
                nativeButton={false}
                render={<Link href="/marketplace" />}
              >
                {t.buyer.goToMarketplaceBtn}
              </Button>
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
                    <p className="text-sm text-muted-foreground">
                      {order.lot?.location} • {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-semibold text-foreground">
                      {formatINR(order.price_agreed * order.quantity)}
                    </span>
                    <Badge className={ORDER_STATUS_CLASSES[order.status]}>
                      {getOrderStatusLabel(order.status, locale)}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
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
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
