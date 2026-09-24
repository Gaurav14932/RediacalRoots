'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface PlaceOrderInput {
  lotId: string
  quantity: number
  priceAgreed: number
}

export async function placeOrder(input: PlaceOrderInput) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return { error: 'You must be signed in to place an order.' }
  }

  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    return { error: 'Quantity must be a positive number.' }
  }

  const { data: lot, error: lotError } = await supabase
    .from('crop_lots')
    .select('id, quantity, price_expected, farmer_id, status')
    .eq('id', input.lotId)
    .maybeSingle()

  if (lotError || !lot) {
    return { error: 'This crop lot is no longer available.' }
  }

  if (lot.farmer_id === userData.user.id) {
    return { error: 'You cannot order your own crop lot.' }
  }

  if (!['listed', 'under_verification', 'verified'].includes(lot.status)) {
    return { error: 'This crop lot is no longer available for order.' }
  }

  if (input.quantity > Number(lot.quantity)) {
    return { error: `Only ${lot.quantity} available for this lot.` }
  }

  const { error } = await supabase.from('orders').insert({
    id: `ord-${Date.now()}`,
    buyer_id: userData.user.id,
    lot_id: lot.id,
    quantity: input.quantity,
    price_agreed: lot.price_expected,
    status: 'pending',
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error('[v0] placeOrder error:', error.message)
    return { error: 'Unable to place your order. Please try again.' }
  }

  revalidatePath('/marketplace')
  revalidatePath('/orders')
  revalidatePath('/dashboard')

  return { success: true }
}
