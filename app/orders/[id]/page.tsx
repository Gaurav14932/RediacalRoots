import { RatingDialog } from '@/components/orders/rating-dialog'
import { SiteHeader } from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CROP_LABELS,
  DELIVERY_STOP_STATUS_CLASSES,
  DELIVERY_STOP_STATUS_LABELS,
  ORDER_STATUS_CLASSES,
  ORDER_STATUS_LABELS,
  formatDate,
  formatINR,
} from '@/lib/constants'
import { getOrderDeliveryStatus } from '@/lib/logistics-data'
import { mockStore } from '@/lib/mock-store'
import { createClient } from '@/lib/supabase/server'
import type { Order, UserRole } from '@/lib/types'
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Star,
  Truck,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    redirect(`/auth/login?redirect=/orders/${id}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', userData.user.id)
    .maybeSingle()

  const role = (profile?.role ?? 'buyer') as UserRole

  // Fetch order from mockStore or Supabase
  const allOrders = mockStore.getOrders()
  const order = allOrders.find((o) => o.id === id)

  if (!order) {
    notFound()
  }

  const lot = mockStore.getLotById(order.lot_id)
  const delivery = getOrderDeliveryStatus(order.id)
  const deliveryStop = delivery.stop
  const feedback = mockStore.getFeedbackByOrder(order.id)

  const steps = [
    { key: 'placed', label: 'Order Placed', done: true },
    { key: 'confirmed', label: 'Confirmed', done: true },
    { key: 'scheduled', label: 'Scheduled Run', done: ['scheduled', 'picked_up', 'in_transit', 'delivered'].includes(order.status) || !!deliveryStop },
    { key: 'picked_up', label: 'Picked Up', done: ['picked_up', 'in_transit', 'delivered'].includes(order.status) || deliveryStop?.status === 'picked_up' || deliveryStop?.status === 'in_transit' || deliveryStop?.status === 'delivered' },
    { key: 'in_transit', label: 'In Transit', done: ['in_transit', 'delivered'].includes(order.status) || deliveryStop?.status === 'in_transit' || deliveryStop?.status === 'delivered' },
    { key: 'delivered', label: 'Delivered', done: order.status === 'delivered' || deliveryStop?.status === 'delivered' },
  ]

  const isDelivered = order.status === 'delivered' || deliveryStop?.status === 'delivered'

  return (
    <div className="min-h-svh bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Orders
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">
                {order.lot ? CROP_LABELS[order.lot.crop_type] : 'Crop Order'}
              </h1>
              <Badge className={ORDER_STATUS_CLASSES[order.status]}>
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
              {deliveryStop && (
                <Badge className={`text-xs ${DELIVERY_STOP_STATUS_CLASSES[deliveryStop.status]}`}>
                  <Truck className="size-3 mr-1" />
                  {DELIVERY_STOP_STATUS_LABELS[deliveryStop.status]}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Order ID: #{order.id} • Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-muted-foreground block">Total Settlement</span>
            <span className="text-2xl font-bold text-foreground">
              {formatINR(order.price_agreed * order.quantity)}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-6 md:col-span-2">
            {/* Delivery Timeline Stepper */}
            <Card className="border-border/60">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Truck className="size-4 text-primary" />
                  Fulfillment & Delivery Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {steps.map((step, idx) => (
                    <div key={step.key} className="flex items-center gap-2.5 sm:flex-col sm:items-center text-center">
                      <div
                        className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          step.done
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'border border-border/80 bg-muted text-muted-foreground'
                        }`}
                      >
                        {step.done ? <CheckCircle2 className="size-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs ${
                          step.done ? 'font-medium text-foreground' : 'text-muted-foreground/70'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crop Lot Details */}
            <Card className="border-border/60">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Package className="size-4 text-primary" />
                  Crop Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 p-5 pt-0 sm:grid-cols-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Quantity</span>
                  <span className="font-semibold text-foreground text-sm">
                    {order.quantity} {order.lot?.unit}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Agreed Price</span>
                  <span className="font-semibold text-foreground text-sm">
                    {formatINR(order.price_agreed)} / {order.lot?.unit}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Pickup Hub</span>
                  <span className="font-semibold text-foreground text-sm">
                    {order.lot?.location}
                  </span>
                </div>
                {lot?.final_grade && (
                  <div>
                    <span className="text-muted-foreground block">Verified Grade</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400 text-sm flex items-center gap-1">
                      <ShieldCheck className="size-3.5" /> Grade {lot.final_grade}
                    </span>
                  </div>
                )}
                {lot?.is_aggregated && (
                  <div>
                    <span className="text-muted-foreground block">Traceability</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400 text-sm flex items-center gap-1">
                      <Layers className="size-3.5" /> Sourced from {lot.contributing_lots_count ?? 3} farmers
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Buyer Feedback & Rating Section */}
            <Card className="border-border/60">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Star className="size-4 text-amber-500 fill-amber-400" />
                  Buyer Rating & Review
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                {feedback ? (
                  <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-4 ${
                                i < feedback.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-xs text-foreground">
                          {feedback.rating} / 5 Stars
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        Reviewed on {formatDate(feedback.created_at)}
                      </span>
                    </div>
                    {feedback.comment && (
                      <p className="text-xs text-foreground mt-1 italic">
                        &ldquo;{feedback.comment}&rdquo;
                      </p>
                    )}
                    {feedback.flagged_for_review && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                        <span className="size-2 rounded-full bg-rose-500" />
                        Flagged for administrative review (Rating ≤ 2 stars)
                      </div>
                    )}
                  </div>
                ) : isDelivered ? (
                  <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Have you inspected your delivery?
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Leave feedback on crop quality and packaging to help other buyers.
                      </p>
                    </div>
                    <RatingDialog
                      order={order}
                      buyerName={profile?.name ?? 'Verified Buyer'}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Rating prompt will become available once this order is marked delivered.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: Buyer and Logistics Information */}
          <div className="flex flex-col gap-6">
            <Card className="border-border/60">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">Delivery & Counterparties</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-5 pt-0 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <User className="size-3.5 text-primary" /> Buyer
                  </span>
                  <span className="font-semibold text-foreground">
                    {order.buyer?.name ?? 'FreshAgro Wholesale Mart'}
                  </span>
                  <span className="text-muted-foreground">{order.buyer?.location ?? 'Pune, Maharashtra'}</span>
                </div>

                <div className="border-t border-border/40 pt-3 flex flex-col gap-1">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-primary" /> Seller
                  </span>
                  <span className="font-semibold text-foreground">
                    {lot?.farmer?.name ?? 'Kisan Vikas FPO / Farmer'}
                  </span>
                  <span className="text-muted-foreground">{lot?.location}</span>
                </div>

                {deliveryStop && (
                  <div className="border-t border-border/40 pt-3 flex flex-col gap-1">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                      <Truck className="size-3.5 text-primary" /> Assigned Logistics
                    </span>
                    <span className="font-semibold text-foreground">
                      Sahyadri Agri Logistics (Run #{order.delivery_run_id ?? 'Nashik-Pune-01'})
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Phone className="size-3" /> Driver: +91 98231 66778
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Link
              href={`/marketplace/${order.lot_id}`}
              className="text-center rounded-lg border border-border/60 bg-card p-3 text-xs font-semibold text-primary hover:bg-muted/40 transition-colors"
            >
              View Full Quality Passport →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
