'use server'

import { mockStore } from '@/lib/mock-store'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function resolveFlaggedFeedback(feedbackId: string) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return { error: 'You must be signed in to perform administrative actions.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle()

  const userRole = profile?.role ?? userData.user.user_metadata?.role
  if (userRole !== 'admin') {
    return { error: 'Unauthorized: Admin role required to resolve flagged feedback.' }
  }

  const feedbacks = mockStore.getFeedback()
  const fb = feedbacks.find((f) => f.id === feedbackId)
  if (fb) {
    fb.flagged_for_review = false
    mockStore.addNotification({
      id: `notif-${Date.now()}`,
      user_id: fb.seller_id,
      title: 'Feedback Review Resolved',
      message: `Admin has reviewed and resolved the inspection alert on Order #${fb.order_id}.`,
      link: '/dashboard',
      read: false,
      type: 'admin',
      created_at: new Date().toISOString(),
    })
  }
  revalidatePath('/admin')
  return { success: true }
}
