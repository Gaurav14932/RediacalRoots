'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { LOT_STATUS_CLASSES, formatINR } from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel, getLotStatusLabel } from '@/lib/i18n/translations'
import type { CropLot } from '@/lib/types'
import { Layers, MapPin, ShieldCheck, Users } from 'lucide-react'
import Link from 'next/link'

export function CropLotCard({ lot }: { lot: CropLot }) {
  const { t, locale } = useI18n()

  return (
    <Link href={`/marketplace/${lot.id}`}>
      <Card className="group h-full border-border/60 transition-colors hover:border-primary/50">
        <CardContent className="flex h-full flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-semibold text-foreground">{getCropLabel(lot.crop_type, locale)}</p>
                {lot.is_aggregated && (
                  <Badge className="bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 text-xs gap-1">
                    <Layers className="size-3" />
                    {t.marketplace.aggregatedBadge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {lot.quantity} {lot.unit}
              </p>
            </div>
            <Badge className={LOT_STATUS_CLASSES[lot.status]}>
              {getLotStatusLabel(lot.status, locale)}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {lot.location}
          </div>

          {lot.is_aggregated && lot.contributing_lots_count && (
            <div className="flex items-center gap-1.5 text-sm text-purple-600 dark:text-purple-400">
              <Users className="size-3.5" />
              {t.marketplace.sourcedFromFarmers.replace('{count}', String(lot.contributing_lots_count))}
            </div>
          )}

          {lot.final_grade && (
            <div className="flex items-center gap-1.5 text-sm text-primary">
              <ShieldCheck className="size-3.5" />
              {t.marketplace.gradePrefix} {lot.final_grade}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
            <span className="text-sm text-muted-foreground">
              {t.marketplace.perUnit} {lot.unit}
            </span>
            <span className="font-semibold text-primary">{formatINR(lot.price_expected)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
