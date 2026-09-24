'use server'

import { mockStore } from '@/lib/mock-store'
import type { Feedback } from '@/lib/types'
import { revalidatePath } from 'next/cache'

interface SubmitFeedbackInput {
  orderId: string
  lotId: string
  buyerId: string
  buyerName: string
  sellerId: string
  rating: number
  comment: string
}

export async function submitOrderFeedback(input: SubmitFeedbackInput) {
  if (input.rating < 1 || input.rating > 5) {
    return { error: 'Rating must be between 1 and 5 stars' }
  }

  const isFlagged = input.rating <= 2

  const feedbackItem: Feedback = {
    id: `fb-${Date.now()}`,
    order_id: input.orderId,
    lot_id: input.lotId,
    buyer_id: input.buyerId,
    buyer_name: input.buyerName,
    seller_id: input.sellerId,
    rating: input.rating,
    comment: input.comment,
    flagged_for_review: isFlagged,
    created_at: new Date().toISOString(),
  }

  // 1. Store feedback
  mockStore.addFeedback(feedbackItem)

  // 2. If flagged (rating <= 2), alert Admin
  if (isFlagged) {
    mockStore.addNotification({
      id: `notif-${Date.now()}-flag`,
      user_id: 'usr-admin-1',
      title: 'Quality Alert: Rating Flagged (≤2 Stars)',
      message: `Order #${input.orderId} received a ${input.rating}-star review from ${input.buyerName}: "${input.comment}". Flagged for administrative review.`,
      link: '/admin',
      read: false,
      type: 'admin',
      created_at: new Date().toISOString(),
    })
  }

  // 3. Notify seller (Farmer or FPO)
  mockStore.addNotification({
    id: `notif-${Date.now()}-seller`,
    user_id: input.sellerId,
    title: 'New Buyer Feedback Received',
    message: `${input.buyerName} rated your crop order ${input.rating} stars: "${input.comment || 'Verified purchase'}"`,
    link: '/dashboard',
    read: false,
    type: 'feedback',
    created_at: new Date().toISOString(),
  })

  // Revalidate pages
  revalidatePath('/orders')
  revalidatePath(`/orders/${input.orderId}`)
  revalidatePath('/marketplace')
  revalidatePath(`/marketplace/${input.lotId}`)
  revalidatePath('/dashboard')
  revalidatePath('/admin')

  return { success: true, feedback: feedbackItem }
}
