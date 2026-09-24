'use client'

import { calculateSellingWindow } from '@/lib/mandi-data'
import type { CropType } from '@/lib/types'
import { CROP_LABELS, formatINR } from '@/lib/constants'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingDown, TrendingUp, Minus, Info } from 'lucide-react'

import { useI18n } from '@/lib/i18n/context'

interface SellingWindowCardProps {
  cropType: CropType
  mandi?: string
  className?: string
}

export function SellingWindowCard({
  cropType,
  mandi = 'Nashik',
  className = '',
}: SellingWindowCardProps) {
  const { t } = useI18n()
  const suggestion = calculateSellingWindow(cropType, mandi)
  const { signal, headline, detail, trend } = suggestion

  const signalConfig = {
    hold: {
      bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
      icon: <TrendingUp className="size-4 text-blue-600 dark:text-blue-400" />,
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      label: t.sellingWindow.holdBadge,
    },
    sell: {
      bg: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
      icon: <TrendingUp className="size-4 text-green-600 dark:text-green-400" />,
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      label: t.sellingWindow.sellBadge,
    },
    watch: {
      bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
      icon: <Minus className="size-4 text-amber-600 dark:text-amber-400" />,
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      label: t.sellingWindow.watchBadge,
    },
  }

  const config = signalConfig[signal]

  const trendIcon =
    trend.direction === 'up' ? (
      <TrendingUp className="size-3.5 text-green-600" />
    ) : trend.direction === 'down' ? (
      <TrendingDown className="size-3.5 text-destructive" />
    ) : (
      <Minus className="size-3.5 text-muted-foreground" />
    )

  return (
    <div className={`rounded-lg border p-4 ${config.bg} ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="text-xs font-semibold text-foreground">{t.sellingWindow.title}</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.badge}`}>
          {config.label}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground leading-snug mb-1">{headline}</p>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{detail}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/40 pt-2">
        <span className="flex items-center gap-1">
          {trendIcon}
          {trend.percent7d >= 0 ? '+' : ''}{trend.percent7d.toFixed(1)}% (7d)
        </span>
        <span>{t.sellingWindow.currentPrice}: {formatINR(trend.current)}/qtl</span>
        <span className="ml-auto flex items-center gap-1">
          <Info className="size-3" />
          {mandi} APMC
        </span>
      </div>
    </div>
  )
}
