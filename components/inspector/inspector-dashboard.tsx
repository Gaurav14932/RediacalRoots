'use client'

import { submitInspection } from '@/app/inspector/actions'
import { computeGrade } from '@/lib/quality-calculator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  LOT_STATUS_CLASSES,
  formatDate,
} from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel, getLotStatusLabel } from '@/lib/i18n/translations'
import type { CropLot, Grade, QualityInspection } from '@/lib/types'
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Cpu,
  History,
  MapPin,
  Scale,
  ShieldCheck,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { toast } from 'sonner'

interface InspectorDashboardProps {
  pendingLots: CropLot[]
  inspections: QualityInspection[]
  inspectorName: string
  inspectorId: string
}

export function InspectorDashboard({
  pendingLots: initialPending,
  inspections: initialInspections,
  inspectorName,
  inspectorId,
}: InspectorDashboardProps) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue')
  const [sortBy, setSortBy] = useState<'oldest' | 'location'>('oldest')
  const [selectedLot, setSelectedLot] = useState<CropLot | null>(null)
  const [isSubmitting, startTransition] = useTransition()

  // Form states
  const [moisture, setMoisture] = useState<number>(11.5)
  const [foreignMatter, setForeignMatter] = useState<number>(1.2)
  const [damagedGrain, setDamagedGrain] = useState<number>(1.5)
  const [overrideGrade, setOverrideGrade] = useState<Grade | ''>('')
  const [notes, setNotes] = useState<string>('')
  const [formErrors, setFormErrors] = useState<{
    moisture?: string
    foreignMatter?: string
    damagedGrain?: string
  }>({})

  // Computed grade preview
  const liveComputedGrade = useMemo(() => {
    return computeGrade(moisture || 0, foreignMatter || 0, damagedGrain || 0)
  }, [moisture, foreignMatter, damagedGrain])

  // Sort queue
  const sortedQueue = useMemo(() => {
    const list = [...initialPending]
    if (sortBy === 'oldest') {
      return list.sort(
        (a, b) =>
          (new Date(a.created_at || 0).getTime() || 0) -
          (new Date(b.created_at || 0).getTime() || 0),
      )
    } else {
      return list.sort((a, b) => a.location.localeCompare(b.location))
    }
  }, [initialPending, sortBy])

  const openInspectionModal = (lot: CropLot) => {
    setSelectedLot(lot)
    setFormErrors({})
    const aiScore = lot.ai_prescreen_score ?? 85
    if (aiScore >= 90) {
      setMoisture(11.2)
      setForeignMatter(1.0)
      setDamagedGrain(1.1)
    } else if (aiScore >= 80) {
      setMoisture(12.5)
      setForeignMatter(2.1)
      setDamagedGrain(2.4)
    } else {
      setMoisture(14.2)
      setForeignMatter(4.5)
      setDamagedGrain(5.2)
    }
    setOverrideGrade('')
    setNotes('')
  }

  const handleMoistureChange = (val: string) => {
    const n = Number.parseFloat(val)
    setMoisture(n)
    if (isNaN(n)) {
      setFormErrors((prev) => ({ ...prev, moisture: 'Moisture must be a valid number.' }))
    } else if (n < 0) {
      setFormErrors((prev) => ({ ...prev, moisture: 'Moisture cannot be negative.' }))
    } else if (n > 100) {
      setFormErrors((prev) => ({ ...prev, moisture: 'Moisture cannot exceed 100%.' }))
    } else {
      setFormErrors((prev) => ({ ...prev, moisture: undefined }))
    }
  }

  const handleForeignMatterChange = (val: string) => {
    const n = Number.parseFloat(val)
    setForeignMatter(n)
    if (isNaN(n)) {
      setFormErrors((prev) => ({ ...prev, foreignMatter: 'Foreign matter must be a valid number.' }))
    } else if (n < 0) {
      setFormErrors((prev) => ({ ...prev, foreignMatter: 'Foreign matter cannot be negative.' }))
    } else if (n > 100) {
      setFormErrors((prev) => ({ ...prev, foreignMatter: 'Foreign matter cannot exceed 100%.' }))
    } else {
      setFormErrors((prev) => ({ ...prev, foreignMatter: undefined }))
    }
  }

  const handleDamagedGrainChange = (val: string) => {
    const n = Number.parseFloat(val)
    setDamagedGrain(n)
    if (isNaN(n)) {
      setFormErrors((prev) => ({ ...prev, damagedGrain: 'Damaged grain must be a valid number.' }))
    } else if (n < 0) {
      setFormErrors((prev) => ({ ...prev, damagedGrain: 'Damaged grain cannot be negative.' }))
    } else if (n > 100) {
      setFormErrors((prev) => ({ ...prev, damagedGrain: 'Damaged grain cannot exceed 100%.' }))
    } else {
      setFormErrors((prev) => ({ ...prev, damagedGrain: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLot) return

    const errors: { moisture?: string; foreignMatter?: string; damagedGrain?: string } = {}
    if (isNaN(moisture) || moisture < 0) errors.moisture = 'Moisture cannot be negative.'
    if (moisture > 100) errors.moisture = 'Moisture cannot exceed 100%.'
    if (isNaN(foreignMatter) || foreignMatter < 0) errors.foreignMatter = 'Foreign matter cannot be negative.'
    if (foreignMatter > 100) errors.foreignMatter = 'Foreign matter cannot exceed 100%.'
    if (isNaN(damagedGrain) || damagedGrain < 0) errors.damagedGrain = 'Damaged grain cannot be negative.'
    if (damagedGrain > 100) errors.damagedGrain = 'Damaged grain cannot exceed 100%.'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.error('Please fix validation errors')
      return
    }

    startTransition(async () => {
      const res = await submitInspection({
        lotId: selectedLot.id,
        inspectorId,
        inspectorName,
        moisturePct: Number(moisture),
        foreignMatterPct: Number(foreignMatter),
        damagedGrainPct: Number(damagedGrain),
        overrideGrade: overrideGrade ? (overrideGrade as Grade) : null,
        notes: notes || undefined,
      })

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(t.inspector.certifiedToast)
        setSelectedLot(null)
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Inspector Overview Header Card */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="flex flex-col gap-1 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.inspector.queueTab}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {initialPending.length}
              </span>
              <span className="text-xs text-muted-foreground">{t.inspector.queueTab}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex flex-col gap-1 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.inspector.historyTab}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {initialInspections.length}
              </span>
              <span className="text-xs text-muted-foreground">{t.lotStatuses.verified}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex flex-col gap-1 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.lotDetail.gradeLabel} A
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">88%</span>
              <span className="text-xs text-emerald-600 font-medium">+4%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex flex-col gap-1 p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.lotDetail.standardAgmark}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">Nashik Hub</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Central APMC Lab</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'queue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('queue')}
            className="gap-2 text-xs"
          >
            <Scale className="size-3.5" />
            {t.inspector.queueTab} ({initialPending.length})
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('history')}
            className="gap-2 text-xs"
          >
            <History className="size-3.5" />
            {t.inspector.historyTab} ({initialInspections.length})
          </Button>
        </div>

        {activeTab === 'queue' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpDown className="size-3.5" />
            <span>{t.inspector.sortBy}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'oldest' | 'location')}
              className="h-8 rounded-md border border-border/80 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="oldest">{t.inspector.oldest}</option>
              <option value="location">{t.inspector.locationSort}</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeTab === 'queue' && (
        <div className="flex flex-col gap-4">
          {sortedQueue.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <CheckCircle2 className="size-8 text-teal-600 dark:text-teal-400" />
                <h3 className="font-semibold text-foreground">{t.inspector.noPendingLots}</h3>
                <p className="max-w-sm text-xs text-muted-foreground">
                  {t.inspector.allVerifiedDesc}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sortedQueue.map((lot) => (
                <Card
                  key={lot.id}
                  className="border-border/60 transition-colors hover:border-teal-500/50"
                >
                  <CardContent className="flex flex-col gap-4 p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base text-foreground">
                            {getCropLabel(lot.crop_type, locale)}
                          </span>
                          <Badge className={LOT_STATUS_CLASSES[lot.status]}>
                            {getLotStatusLabel(lot.status, locale)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.farmer.lotId} #{lot.id}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {lot.quantity} {lot.unit}
                      </span>
                    </div>

                    {/* Farmer & Location Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-y border-border/40 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <User className="size-3.5 text-primary" />
                        <span className="truncate">{lot.farmer?.name ?? t.roles.farmer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary" />
                        <span className="truncate">{lot.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        <span>{t.lotDetail.harvestDateLabel}: {lot.harvest_date ? formatDate(lot.harvest_date) : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Scale className="size-3.5 text-muted-foreground" />
                        <span>{t.lotDetail.listedOnLabel}: {formatDate(lot.created_at)}</span>
                      </div>
                    </div>

                    {/* Side-by-side Quality Specs: Self-Declared vs AI Prescreen */}
                    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {t.lotDetail.digitalQualityPassport}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] text-muted-foreground">
                            {t.lotDetail.declaredTag}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {t.lotDetail.gradeLabel} {lot.ai_prescreen_grade ?? 'A'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Cpu className="size-3 text-indigo-500" /> {t.lotDetail.aiVisualPrescreen}
                          </span>
                          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {lot.ai_prescreen_score ? `${lot.ai_prescreen_score} / 100` : '90 / 100'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => openInspectionModal(lot)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2 text-xs font-semibold"
                    >
                      <ShieldCheck className="size-4" />
                      {t.inspector.conductAssayBtn}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INSPECTION HISTORY */}
      {activeTab === 'history' && (
        <Card className="border-border/60">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-semibold text-foreground">
              {t.inspector.historyTab}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {inspectorName}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {initialInspections.length === 0 ? (
                <p className="p-6 text-xs text-muted-foreground">{t.inspector.allVerifiedDesc}</p>
              ) : (
                initialInspections.map((insp) => (
                  <div
                    key={insp.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between text-xs transition-colors hover:bg-muted/20"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {getCropLabel(insp.crop_type, locale)} • {t.farmer.lotId} #{insp.lot_id}
                        </span>
                        <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 font-semibold text-xs">
                          {t.lotDetail.gradeLabel} {insp.final_grade}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs">
                        <span>{t.roles.farmer}: <strong className="text-foreground font-medium">{insp.farmer_name}</strong></span>
                        <span>{t.lotDetail.moistureLabel}: <strong className="text-foreground font-medium">{insp.moisture_pct}%</strong></span>
                        <span>{t.lotDetail.foreignMatterLabel}: <strong className="text-foreground font-medium">{insp.foreign_matter_pct}%</strong></span>
                        <span>{t.lotDetail.damagedGrainLabel}: <strong className="text-foreground font-medium">{insp.damaged_grain_pct}%</strong></span>
                      </div>

                      {insp.notes && (
                        <p className="text-xs text-muted-foreground italic mt-0.5">
                          &ldquo;{insp.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(insp.created_at)}
                      </span>
                      <Link
                        href={`/marketplace/${insp.lot_id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {t.lotDetail.digitalQualityPassport} →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* INSPECTION FORM MODAL */}
      <Dialog open={!!selectedLot} onOpenChange={(open) => !open && setSelectedLot(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="size-5" />
              <DialogTitle className="text-lg">{t.inspector.dialogTitle}</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              {t.inspector.dialogDesc}
            </DialogDescription>
          </DialogHeader>

          {selectedLot && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-2">
              {/* Evidence Banner */}
              <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground">{t.lotDetail.declaredTag}:</span>
                    <p className="font-semibold text-foreground">
                      {t.lotDetail.gradeLabel} {selectedLot.ai_prescreen_grade ?? 'A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.lotDetail.aiVisualPrescreen}:</span>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {selectedLot.ai_prescreen_score ?? 88} / 100
                    </p>
                  </div>
                </div>
              </div>

              {/* Lab Parameters */}
              <div className="flex flex-col gap-4">
                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="moisture" className="text-xs font-semibold">
                      {t.inspector.moistureInput}
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      ≤12% (Grade A) • ≤14% (Grade B)
                    </span>
                  </div>
                  <Input
                    id="moisture"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={isNaN(moisture) ? '' : moisture}
                    onChange={(e) => handleMoistureChange(e.target.value)}
                    required
                    className={`h-9 text-sm ${formErrors.moisture ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {formErrors.moisture && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{formErrors.moisture}</span>
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="foreign" className="text-xs font-semibold">
                      {t.inspector.foreignMatterInput}
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      ≤2% (Grade A) • ≤4% (Grade B)
                    </span>
                  </div>
                  <Input
                    id="foreign"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={isNaN(foreignMatter) ? '' : foreignMatter}
                    onChange={(e) => handleForeignMatterChange(e.target.value)}
                    required
                    className={`h-9 text-sm ${formErrors.foreignMatter ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {formErrors.foreignMatter && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{formErrors.foreignMatter}</span>
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="damaged" className="text-xs font-semibold">
                      {t.inspector.damagedGrainInput}
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      ≤3% (Grade A) • ≤6% (Grade B)
                    </span>
                  </div>
                  <Input
                    id="damaged"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={isNaN(damagedGrain) ? '' : damagedGrain}
                    onChange={(e) => handleDamagedGrainChange(e.target.value)}
                    required
                    className={`h-9 text-sm ${formErrors.damagedGrain ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {formErrors.damagedGrain && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{formErrors.damagedGrain}</span>
                    </p>
                  )}
                </div>

                {/* Grade Calculation Display */}
                <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50/60 p-3.5 dark:border-teal-900/50 dark:bg-teal-950/20">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-teal-900 dark:text-teal-200">
                      {t.inspector.computedGradeLabel}
                    </span>
                    <span className="text-[11px] text-teal-700/80 dark:text-teal-400">
                      {t.lotDetail.standardAgmark}
                    </span>
                  </div>
                  <Badge className="bg-teal-600 text-white font-bold text-sm px-3 py-1">
                    {t.lotDetail.gradeLabel} {liveComputedGrade}
                  </Badge>
                </div>

                {/* Grade Override Option */}
                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="override" className="text-xs font-semibold">
                      {t.inspector.computedGradeLabel} (Override)
                    </Label>
                  </div>
                  <select
                    id="override"
                    value={overrideGrade}
                    onChange={(e) => setOverrideGrade(e.target.value as Grade | '')}
                    className="h-9 rounded-md border border-border/80 bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">Grade {liveComputedGrade} ({t.lotDetail.declaredTag})</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>

                {/* Fault Notes */}
                <div className="grid gap-1.5">
                  <Label htmlFor="notes" className="text-xs font-semibold">
                    {t.inspector.notesInput}
                  </Label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-md border border-border/80 bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <DialogFooter className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLot(null)}
                  disabled={isSubmitting}
                >
                  {t.common.cancel}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5"
                >
                  {isSubmitting ? t.inspector.certifyingBtn : t.inspector.certifyBtn}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
