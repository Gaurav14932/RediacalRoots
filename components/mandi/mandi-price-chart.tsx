'use client'

import { getMandiPrices, getLastMandiSyncTimestamp } from '@/lib/mandi-data'
import { syncMandiPricesWithFallback } from '@/lib/ai-services'
import type { CropType, MandiPrice } from '@/lib/types'
import { formatINR, CROP_LABELS } from '@/lib/constants'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel } from '@/lib/i18n/translations'

const DAYS_OPTIONS = [7, 14, 30] as const
type DaysOption = (typeof DAYS_OPTIONS)[number]

const MANDI_OPTIONS = ['Nashik', 'Lasalgaon', 'Pune', 'Latur', 'Akola', 'Nagpur']

interface MandiPriceChartProps {
  defaultCrop?: CropType
  defaultMandi?: string
  compact?: boolean
}

function formatChartDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border/60 bg-popover px-3 py-2 shadow-lg text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function MandiPriceChart({
  defaultCrop = 'soybean',
  defaultMandi = 'Nashik',
  compact = false,
}: MandiPriceChartProps) {
  const { t, locale } = useI18n()
  const [crop, setCrop] = useState<CropType>(defaultCrop)
  const [mandi, setMandi] = useState(defaultMandi)
  const [days, setDays] = useState<DaysOption>(compact ? 7 : 30)
  const [syncTimestamp, setSyncTimestamp] = useState<string>(() => getLastMandiSyncTimestamp())

  useEffect(() => {
    syncMandiPricesWithFallback().then((res) => {
      if (res.syncedAt) {
        setSyncTimestamp(res.syncedAt)
      }
    })
  }, [])

  const formattedSyncTime = useMemo(() => {
    try {
      const d = new Date(syncTimestamp)
      if (isNaN(d.getTime())) return syncTimestamp
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return syncTimestamp
    }
  }, [syncTimestamp])

  const data = useMemo((): MandiPrice[] => {
    const prices = getMandiPrices({ crop, mandi, days })
    return [...prices].sort((a, b) => a.date.localeCompare(b.date))
  }, [crop, mandi, days])

  const chartData = data.map((p) => ({
    date: formatChartDate(p.date),
    'Modal Price': p.modal_price,
    'Min Price': p.min_price,
    'Max Price': p.max_price,
  }))

  const latest = data[data.length - 1]
  const first = data[0]
  const change = latest && first ? ((latest.modal_price - first.modal_price) / first.modal_price) * 100 : 0
  const isUp = change >= 0

  const crops = Object.keys(CROP_LABELS) as CropType[]

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {/* Compact crop tabs */}
        <div className="flex flex-wrap gap-1">
          {crops.slice(0, 4).map((c) => (
            <button
              key={c}
              onClick={() => setCrop(c)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                crop === c
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {getCropLabel(c, locale).split(' ')[0]}
            </button>
          ))}
        </div>

        {latest && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {formatINR(latest.modal_price)}
            </span>
            <span className={`text-sm font-medium ${isUp ? 'text-chart-2' : 'text-destructive'}`}>
              {isUp ? '+' : ''}{change.toFixed(1)}% (7d)
            </span>
          </div>
        )}

        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorModal-compact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="Modal Price"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#colorModal-compact)"
                dot={false}
              />
              <Tooltip content={<CustomTooltip />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <p>{mandi} APMC • per quintal</p>
          <p className="text-[10px] text-muted-foreground/80 font-medium">Last updated: {formattedSyncTime}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Crop selector */}
        <div className="flex flex-wrap gap-1">
          {crops.map((c) => (
            <button
              key={c}
              onClick={() => setCrop(c)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                crop === c
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {getCropLabel(c, locale)}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Mandi selector */}
          <select
            value={mandi}
            onChange={(e) => setMandi(e.target.value)}
            className="rounded-lg border border-border/60 bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {MANDI_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Days toggle */}
          <div className="flex rounded-lg border border-border/60 overflow-hidden">
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  days === d
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      {latest && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-lg border border-border/40 bg-muted/20 p-3 sm:border-none sm:bg-transparent sm:p-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.mandi.modalPrice}</p>
            <p className="mt-1 text-xl font-bold text-foreground">{formatINR(latest.modal_price)}</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/20 p-3 sm:border-none sm:bg-transparent sm:p-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{days}d Change</p>
            <p className={`mt-1 text-xl font-bold ${isUp ? 'text-chart-2' : 'text-destructive'}`}>
              {isUp ? '+' : ''}{change.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border border-border/40 bg-muted/20 p-3 sm:border-none sm:bg-transparent sm:p-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.mandi.minPrice} – {t.mandi.maxPrice}</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {formatINR(Math.min(...data.map((p) => p.min_price)))} –{' '}
              {formatINR(Math.max(...data.map((p) => p.max_price)))}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-[280px] w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              interval={days === 7 ? 0 : days === 14 ? 1 : 4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `₹${(v / 1000).toFixed(1)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="Min Price"
              stroke="var(--color-chart-2)"
              strokeWidth={1}
              fill="none"
              strokeDasharray="3 3"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="Modal Price"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fill="url(#colorModal)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="Max Price"
              stroke="var(--color-accent)"
              strokeWidth={1}
              fill="none"
              strokeDasharray="3 3"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-primary" /> Modal price
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 border-t border-dashed border-chart-2" /> Min
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 border-t border-dashed border-accent" /> Max
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span>{mandi} APMC • INR/quintal</span>
          <span className="text-[11px] font-medium text-foreground bg-muted/70 px-2 py-0.5 rounded border border-border/70">
            Last updated: {formattedSyncTime}
          </span>
        </div>
      </div>
    </div>
  )
}

export function MandiSummaryCard({ crop }: { crop?: CropType }) {
  const { t } = useI18n()
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{t.common.mandiPrices}</h3>
          <a
            href="/mandi-prices"
            className="text-xs font-medium text-primary hover:underline"
          >
            {t.common.view} {t.common.all} →
          </a>
        </div>
        <MandiPriceChart defaultCrop={crop ?? 'soybean'} compact />
      </CardContent>
    </Card>
  )
}
