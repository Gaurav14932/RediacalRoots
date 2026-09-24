import type { CropType, LotStatus, OrderStatus, UserRole, DeliveryStopStatus } from '@/lib/types'

export const CROP_LABELS: Record<CropType, string> = {
  soybean: 'Soybean',
  tur: 'Tur (Pigeon Pea)',
  wheat: 'Wheat',
  chana: 'Chana (Chickpea)',
  watermelon: 'Watermelon',
  kharbuja: 'Kharbuja (Muskmelon)',
  onion: 'Onion',
}

export const LOT_STATUS_LABELS: Record<LotStatus, string> = {
  listed: 'Listed',
  under_verification: 'Under Verification',
  verified: 'Verified',
  sold: 'Sold',
  delivered: 'Delivered',
  paid: 'Paid',
  aggregated: 'Aggregated',
}

export const LOT_STATUS_CLASSES: Record<LotStatus, string> = {
  listed: 'bg-secondary text-secondary-foreground border border-border/80',
  under_verification: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  verified: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  sold: 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  delivered: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  paid: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  aggregated: 'bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  invoiced: 'Invoiced',
  paid: 'Paid',
  scheduled: 'Scheduled',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-secondary text-secondary-foreground border border-border/80',
  confirmed: 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  invoiced: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  paid: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  scheduled: 'bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  picked_up: 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
  in_transit: 'bg-orange-100 text-orange-700 border border-orange-300 dark:bg-orange-900/30 dark:text-orange-300',
  delivered: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  completed: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  cancelled: 'bg-destructive/15 text-destructive border border-destructive/30',
}

export const DELIVERY_STOP_STATUS_LABELS: Record<DeliveryStopStatus, string> = {
  pending: 'Pending',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
}

export const DELIVERY_STOP_STATUS_CLASSES: Record<DeliveryStopStatus, string> = {
  pending: 'bg-secondary text-secondary-foreground border border-border/80',
  picked_up: 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
  in_transit: 'bg-orange-100 text-orange-700 border border-orange-300 dark:bg-orange-900/30 dark:text-orange-300',
  delivered: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  farmer: 'Farmer',
  buyer: 'Buyer',
  logistics: 'Logistics Partner',
  inspector: 'Inspector',
  admin: 'Admin',
  fpo: 'FPO Manager',
}

export const UNITS = ['quintal', 'kg', 'tonne'] as const

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString?: string | null | Date): string {
  if (!dateString) return '—'
  const date = dateString instanceof Date ? dateString : new Date(dateString)
  if (isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatTime(dateString?: string | null | Date): string {
  if (!dateString) return ''
  const date = dateString instanceof Date ? dateString : new Date(dateString)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Geographic coordinates for major Indian APMC mandis
export const MANDI_LOCATIONS: Record<string, { lat: number; lng: number; district: string; state: string }> = {
  'Nashik': { lat: 20.0059, lng: 73.7898, district: 'Nashik', state: 'Maharashtra' },
  'Lasalgaon': { lat: 20.1156, lng: 74.0856, district: 'Nashik', state: 'Maharashtra' },
  'Pune': { lat: 18.5204, lng: 73.8567, district: 'Pune', state: 'Maharashtra' },
  'Latur': { lat: 18.4088, lng: 76.5604, district: 'Latur', state: 'Maharashtra' },
  'Akola': { lat: 20.7002, lng: 77.0082, district: 'Akola', state: 'Maharashtra' },
  'Nagpur': { lat: 21.1458, lng: 79.0882, district: 'Nagpur', state: 'Maharashtra' },
}

export const DEMO_ROLE_LOCATIONS: Record<UserRole, string> = {
  farmer: 'Nashik, Maharashtra',
  fpo: 'Nashik, Maharashtra',
  buyer: 'Pune, Maharashtra',
  logistics: 'Nashik, Maharashtra',
  inspector: 'Nagpur, Maharashtra',
  admin: 'Mumbai, Maharashtra',
}
