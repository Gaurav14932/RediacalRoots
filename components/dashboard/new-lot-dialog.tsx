'use client'

import { createCropLot } from '@/app/dashboard/actions'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CROP_LABELS, UNITS } from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel } from '@/lib/i18n/translations'
import type { CropType, Grade } from '@/lib/types'
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Info,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { predictQualityWithFallback } from '@/lib/ai-services'

interface PhotoItem {
  id: string
  name: string
  previewUrl: string
  sizeKb: number
}

const MAX_PHOTOS = 10
const RECOMMENDED_MIN = 3
const RECOMMENDED_MAX = 5

export function NewLotDialog() {
  const { t, locale } = useI18n()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cropType, setCropType] = useState<CropType>('soybean')
  const [unit, setUnit] = useState('quintal')
  const [quantity, setQuantity] = useState('')
  const [priceExpected, setPriceExpected] = useState('')
  const [location, setLocation] = useState('')
  const [harvestDate, setHarvestDate] = useState('')
  const [selfGrade, setSelfGrade] = useState<Grade>('A')
  
  // Multi-photo state
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [aiPrescreenDone, setAiPrescreenDone] = useState(false)
  const [aiScore, setAiScore] = useState<number>(92)
  const [isPrescreening, setIsPrescreening] = useState(false)
  const [isFallbackMode, setIsFallbackMode] = useState(false)
  const [faultFlags, setFaultFlags] = useState<string[]>([])
  const [moistureEst, setMoistureEst] = useState<number>(11.4)
  const [uniformityEst, setUniformityEst] = useState<number>(96.5)
  const [formErrors, setFormErrors] = useState<{
    quantity?: string
    priceExpected?: string
    location?: string
    photos?: string
  }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const resetForm = () => {
    setCropType('soybean')
    setUnit('quintal')
    setQuantity('')
    setPriceExpected('')
    setLocation('')
    setHarvestDate('')
    setSelfGrade('A')
    setPhotos([])
    setAiPrescreenDone(false)
    setAiScore(92)
    setIsFallbackMode(false)
    setFaultFlags([])
    setMoistureEst(11.4)
    setUniformityEst(96.5)
    setFormErrors({})
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const selectedFiles = Array.from(e.target.files)
    const availableSlots = MAX_PHOTOS - photos.length

    if (availableSlots <= 0) {
      toast.error(`Maximum ${MAX_PHOTOS} photos allowed per crop lot.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const filesToAdd = selectedFiles.slice(0, availableSlots)
    if (selectedFiles.length > availableSlots) {
      toast.warning(`Only ${availableSlots} slots were available. Added ${availableSlots} photos.`)
    }

    const newPhotoItems: PhotoItem[] = filesToAdd.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      sizeKb: Math.round(file.size / 1024),
    }))

    const updatedPhotos = [...photos, ...newPhotoItems]
    setPhotos(updatedPhotos)

    // Run multi-photo AI vision analysis via Supabase Edge Function / External Python AI
    triggerMultiImageAiPrescreen(updatedPhotos)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemovePhoto = (idToRemove: string) => {
    const updated = photos.filter((p) => p.id !== idToRemove)
    setPhotos(updated)
    if (updated.length > 0) {
      triggerMultiImageAiPrescreen(updated)
    } else {
      setAiPrescreenDone(false)
    }
  }

  const triggerMultiImageAiPrescreen = async (currentPhotos: PhotoItem[]) => {
    setIsPrescreening(true)
    try {
      const urls = currentPhotos.map((p) => p.previewUrl)
      const res = await predictQualityWithFallback(urls, cropType)
      setAiScore(res.score)
      setIsFallbackMode(res.isFallback)
      setFaultFlags(res.faultFlags)
      setMoistureEst(res.moistureEst)
      setUniformityEst(res.uniformityEst)
      setAiPrescreenDone(true)

      if (res.isFallback) {
        toast.info(
          `AI analyzed ${currentPhotos.length} photo${currentPhotos.length > 1 ? 's' : ''} (estimated offline mode: ${res.score}%)`,
        )
      } else {
        toast.success(
          `AI Vision Pre-Screen scored ${currentPhotos.length} photo${currentPhotos.length > 1 ? 's' : ''}: ${res.score}%${res.faultFlags.length ? ` (Flags: ${res.faultFlags.join(', ')})` : ' (No faults detected)'}`,
        )
      }
    } catch {
      setIsFallbackMode(true)
      setAiScore(91)
      setAiPrescreenDone(true)
    } finally {
      setIsPrescreening(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: typeof formErrors = {}
    const parsedQty = Number.parseFloat(quantity)
    if (!quantity || !Number.isFinite(parsedQty) || parsedQty <= 0) {
      errors.quantity = 'Quantity must be a positive number greater than 0.'
    }
    const parsedPrice = Number.parseFloat(priceExpected)
    if (!priceExpected || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      errors.priceExpected = 'Expected price must be a positive number greater than 0.'
    }
    if (!location.trim()) {
      errors.location = 'Pickup location is required for logistics planning.'
    }
    if (photos.length === 0) {
      errors.photos = 'Minimum 1 crop photo is required for quality verification.'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.error('Please fix the highlighted form errors.')
      return
    }

    setFormErrors({})
    setIsLoading(true)

    const result = await createCropLot({
      cropType,
      quantity: parsedQty,
      unit,
      harvestDate: harvestDate || null,
      location: location.trim(),
      priceExpected: parsedPrice,
      declaredGrade: selfGrade,
      aiPrescreenScore: aiScore,
      aiPrescreenGrade: aiScore >= 90 ? 'A' : 'B',
      images: photos.map((p) => p.previewUrl),
    })

    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(t.newLot.successToast)
    resetForm()
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm">
            <Plus className="size-4" />
            {t.farmer.addLotBtn}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t.newLot.modalTitle}</DialogTitle>
            <DialogDescription>{t.newLot.modalDesc}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 text-xs">
            {/* Crop Selector */}
            <div className="grid gap-1.5">
              <Label className="text-xs">{t.newLot.cropType}</Label>
              <Select
                value={cropType}
                onValueChange={(value) => setCropType(value as CropType)}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CROP_LABELS).map((value) => (
                    <SelectItem key={value} value={value}>
                      {getCropLabel(value as CropType, locale)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="quantity" className="text-xs">
                  {t.newLot.quantity}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value)
                    if (formErrors.quantity) setFormErrors((p) => ({ ...p, quantity: undefined }))
                  }}
                  placeholder="e.g. 100"
                  className={`h-9 ${formErrors.quantity ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {formErrors.quantity && (
                  <p className="text-[11px] text-destructive font-medium">{formErrors.quantity}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">{t.newLot.unit}</Label>
                <Select
                  value={unit}
                  onValueChange={(v) => {
                    if (v !== null) setUnit(v)
                  }}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="price" className="text-xs">
                  {t.newLot.expectedPrice} / {unit}
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={priceExpected}
                  onChange={(e) => {
                    setPriceExpected(e.target.value)
                    if (formErrors.priceExpected) setFormErrors((p) => ({ ...p, priceExpected: undefined }))
                  }}
                  placeholder="e.g. 4600"
                  className={`h-9 ${formErrors.priceExpected ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {formErrors.priceExpected && (
                  <p className="text-[11px] text-destructive font-medium">{formErrors.priceExpected}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="location" className="text-xs">
                  {t.newLot.pickupLocation}
                </Label>
                <Input
                  id="location"
                  required
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    if (formErrors.location) setFormErrors((p) => ({ ...p, location: undefined }))
                  }}
                  placeholder="e.g. Nashik, Maharashtra"
                  className={`h-9 ${formErrors.location ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {formErrors.location && (
                  <p className="text-[11px] text-destructive font-medium">{formErrors.location}</p>
                )}
              </div>
            </div>

            {/* Harvest Date & Declared Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="harvest-date" className="text-xs">
                  {t.newLot.harvestDate}
                </Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">{t.newLot.selfGrade}</Label>
                <Select
                  value={selfGrade}
                  onValueChange={(v) => {
                    if (v) setSelfGrade(v as Grade)
                  }}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">{t.newLot.gradeA}</SelectItem>
                    <SelectItem value="B">{t.newLot.gradeB}</SelectItem>
                    <SelectItem value="C">{t.newLot.gradeC}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Multi-Photo Upload & AI Pre-Screen Section */}
            <div className="rounded-lg border border-border/80 bg-muted/30 p-3.5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                  <Camera className="size-4 text-primary" />
                  {t.newLot.photoSectionTitle}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    photos.length === 0
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                      : photos.length >= RECOMMENDED_MIN
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-primary/10 text-primary'
                  }`}
                >
                  {photos.length} / {MAX_PHOTOS} {t.newLot.photosCount}
                </span>
              </div>

              {/* Recommendation and Requirement Helper */}
              <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5 text-[11px] text-muted-foreground flex gap-2 items-start">
                <Info className="size-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">
                    {t.newLot.minPhotosNotice}
                  </p>
                  <p className="text-muted-foreground">
                    {t.newLot.recommendedPhotosNotice}
                  </p>
                </div>
              </div>

              {/* Upload Action */}
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="crop-multi-photo-input"
                  disabled={photos.length >= MAX_PHOTOS}
                />
                <label
                  htmlFor="crop-multi-photo-input"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed text-xs font-medium cursor-pointer transition-colors ${
                    photos.length >= MAX_PHOTOS
                      ? 'border-muted-foreground/30 bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                      : 'border-primary/50 bg-primary/5 hover:bg-primary/10 text-primary'
                  }`}
                >
                  <Upload className="size-3.5" />
                  <span>
                    {photos.length === 0 ? t.newLot.uploadPhotosBtn : t.newLot.uploadMoreBtn}
                  </span>
                </label>

                {photos.length < MAX_PHOTOS && (
                  <span className="text-[11px] text-muted-foreground">
                    ({MAX_PHOTOS - photos.length} {t.newLot.slotsRemaining})
                  </span>
                )}
                {photos.length >= MAX_PHOTOS && (
                  <span className="text-[11px] text-amber-600 font-medium">
                    {t.newLot.maxPhotosReached}
                  </span>
                )}
              </div>

              {/* Thumbnail Grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-1">
                  {photos.map((item, index) => (
                    <div
                      key={item.id}
                      className="group relative rounded-md border border-border/80 overflow-hidden bg-background aspect-square shadow-2xs flex flex-col"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.previewUrl}
                        alt={`Harvest photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(item.id)}
                          className="rounded-full bg-rose-600 p-1 text-white hover:bg-rose-700 transition-colors shadow"
                          title="Remove photo"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white px-1 rounded">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Multi-Image AI Pre-Screen Results */}
              {isPrescreening ? (
                <div className="rounded bg-primary/5 border border-primary/20 p-2 text-xs text-primary flex items-center gap-2">
                  <Sparkles className="size-3.5 animate-spin" />
                  <span>{t.newLot.simulatingAi}</span>
                </div>
              ) : aiPrescreenDone && photos.length > 0 ? (
                <div className="rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 text-[11px] text-emerald-800 dark:text-emerald-300 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-semibold text-xs">
                        Multi-Photo AI Quality Score: {aiScore}%
                      </span>
                      {isFallbackMode && (
                        <span className="text-[10px] font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded border border-amber-300/60 dark:border-amber-700/60">
                          estimated (offline mode)
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full shrink-0">
                      {t.newLot.readyForInspection}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>• Analyzed {photos.length} angle{photos.length > 1 ? 's' : ''}</span>
                    <span>• Est. Moisture: {moistureEst}%</span>
                    <span>• Grain Uniformity: {uniformityEst}%</span>
                    <span>• Suggested: Grade {aiScore >= 90 ? 'A' : 'B'}</span>
                    {faultFlags.length > 0 && (
                      <span className="text-amber-700 dark:text-amber-300 font-medium">
                        • Flags: {faultFlags.map((f) => f.replace(/_/g, ' ')).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ) : photos.length === 0 ? (
                <div className="rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-2 text-[11px] text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>{t.newLot.minPhotosNotice}</span>
                </div>
              ) : null}
              {formErrors.photos && (
                <p className="text-[11px] text-destructive font-medium mt-1">{formErrors.photos}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              size="sm"
            >
              {t.newLot.cancelBtn}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || photos.length === 0}
              size="sm"
              className="font-semibold"
            >
              {isLoading ? t.newLot.submittingBtn : t.newLot.submitBtn}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
