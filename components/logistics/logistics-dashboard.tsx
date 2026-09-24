'use client'

import dynamic from 'next/dynamic'
import { getDeliveryRuns, updateStopStatus } from '@/lib/logistics-data'
import type { DeliveryRun, DeliveryStop, DeliveryStopStatus } from '@/lib/types'
import {
  DELIVERY_STOP_STATUS_CLASSES,
  DELIVERY_STOP_STATUS_LABELS,
} from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel } from '@/lib/i18n/translations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Route,
  Sparkles,
  Truck,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { optimizeRouteWithFallback } from '@/lib/ai-services'

// Dynamically load the Leaflet map with ssr:false (Leaflet requires browser APIs)
const RouteMap = dynamic(() => import('@/components/logistics/route-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[380px] w-full items-center justify-center rounded-lg border border-border/60 bg-muted/30">
      <p className="text-sm text-muted-foreground">Loading map…</p>
    </div>
  ),
})

const STATUS_PROGRESSION: DeliveryStopStatus[] = ['pending', 'picked_up', 'in_transit', 'delivered']

function nextStatus(current: DeliveryStopStatus): DeliveryStopStatus | null {
  const idx = STATUS_PROGRESSION.indexOf(current)
  return idx < STATUS_PROGRESSION.length - 1 ? STATUS_PROGRESSION[idx + 1] : null
}

const STOP_TYPE_ICONS = {
  pickup: <Package className="size-4 text-green-600 dark:text-green-400" />,
  dropoff: <Truck className="size-4 text-indigo-500 dark:text-indigo-400" />,
}

export function LogisticsDashboard() {
  const { t, locale } = useI18n()
  const [runs, setRuns] = useState<DeliveryRun[]>(() => getDeliveryRuns())
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [expandedRuns, setExpandedRuns] = useState<Set<string>>(new Set())
  const [optimizationStatus, setOptimizationStatus] = useState<
    Record<string, { isFallback: boolean; algorithm: string; gain: number }>
  >({})

  // Asynchronously optimize delivery routes using Supabase Edge Function / Python AI
  useEffect(() => {
    let isCancelled = false
    async function loadOptimizedRuns() {
      const initialRuns = getDeliveryRuns()
      const updatedRuns: DeliveryRun[] = []
      const statusMap: Record<string, { isFallback: boolean; algorithm: string; gain: number }> = {}

      for (const run of initialRuns) {
        const res = await optimizeRouteWithFallback(run.id, run.stops)
        if (isCancelled) return
        statusMap[run.id] = {
          isFallback: res.isFallback,
          algorithm: res.algorithm,
          gain: res.efficiencyGainPct,
        }
        updatedRuns.push({
          ...run,
          stops: res.optimizedStops,
          total_distance_km: res.totalDistanceKm,
        })
      }

      if (!isCancelled) {
        setRuns(updatedRuns)
        setOptimizationStatus(statusMap)
      }
    }

    loadOptimizedRuns()
    return () => {
      isCancelled = true
    }
  }, [])

  // Auto-select first run
  useEffect(() => {
    if (runs.length > 0 && !selectedRunId) {
      setSelectedRunId(runs[0].id)
      setExpandedRuns(new Set([runs[0].id]))
    }
  }, [runs, selectedRunId])

  const selectedRun = useMemo(
    () => runs.find((r) => r.id === selectedRunId),
    [runs, selectedRunId],
  )

  const handleAdvanceStatus = useCallback((stop: DeliveryStop) => {
    const next = nextStatus(stop.status)
    if (!next) return
    updateStopStatus(stop.id, next)
    setRuns((prev) =>
      prev.map((r) =>
        r.id === stop.run_id
          ? {
              ...r,
              stops: r.stops.map((s) => (s.id === stop.id ? { ...s, status: next } : s)),
            }
          : r,
      ),
    )
    toast.success(`Stop #${stop.sequence} marked as ${DELIVERY_STOP_STATUS_LABELS[next]}`)
  }, [])

  function toggleRun(runId: string) {
    setExpandedRuns((prev) => {
      const next = new Set(prev)
      if (next.has(runId)) next.delete(runId)
      else next.add(runId)
      return next
    })
    setSelectedRunId(runId)
  }

  // Compute overall stats
  const totalStops = runs.reduce((s, r) => s + r.stops.length, 0)
  const deliveredStops = runs.reduce(
    (s, r) => s + r.stops.filter((stop) => stop.status === 'delivered').length,
    0,
  )
  const inTransitStops = runs.reduce(
    (s, r) => s + r.stops.filter((stop) => stop.status === 'in_transit').length,
    0,
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard icon={<Route className="size-5" />} label={t.logistics.activeRuns} value={runs.length.toString()} />
        <StatCard icon={<MapPin className="size-5" />} label={t.logistics.stops} value={totalStops.toString()} />
        <StatCard icon={<Truck className="size-5" />} label={t.orderStatuses.in_transit} value={inTransitStops.toString()} />
        <StatCard icon={<CheckCircle2 className="size-5" />} label={t.orderStatuses.delivered} value={deliveredStops.toString()} />
      </div>

      {/* Map + Run list side-by-side */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Run list */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{t.logistics.activeRuns}</h2>
            <Badge className="bg-primary/10 text-primary border border-primary/30 text-xs flex items-center gap-1">
              <Sparkles className="size-3" />
              {t.logistics.aiOptimizedRoute}
            </Badge>
          </div>

          {runs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                <Truck className="size-8 text-muted-foreground/50 mb-1" />
                <p className="text-sm font-medium text-foreground">{t.logistics.noRunsTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {t.logistics.noRunsDesc}
                </p>
              </CardContent>
            </Card>
          ) : (
            runs.map((run) => {
              const isExpanded = expandedRuns.has(run.id)
              const isSelected = selectedRunId === run.id
              const runDelivered = run.stops.filter((s) => s.status === 'delivered').length
              const runTotal = run.stops.length
              const progress = runTotal > 0 ? (runDelivered / runTotal) * 100 : 0
              const optInfo = optimizationStatus[run.id]

              return (
                <Card
                  key={run.id}
                  className={`border-border/60 cursor-pointer transition-colors ${isSelected ? 'border-primary/40 bg-primary/5' : 'hover:border-border'}`}
                  onClick={() => toggleRun(run.id)}
                >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{run.label}</p>
                        <span className="text-xs text-muted-foreground">— {run.region}</span>
                        {optInfo && (
                          optInfo.isFallback ? (
                            <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                              estimated (offline mode)
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              {t.logistics.aiOptimizedRoute} ({optInfo.gain}% {t.logistics.efficiencyGain})
                            </span>
                          )
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {run.stops.length} {t.logistics.stops.toLowerCase()} • ~{run.total_distance_km} km
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{runDelivered}/{runTotal}</span>
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Expanded stop list */}
                  {isExpanded && (
                    <div className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-3">
                      {run.stops.map((stop) => {
                        const next = nextStatus(stop.status)
                        return (
                          <div
                            key={stop.id}
                            className="flex items-start gap-3 rounded-md bg-muted/30 p-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="mt-0.5 shrink-0">{STOP_TYPE_ICONS[stop.type]}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-medium text-foreground truncate">
                                  #{stop.sequence} {stop.contact_name}
                                </p>
                                <Badge className={`text-xs shrink-0 ${DELIVERY_STOP_STATUS_CLASSES[stop.status]}`}>
                                  {DELIVERY_STOP_STATUS_LABELS[stop.status]}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{stop.location}</p>
                              <p className="text-xs text-muted-foreground">
                                {getCropLabel(stop.crop_type, locale)} • {stop.quantity} {stop.unit}
                              </p>
                              {next && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2 h-7 text-xs"
                                  onClick={() => handleAdvanceStatus(stop)}
                                >
                                  {t.logistics.advanceStatusBtn}: {DELIVERY_STOP_STATUS_LABELS[next]}
                                </Button>
                              )}
                              {!next && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-chart-2">
                                  <CheckCircle2 className="size-3" />
                                  {t.orderStatuses.completed}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            {selectedRun ? `${selectedRun.label} — Route Map` : t.logistics.activeRuns}
          </h2>
          {selectedRun ? (
            <>
              <RouteMap key={selectedRun.id} run={selectedRun} />
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-green-600" />
                  Pickup
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded bg-indigo-500" />
                  Drop-off
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-blue-500" />
                  {DELIVERY_STOP_STATUS_LABELS.picked_up}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-orange-500" />
                  {DELIVERY_STOP_STATUS_LABELS.in_transit}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-green-500" />
                  {DELIVERY_STOP_STATUS_LABELS.delivered}
                </span>
              </div>
            </>
          ) : (
            <div className="flex h-[380px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20">
              <p className="text-sm text-muted-foreground">{t.logistics.noRunsTitle}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
