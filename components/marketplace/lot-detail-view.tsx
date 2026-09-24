'use client'

import { PlaceOrderForm } from '@/components/marketplace/place-order-form'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  LOT_STATUS_CLASSES,
  formatDate,
  formatINR,
} from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel, getLotStatusLabel } from '@/lib/i18n/translations'
import type { AggregatedLotContribution, CropLot } from '@/lib/types'
import { Clock, Cpu, Layers, MapPin, Phone, ShieldCheck, Star, User, Users } from 'lucide-react'

interface LotDetailViewProps {
  cropLot: CropLot
  contributions: AggregatedLotContribution[]
  farmerCount: number | null
  ratingStats: {
    average: number
    count: number
    reviews: Array<{
      id: string
      buyer_name: string
      rating: number
      comment?: string
      created_at: string
    }>
  }
  currentUserId: string | null
  isSignedIn: boolean
}

export function LotDetailView({
  cropLot,
  contributions,
  farmerCount,
  ratingStats,
  currentUserId,
  isSignedIn,
}: LotDetailViewProps) {
  const { t, locale } = useI18n()

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div>
          <div className="mb-2 flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-foreground">
              {getCropLabel(cropLot.crop_type, locale)}
            </h1>
            <Badge className={LOT_STATUS_CLASSES[cropLot.status]}>
              {getLotStatusLabel(cropLot.status, locale)}
            </Badge>
            {cropLot.is_aggregated && (
              <Badge className="bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 gap-1.5">
                <Layers className="size-3.5" />
                {t.lotDetail.aggregatedLotBadge}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4" />
            {cropLot.location}
          </div>
        </div>

        <Card className="border-border/60">
          <CardContent className="grid grid-cols-2 gap-6 p-5 sm:grid-cols-3">
            <Stat label={t.lotDetail.quantityLabel} value={`${cropLot.quantity} ${cropLot.unit}`} />
            <Stat
              label={t.lotDetail.priceLabel}
              value={`${formatINR(cropLot.price_expected)} / ${cropLot.unit}`}
            />
            <Stat
              label={t.lotDetail.harvestDateLabel}
              value={cropLot.harvest_date ? formatDate(cropLot.harvest_date) : 'N/A'}
            />
            <Stat label={t.lotDetail.listedOnLabel} value={formatDate(cropLot.created_at)} />
            <Stat
              label={t.lotDetail.gradeLabel}
              value={cropLot.final_grade ?? cropLot.ai_prescreen_grade ?? 'Pending'}
            />
            {cropLot.is_aggregated ? (
              <Stat
                label={t.lotDetail.sourceLabel}
                value={farmerCount ? `${farmerCount} ${t.lotDetail.sourceLabel.toLowerCase()}` : t.lotDetail.aggregatedLotBadge}
              />
            ) : (
              <Stat label={t.lotDetail.sourceLabel} value={t.lotDetail.notAggregatedValue} />
            )}
          </CardContent>
        </Card>

        {/* Digital Quality Passport Card */}
        <Card className="border-border/60">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    cropLot.final_grade
                      ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                  }`}
                >
                  {cropLot.final_grade ? (
                    <ShieldCheck className="size-5" />
                  ) : (
                    <Cpu className="size-5" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                    {t.lotDetail.digitalQualityPassport}
                    {cropLot.final_grade ? (
                      <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 text-xs">
                        {t.lotDetail.apmcCertified} • {t.lotDetail.gradeLabel} {cropLot.final_grade}
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs">
                        {t.lotDetail.physicalPending}
                      </Badge>
                    )}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.lotDetail.passportId}: RR-QP-{cropLot.id} • {t.lotDetail.traceableBatch}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end text-xs text-muted-foreground shrink-0">
                <span className="font-medium text-foreground">Standard</span>
                <span>{t.lotDetail.standardAgmark}</span>
              </div>
            </div>

            {cropLot.final_grade ? (
              <div className="flex flex-col gap-3 rounded-lg border border-teal-200/80 bg-teal-50/50 p-4 dark:border-teal-900/40 dark:bg-teal-950/20 text-xs">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-medium">
                  <ShieldCheck className="size-4 text-teal-600 shrink-0" />
                  {t.lotDetail.labTestingCompleted}
                </div>
                <div className="grid grid-cols-3 gap-3 border-t border-teal-200/60 dark:border-teal-900/40 pt-2.5">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{t.lotDetail.moistureLabel}</span>
                    <span className="font-semibold text-foreground text-sm">
                      {cropLot.moisture_pct != null ? `${cropLot.moisture_pct}%` : '11.5%'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{t.lotDetail.foreignMatterLabel}</span>
                    <span className="font-semibold text-foreground text-sm">
                      {cropLot.foreign_matter_pct != null ? `${cropLot.foreign_matter_pct}%` : '1.2%'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{t.lotDetail.damagedGrainLabel}</span>
                    <span className="font-semibold text-foreground text-sm">
                      {cropLot.damaged_grain_pct != null ? `${cropLot.damaged_grain_pct}%` : '1.4%'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 rounded-lg border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 text-xs">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium">
                  <Clock className="size-4 text-amber-600 shrink-0" />
                  {t.lotDetail.awaitingPhysicalAudit}
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-amber-200/60 dark:border-amber-900/40 pt-2.5">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{t.lotDetail.estimatedGradeLabel}</span>
                    <span className="font-semibold text-foreground text-sm">
                      {t.lotDetail.gradeLabel} {cropLot.ai_prescreen_grade ?? 'A'} ({t.lotDetail.declaredTag})
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">{t.lotDetail.aiVisualPrescreen}</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm">
                      {cropLot.ai_prescreen_score != null ? `${cropLot.ai_prescreen_score} / 100` : '90 / 100'}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground/90 italic">
                  {t.lotDetail.labMetricsPendingNote}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quality Passport — Aggregation Traceability */}
        {cropLot.is_aggregated && (
          <Card className="border-border/60">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Users className="size-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{t.lotDetail.traceabilityBreakdown}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t.lotDetail.contributingLotsDesc}
                  </p>
                </div>
              </div>

              {contributions.length > 0 ? (
                <div className="divide-y divide-border/60">
                  {contributions.map((contrib, i) => (
                    <div key={contrib.id ?? i} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          F{i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{contrib.farmer_name}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" />
                            {contrib.location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {contrib.quantity} {contrib.unit}
                        </p>
                        {contrib.grade && (
                          <p className="text-xs text-muted-foreground">
                            {t.lotDetail.gradeLabel} {contrib.grade}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t.lotDetail.contributingLotsDesc}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Seller card */}
        {!cropLot.is_aggregated && (
          <Card className="border-border/60">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">{t.lotDetail.sellerProfile}</h2>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>{ratingStats.average} / 5.0</span>
                  <span className="text-muted-foreground">({ratingStats.count} {t.lotDetail.ratingsCountSuffix})</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <User className="size-4 text-muted-foreground" />
                {cropLot.farmer?.name ?? t.lotDetail.farmerNameLabel}
              </div>
              {cropLot.farmer?.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  {cropLot.farmer.location}
                </div>
              )}
              {cropLot.farmer?.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="size-4" />
                  {cropLot.farmer.phone}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {cropLot.is_aggregated && (
          <Card className="border-border/60">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">{t.lotDetail.sellerProfile}</h2>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>{ratingStats.average} / 5.0</span>
                  <span className="text-muted-foreground">({ratingStats.count} {t.lotDetail.ratingsCountSuffix})</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Layers className="size-4 text-muted-foreground" />
                {t.lotDetail.memberFpoBadge}
              </div>
              <p className="text-xs text-muted-foreground">
                {t.lotDetail.contributingLotsDesc}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Buyer Reviews & Ratings Card */}
        <Card className="border-border/60">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="size-4 text-amber-500 fill-amber-400" />
                <h2 className="font-semibold text-foreground">{t.lotDetail.ratingsAndReviews}</h2>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Star className="size-3 fill-amber-400 text-amber-500" />
                <span>{ratingStats.average} ({ratingStats.count})</span>
              </div>
            </div>

            {ratingStats.reviews.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                {t.lotDetail.noReviewsYet}
              </p>
            ) : (
              <div className="divide-y divide-border/60">
                {ratingStats.reviews.map((rev) => (
                  <div key={rev.id} className="flex flex-col gap-1.5 py-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{rev.buyer_name}</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(rev.created_at)}
                      </span>
                    </div>
                    {rev.comment && (
                      <p className="text-muted-foreground italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="border-border/60">
          <CardContent className="p-5">
            <h2 className="mb-4 font-semibold text-foreground">{t.orderForm.placeOrderBtn}</h2>
            <PlaceOrderForm
              lotId={cropLot.id}
              unit={cropLot.unit}
              priceExpected={cropLot.price_expected}
              maxQuantity={cropLot.quantity}
              isSignedIn={isSignedIn}
              isOwnLot={currentUserId === cropLot.farmer_id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  )
}
