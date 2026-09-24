'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DELIVERY_STOP_STATUS_CLASSES,
  DELIVERY_STOP_STATUS_LABELS,
  ORDER_STATUS_CLASSES,
  formatDate,
  formatINR,
} from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel, getOrderStatusLabel } from '@/lib/i18n/translations'
import { getOrderDeliveryStatus } from '@/lib/logistics-data'
import { RatingDialog } from '@/components/orders/rating-dialog'
import { mockStore } from '@/lib/mock-store'
import type { Order, UserRole } from '@/lib/types'
import { ClipboardList, Truck } from 'lucide-react'
import Link from 'next/link'

interface OrdersClientViewProps {
  allOrders: Order[]
  role: UserRole
  buyerName: string
}

export function OrdersClientView({ allOrders, role, buyerName }: OrdersClientViewProps) {
  const { t, locale } = useI18n()

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">{t.orders.pageTitle}</h1>
        <p className="text-muted-foreground">
          {role === 'farmer' ? t.orders.farmerSubtitle : t.orders.buyerSubtitle}
        </p>
      </div>

      {allOrders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <ClipboardList className="size-8 text-muted-foreground" />
            <p className="font-medium text-foreground">{t.orders.noOrdersTitle}</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {role === 'farmer' ? t.orders.noOrdersFarmerDesc : t.orders.noOrdersBuyerDesc}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60">
          <CardContent className="divide-y divide-border/60 p-0">
            {allOrders.map((order) => {
              const delivery = getOrderDeliveryStatus(order.id)
              const deliveryStop = delivery.stop
              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-foreground">
                      {order.lot ? getCropLabel(order.lot.crop_type, locale) : t.common.crop} •{' '}
                      {order.quantity} {order.lot?.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.lot?.location} • {formatDate(order.created_at)}
                      {role === 'farmer' && order.buyer?.name
                        ? ` • ${t.orders.buyerLabel} ${order.buyer.name}`
                        : ''}
                    </p>
                    {/* Live delivery status */}
                    {deliveryStop && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Truck className="size-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{t.orders.deliveryLabel}</span>
                        <Badge
                          className={`text-xs ${DELIVERY_STOP_STATUS_CLASSES[deliveryStop.status]}`}
                        >
                          {DELIVERY_STOP_STATUS_LABELS[deliveryStop.status]}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                    <span className="font-semibold text-foreground">
                      {formatINR(order.price_agreed * order.quantity)}
                    </span>
                    <Badge className={ORDER_STATUS_CLASSES[order.status]}>
                      {getOrderStatusLabel(order.status, locale)}
                    </Badge>
                    {/* Buyer Feedback & Rating Prompt */}
                    {(order.status === 'delivered' || deliveryStop?.status === 'delivered') && (
                      <div className="mt-1">
                        <RatingDialog
                          order={order}
                          buyerName={buyerName}
                          existingFeedback={mockStore.getFeedbackByOrder(order.id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Link to mandi prices */}
      <div className="mt-8 rounded-lg border border-border/60 bg-primary/5 px-5 py-4">
        <p className="text-sm text-foreground">
          <span className="font-medium">{t.common.tip}:</span> {t.orders.tipText}{' '}
          <Link href="/mandi-prices" className="font-medium text-primary underline underline-offset-4">
            {t.common.mandiPrices}
          </Link>
        </p>
      </div>
    </>
  )
}
