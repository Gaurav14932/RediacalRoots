'use server'

import { createClient } from '@/lib/supabase/server'
import type { CropType } from '@/lib/types'
import { revalidatePath } from 'next/cache'

interface CreateCropLotInput {
  cropType: CropType
  quantity: number
  unit: string
  harvestDate: string | null
  location: string
  priceExpected: number
  declaredGrade?: import('@/lib/types').Grade
  aiPrescreenScore?: number
  aiPrescreenGrade?: import('@/lib/types').Grade
  images?: string[]
}

export async function createCropLot(input: CreateCropLotInput) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return { error: 'You must be signed in to list a crop.' }
  }

  if (!input.location.trim()) {
    return { error: 'Location is required.' }
  }
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    return { error: 'Quantity must be a positive number.' }
  }
  if (!Number.isFinite(input.priceExpected) || input.priceExpected <= 0) {
    return { error: 'Expected price must be a positive number.' }
  }

  const photos = input.images || []
  if (photos.length === 0) {
    return { error: 'At least 1 crop lot photo is required for quality verification.' }
  }
  if (photos.length > 10) {
    return { error: 'A maximum of 10 photos is permitted per crop lot.' }
  }

  const lotId = `lot-ind-${Date.now().toString().slice(-4)}`
  const qrCode = `RR-LOT-${input.cropType.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-3)}`
  const prescreenScore = input.aiPrescreenScore ?? (88 + Math.floor(Math.random() * 8))
  const prescreenGrade = input.aiPrescreenGrade ?? (prescreenScore >= 90 ? 'A' : 'B')
  const declaredGrade = input.declaredGrade ?? prescreenGrade

  const { error } = await supabase.from('crop_lots').insert({
    id: lotId,
    farmer_id: userData.user.id,
    fpo_id: 'usr-fpo-1',
    crop_type: input.cropType,
    quantity: input.quantity,
    unit: input.unit,
    harvest_date: input.harvestDate,
    location: input.location.trim(),
    price_expected: input.priceExpected,
    declared_grade: declaredGrade,
    ai_prescreen_score: prescreenScore,
    ai_prescreen_grade: prescreenGrade,
    photos: photos,
    photo_count: photos.length,
    status: 'listed',
    qr_code: qrCode,
    is_aggregated: false,
    created_at: new Date().toISOString(),
    farmer: {
      id: userData.user.id,
      name: (userData.user.user_metadata?.name as string) ?? 'Ramesh Patil',
      location: input.location.trim(),
    },
  })

  if (error) {
    console.error('[v0] createCropLot error:', error.message)
    return { error: 'Unable to list your crop. Please try again.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/marketplace')
  revalidatePath('/inspector')

  return { success: true, lotId }
}
