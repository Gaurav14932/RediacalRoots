'use server'

import { createClient } from '@/lib/supabase/server'
import type { Grade } from '@/lib/types'
import { revalidatePath } from 'next/cache'

interface CreateAggregatedLotInput {
  cropType: string
  grade: Grade | null
  totalQuantity: number
  unit: string
  priceExpected: number
  location: string
  contributingLotIds: string[]
}

export async function createAggregatedLot(input: CreateAggregatedLotInput) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return { error: 'You must be signed in to create an aggregated lot.' }
  }

  // Get profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, fpo_id')
    .eq('id', userData.user.id)
    .maybeSingle()

  const userRole = profile?.role ?? userData.user.user_metadata?.role
  if (userRole !== 'fpo' && userRole !== 'admin') {
    return { error: 'Unauthorized: Only FPO Managers can create aggregated lots.' }
  }

  if (input.contributingLotIds.length < 2) {
    return { error: 'Select at least 2 lots to aggregate.' }
  }

  if (!Number.isFinite(input.totalQuantity) || input.totalQuantity <= 0) {
    return { error: 'Total quantity must be a positive number.' }
  }

  // Fetch the contributing lots to validate compatibility
  const { data: lots, error: lotsError } = await supabase
    .from('crop_lots')
    .select('id, farmer_id, crop_type, final_grade, ai_prescreen_grade, quantity, unit, location, status, is_aggregated, parent_lot_id')
    .in('id', input.contributingLotIds)

  if (lotsError || !lots || lots.length !== input.contributingLotIds.length) {
    return { error: 'One or more selected lots could not be found.' }
  }

  // Validate lots have NOT already been aggregated (no double-aggregation)
  const alreadyAggregated = (lots as Array<{ is_aggregated?: boolean; parent_lot_id?: string; status?: string; id: string }>).filter(
    (l) => l.is_aggregated || l.parent_lot_id || l.status === 'aggregated',
  )
  if (alreadyAggregated.length > 0) {
    return {
      error: `Double aggregation prevented: Lot #${alreadyAggregated[0].id} has already been merged into an aggregated lot and cannot be re-aggregated.`,
    }
  }

  // Validate all lots are the same crop type
  const cropTypes = new Set((lots as Array<{ crop_type: string }>).map((l) => l.crop_type))
  if (cropTypes.size > 1) {
    return { error: 'All lots must be the same crop type to aggregate.' }
  }

  // Validate lots are in listable status
  const invalidLots = (lots as Array<{ status: string }>).filter(
    (l) => !['listed', 'under_verification', 'verified'].includes(l.status),
  )
  if (invalidLots.length > 0) {
    return { error: 'Some selected lots are not in a listable status.' }
  }

  // Create the aggregated parent lot
  const { data: newLot, error: insertError } = await supabase
    .from('crop_lots')
    .insert({
      farmer_id: userData.user.id,
      fpo_id: profile?.fpo_id ?? userData.user.id,
      crop_type: input.cropType,
      quantity: input.totalQuantity,
      unit: input.unit,
      location: input.location.trim(),
      price_expected: input.priceExpected,
      status: 'listed',
      is_aggregated: true,
      contributing_lots_count: input.contributingLotIds.length,
      final_grade: input.grade,
    })
    .select('id')
    .single()

  if (insertError || !newLot) {
    console.error('[fpo-actions] createAggregatedLot insert error:', insertError?.message)
    return { error: 'Unable to create the aggregated lot. Please try again.' }
  }

  // Record traceability contributions
  const contributions = (lots as Array<Record<string, unknown>>).map((lot) => ({
    aggregated_lot_id: newLot.id,
    original_lot_id: lot.id as string,
    farmer_id: lot.farmer_id as string,
    farmer_name: 'Farmer', // Will be resolved at display time via join
    location: lot.location as string,
    quantity: Number(lot.quantity),
    unit: lot.unit as string,
    grade: (lot.final_grade ?? lot.ai_prescreen_grade) as import('@/lib/types').Grade | null,
  }))

  // Insert contributions (best-effort — non-blocking if table doesn't exist yet)
  try {
    await supabase.from('aggregated_lot_contributions').insert(contributions)
  } catch {
    // Table may not exist in all environments; silently continue
  }

  // Mark contributing lots as aggregated
  const { error: updateError } = await supabase
    .from('crop_lots')
    .update({ status: 'aggregated', parent_lot_id: newLot.id })
    .in('id', input.contributingLotIds)

  if (updateError) {
    console.error('[fpo-actions] updateContributingLots error:', updateError.message)
  }

  revalidatePath('/dashboard')
  revalidatePath('/marketplace')

  return { success: true, lotId: newLot.id }
}
