'use server'

import { mockStore } from '@/lib/mock-store'
import { revalidatePath } from 'next/cache'

export async function markAsRead(id: string) {
  mockStore.markNotificationAsRead(id)
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function markAllAsRead(userId?: string) {
  mockStore.markAllNotificationsAsRead(userId)
  revalidatePath('/', 'layout')
  return { success: true }
}
