'use client'

import { createAggregatedLot } from '@/app/dashboard/fpo-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  LOT_STATUS_CLASSES,
  formatDate,
  formatINR,
} from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel, getLotStatusLabel } from '@/lib/i18n/translations'
import type { CropLot, CropType, Grade } from '@/lib/types'
import {
  CheckSquare,
  Layers,
  MapPin,
  Package,
  Square,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

interface FpoDashboardClientProps {
  lots: CropLot[]
  fpoName: string
}

export function FpoDashboardClient({ lots, fpoName }: FpoDashboardClientProps) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [mergeOpen, setMergeOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [customPrice, setCustomPrice] = useState('')
  const [mergeLocation, setMergeLocation] = useState('')

  // Only lots that can be aggregated (strict exclusion of already-aggregated or child lots)
  const eligibleLots = lots.filter(
    (l) =>
      ['listed', 'under_verification', 'verified'].includes(l.status) &&
      !l.is_aggregated &&
      !l.parent_lot_id &&
      l.status !== 'aggregated',
  )
  const aggregatedLots = lots.filter((l) => l.status === 'aggregated' || l.is_aggregated)

  // Group eligible lots by crop type + grade
  const grouped = useMemo(() => {
    const map = new Map<string, CropLot[]>()
    for (const lot of eligibleLots) {
      const grade = lot.final_grade ?? lot.ai_prescreen_grade ?? 'Ungraded'
      const key = `${lot.crop_type}::${grade}`
      const existing = map.get(key) ?? []
      existing.push(lot)
      map.set(key, existing)
    }
    return map
  }, [eligibleLots])

  const selectedLots = eligibleLots.filter((l) => selectedIds.has(l.id))

  // Validate compatibility of selected lots
  const selectionValidation = useMemo(() => {
    if (selectedLots.length < 2) return { valid: false, reason: 'Select at least 2 lots' }
    const cropTypes = new Set(selectedLots.map((l) => l.crop_type))
    if (cropTypes.size > 1) return { valid: false, reason: 'All selected lots must be the same crop' }
    return { valid: true, reason: null }
  }, [selectedLots])

  const combinedQuantity = selectedLots.reduce((s, l) => s + Number(l.quantity), 0)
  const weightedAvgPrice =
    selectedLots.length > 0
      ? Math.round(
          selectedLots.reduce((s, l) => s + l.price_expected * Number(l.quantity), 0) / combinedQuantity,
        )
      : 0

  const selectedCrop = selectedLots[0]?.crop_type ?? null
  const selectedGrade = selectedLots[0]?.final_grade ?? selectedLots[0]?.ai_prescreen_grade ?? null
  const selectedUnit = selectedLots[0]?.unit ?? 'quintal'

  function toggleLot(id: string, crop: CropType, grade: Grade | null) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        // Ensure same crop + compatible grade
        const anySelected = [...next]
        const firstLot = eligibleLots.find((l) => anySelected[0] === l.id)
        if (firstLot && firstLot.crop_type !== crop) {
          toast.error('You can only merge lots of the same crop type')
          return prev
        }
        next.add(id)
      }
      return next
    })
  }

  function selectAll(key: string) {
    const lotsInGroup = grouped.get(key) ?? []
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const lot of lotsInGroup) next.add(lot.id)
      return next
    })
  }

  async function handleMerge(e: React.FormEvent) {
    e.preventDefault()
    if (!selectionValidation.valid || !selectedCrop) return
    setIsLoading(true)

    const price = Number.parseFloat(customPrice) || weightedAvgPrice
    const location = mergeLocation.trim() || selectedLots[0]?.location || 'FPO Warehouse, Maharashtra'

    const result = await createAggregatedLot({
      cropType: selectedCrop,
      grade: selectedGrade as Grade | null,
      totalQuantity: combinedQuantity,
      unit: selectedUnit,
      priceExpected: price,
      location,
      contributingLotIds: [...selectedIds],
    })

    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(`Aggregated lot created and listed on the marketplace`)
    setSelectedIds(new Set())
    setMergeOpen(false)
    setCustomPrice('')
    setMergeLocation('')
    router.refresh()
  }

  const stats = {
    total: lots.length,
    eligible: eligibleLots.length,
    aggregated: aggregatedLots.length,
    farmers: new Set(lots.map((l) => l.farmer_id)).size,
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard icon={<Users className="size-5" />} label={t.fpo.farmersContributing} value={stats.farmers.toString()} />
        <StatCard icon={<Package className="size-5" />} label={t.farmer.activeLots} value={stats.total.toString()} />
        <StatCard icon={<Layers className="size-5" />} label={t.fpo.compatibleBatches} value={stats.eligible.toString()} />
        <StatCard icon={<CheckSquare className="size-5" />} label={t.fpo.mergedLots} value={stats.aggregated.toString()} />
      </div>

      {/* Selection toolbar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">{selectedIds.size} lots selected</span>
            <span className="text-sm text-muted-foreground">
              {t.fpo.combinedVolume}: {combinedQuantity} {selectedUnit} •{' '}
              {selectedCrop ? getCropLabel(selectedCrop, locale) : ''}
              {selectionValidation.reason && (
                <span className="ml-2 text-destructive">{selectionValidation.reason}</span>
              )}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              {t.common.cancel}
            </Button>
            <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
              <DialogTrigger
                render={
                  <Button
                    size="sm"
                    className="gap-2"
                    disabled={!selectionValidation.valid}
                  >
                    <Layers className="size-4" />
                    {t.fpo.mergeSelectedBtn}
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleMerge}>
                  <DialogHeader>
                    <DialogTitle>{t.fpo.dialogTitle}</DialogTitle>
                    <DialogDescription>
                      {t.fpo.dialogDesc}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="rounded-lg bg-muted/50 p-4 text-sm">
                      <p className="font-medium text-foreground mb-2">{t.lotDetail.traceabilityBreakdown}:</p>
                      <div className="flex flex-col gap-1">
                        {selectedLots.map((lot) => (
                          <div key={lot.id} className="flex items-center justify-between text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="size-3" />
                              {lot.location}
                            </span>
                            <span>{lot.quantity} {lot.unit}</span>
                          </div>
                        ))}
                        <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 font-medium text-foreground">
                          <span>{t.fpo.combinedVolume}</span>
                          <span>{combinedQuantity} {selectedUnit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="agg-price">
                        {t.fpo.customPriceLabel} — {t.common.price}: {formatINR(weightedAvgPrice)}
                      </Label>
                      <Input
                        id="agg-price"
                        type="number"
                        min="0"
                        step="1"
                        placeholder={String(weightedAvgPrice)}
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="agg-location">{t.fpo.pickupLocationLabel}</Label>
                      <Input
                        id="agg-location"
                        placeholder={selectedLots[0]?.location ?? 'FPO Warehouse, Maharashtra'}
                        value={mergeLocation}
                        onChange={(e) => setMergeLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading} className="w-full gap-2">
                      <Layers className="size-4" />
                      {isLoading ? t.common.loading : t.fpo.confirmMergeBtn}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Grouped lot tables */}
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-foreground">{t.fpo.compatibleBatches}</h2>
        {grouped.size === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <Layers className="size-8 text-muted-foreground" />
              <p className="font-medium text-foreground">{t.fpo.noLotsEligible}</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {t.farmer.noLotsListed}
              </p>
            </CardContent>
          </Card>
        ) : (
          [...grouped.entries()].map(([key, groupLots]) => {
            const [cropType, grade] = key.split('::')
            const cropLabel = getCropLabel(cropType as CropType, locale)
            const allSelected = groupLots.every((l) => selectedIds.has(l.id))
            return (
              <div key={key}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{cropLabel}</h3>
                    <Badge className="bg-primary/10 text-primary border border-primary/30">
                      {t.lotDetail.gradeLabel} {grade}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {groupLots.length} lots •{' '}
                      {groupLots.reduce((s, l) => s + Number(l.quantity), 0)}{' '}
                      {groupLots[0]?.unit}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (allSelected) {
                        setSelectedIds((prev) => {
                          const next = new Set(prev)
                          for (const lot of groupLots) next.delete(lot.id)
                          return next
                        })
                      } else {
                        selectAll(key)
                      }
                    }}
                  >
                    {allSelected ? t.common.cancel : t.common.all}
                  </Button>
                </div>
                <Card className="border-border/60">
                  <CardContent className="divide-y divide-border/60 p-0">
                    {groupLots.map((lot) => {
                      const isSelected = selectedIds.has(lot.id)
                      return (
                        <div
                          key={lot.id}
                          className={`flex cursor-pointer items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/50 ${isSelected ? 'bg-primary/5' : ''}`}
                          onClick={() =>
                            toggleLot(lot.id, lot.crop_type, lot.final_grade ?? lot.ai_prescreen_grade ?? null)
                          }
                        >
                          <div className="text-primary">
                            {isSelected ? (
                              <CheckSquare className="size-5" />
                            ) : (
                              <Square className="size-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {lot.quantity} {lot.unit}
                            </p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3" />
                              {lot.location} • {t.lotDetail.listedOnLabel} {formatDate(lot.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{formatINR(lot.price_expected)}</p>
                            <p className="text-xs text-muted-foreground">{t.marketplace.perUnit} {lot.unit}</p>
                          </div>
                          <Badge className={LOT_STATUS_CLASSES[lot.status]}>
                            {getLotStatusLabel(lot.status, locale)}
                          </Badge>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            )
          })
        )}
      </div>

      {/* Already aggregated lots */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t.fpo.mergedLots}</h2>
        {aggregatedLots.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
              <Layers className="size-6 text-muted-foreground/50" />
              <p className="text-sm font-medium text-foreground">{t.fpo.noAggregatedLots}</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                {t.fpo.createFirstBulkDesc}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {aggregatedLots.map((lot) => (
              <Card key={lot.id} className="border-border/60">
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{getCropLabel(lot.crop_type, locale)}</p>
                      <p className="text-sm text-muted-foreground">
                        {lot.quantity} {lot.unit}
                      </p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-900/30 dark:text-purple-300">
                      {t.marketplace.aggregatedBadge}
                    </Badge>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {lot.location}
                  </p>
                  {lot.contributing_lots_count && (
                    <p className="flex items-center gap-1.5 text-sm text-primary">
                      <Users className="size-3.5" />
                      {t.marketplace.sourcedFromFarmers.replace('{count}', String(lot.contributing_lots_count))}
                    </p>
                  )}
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-sm text-muted-foreground">{t.marketplace.perUnit} {lot.unit}</span>
                    <span className="font-semibold text-primary">{formatINR(lot.price_expected)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
