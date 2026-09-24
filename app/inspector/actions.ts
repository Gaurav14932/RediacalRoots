'use server'

import { mockStore } from '@/lib/mock-store'
import type { Grade } from '@/lib/types'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { computeGrade } from '@/lib/quality-calculator'

interface SubmitInspectionInput {
  lotId: string
  inspectorId: string
  inspectorName: string
  moisturePct: number
  foreignMatterPct: number
  damagedGrainPct: number
  overrideGrade?: Grade | null
  notes?: string
}

export async function submitInspection(input: SubmitInspectionInput) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return { error: 'You must be signed in to submit an inspection report.' }
  }

  // Check role authorization
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle()

  const userRole = profile?.role ?? userData.user.user_metadata?.role
  if (userRole !== 'inspector' && userRole !== 'admin') {
    return { error: 'Unauthorized: Only certified Quality Inspectors can verify lots.' }
  }

  // Validate numeric parameters
  if (
    !Number.isFinite(input.moisturePct) ||
    !Number.isFinite(input.foreignMatterPct) ||
    !Number.isFinite(input.damagedGrainPct)
  ) {
    return { error: 'All lab metrics must be valid numeric values.' }
  }

  if (input.moisturePct < 0 || input.foreignMatterPct < 0 || input.damagedGrainPct < 0) {
    return { error: 'Lab metrics cannot be negative.' }
  }

  if (input.moisturePct > 100 || input.foreignMatterPct > 100 || input.damagedGrainPct > 100) {
    return { error: 'Lab metrics percentages cannot exceed 100%.' }
  }

  const lot = mockStore.getLotById(input.lotId)
  if (!lot) {
    return { error: 'Crop lot not found' }
  }

  // Calculate grade based on physical laboratory parameters
  const calculatedGrade = computeGrade(
    input.moisturePct,
    input.foreignMatterPct,
    input.damagedGrainPct,
  )
  const finalGrade = input.overrideGrade ?? calculatedGrade

  // 1. Update the crop lot status to verified with new metrics
  mockStore.updateLot(input.lotId, {
    status: 'verified',
    inspector_grade: finalGrade,
    final_grade: finalGrade,
    moisture_pct: input.moisturePct,
    foreign_matter_pct: input.foreignMatterPct,
    damaged_grain_pct: input.damagedGrainPct,
    inspection_notes: input.notes ?? null,
  })

  // 2. Record the physical inspection audit trail
  const inspectionId = `insp-${Date.now()}`
  mockStore.addInspection({
    id: inspectionId,
    lot_id: lot.id,
    crop_type: lot.crop_type,
    inspector_id: input.inspectorId,
    inspector_name: input.inspectorName,
    farmer_id: lot.farmer_id,
    farmer_name: lot.farmer?.name ?? 'Farmer',
    moisture_pct: input.moisturePct,
    foreign_matter_pct: input.foreignMatterPct,
    damaged_grain_pct: input.damagedGrainPct,
    declared_grade: lot.ai_prescreen_grade,
    ai_score: lot.ai_prescreen_score,
    final_grade: finalGrade,
    notes: input.notes ?? null,
    created_at: new Date().toISOString(),
  })

  // 3. Trigger notification for the farmer
  mockStore.addNotification({
    id: `notif-${Date.now()}-1`,
    user_id: lot.farmer_id,
    title: 'Lot Verified by APMC Inspector',
    message: `Your ${lot.crop_type.toUpperCase()} lot #${lot.id} has been physically verified as Grade ${finalGrade} by ${input.inspectorName}.`,
    link: `/marketplace/${lot.id}`,
    read: false,
    type: 'inspection',
    created_at: new Date().toISOString(),
  })

  // 4. Trigger notification for the admin operations log
  mockStore.addNotification({
    id: `notif-${Date.now()}-2`,
    user_id: 'usr-admin-1',
    title: 'Quality Verification Completed',
    message: `Lot #${lot.id} (${lot.crop_type}) inspected and certified as Grade ${finalGrade}.`,
    link: '/admin',
    read: false,
    type: 'admin',
    created_at: new Date().toISOString(),
  })

  // Revalidate relevant pages
  revalidatePath('/inspector')
  revalidatePath('/marketplace')
  revalidatePath(`/marketplace/${lot.id}`)
  revalidatePath('/dashboard')
  revalidatePath('/admin')

  return { success: true, finalGrade }
}
