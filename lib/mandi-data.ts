/**
 * Mandi Price Data Layer
 *
 * Provides mock daily price data for all 7 crops across major APMC mandis.
 * Structure is designed to be replaced by a real e-NAM API feed without changing
 * the UI: simply swap getMandiPrices() to call the real endpoint.
 *
 * e-NAM API shape: https://www.enam.gov.in/web/API
 * Expected response fields map to MandiPrice interface.
 */

import type { CropType, MandiPrice, PriceTrend, SellingWindowSignal, SellingWindowSuggestion } from '@/lib/types'
import { CROP_LABELS } from '@/lib/constants'

// Base modal prices per crop (INR/quintal) — realistic MSP-adjacent figures
const BASE_PRICES: Record<CropType, number> = {
  soybean: 4600,
  tur: 7000,
  wheat: 2275,
  chana: 5440,
  watermelon: 800,
  kharbuja: 1200,
  onion: 1800,
}

// Seasonal volatility factor per crop (std deviation fraction)
const VOLATILITY: Record<CropType, number> = {
  soybean: 0.04,
  tur: 0.05,
  wheat: 0.02,
  chana: 0.04,
  watermelon: 0.10,
  kharbuja: 0.09,
  onion: 0.12,
}

const MANDIS = ['Nashik', 'Lasalgaon', 'Pune', 'Latur', 'Akola', 'Nagpur']

const MANDI_METADATA: Record<string, { district: string; state: string }> = {
  Nashik: { district: 'Nashik', state: 'Maharashtra' },
  Lasalgaon: { district: 'Nashik', state: 'Maharashtra' },
  Pune: { district: 'Pune', state: 'Maharashtra' },
  Latur: { district: 'Latur', state: 'Maharashtra' },
  Akola: { district: 'Akola', state: 'Maharashtra' },
  Nagpur: { district: 'Nagpur', state: 'Maharashtra' },
}

// Deterministic pseudo-random seeded by date string + crop + mandi
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return (Math.abs(hash) % 10000) / 10000
}

function generateDayPrices(crop: CropType, mandiName: string, date: string): {
  min: number; max: number; modal: number; quantity: number
} {
  const base = BASE_PRICES[crop]
  const vol = VOLATILITY[crop]
  const r1 = seededRandom(`${date}-${crop}-${mandiName}-min`)
  const r2 = seededRandom(`${date}-${crop}-${mandiName}-modal`)
  const r3 = seededRandom(`${date}-${crop}-${mandiName}-max`)

  // Build a gentle 30-day trend (+/- 8% drift)
  const dayIndex = getDayIndex(date)
  const trendFactor = 1 + (Math.sin(dayIndex * 0.12) * 0.04) + (dayIndex * 0.001)

  const modal = Math.round(base * trendFactor * (1 + (r2 - 0.5) * vol * 2))
  const spread = Math.round(base * vol * 0.5)
  const min = Math.round(modal - spread * (0.3 + r1 * 0.7))
  const max = Math.round(modal + spread * (0.3 + r3 * 0.7))
  const quantity = Math.round(50 + seededRandom(`${date}-${crop}-${mandiName}-qty`) * 450)

  return { min, max, modal, quantity }
}

function getDayIndex(dateStr: string): number {
  const refDate = new Date('2026-08-25')
  const d = new Date(dateStr)
  return Math.floor((d.getTime() - refDate.getTime()) / 86400000)
}

function generateDateRange(days: number): string[] {
  const dates: string[] = []
  // Use a fixed reference date relative to the mock "today" of 2026-09-24
  const today = new Date('2026-09-24')
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    // Skip weekends (mandis typically close on Sundays)
    if (d.getDay() === 0) continue
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

let _cache: MandiPrice[] | null = null
let _lastSyncTimestamp: string = '2026-09-24T14:30:00Z'

export function getLastMandiSyncTimestamp(): string {
  return _lastSyncTimestamp
}

export function setSyncedMandiPrices(records: MandiPrice[], timestamp?: string): void {
  const current = getAllMockMandiPrices()
  const map = new Map<string, MandiPrice>()
  for (const r of current) {
    map.set(`${r.crop_type}-${r.mandi_name}-${r.date}`, r)
  }
  for (const r of records) {
    map.set(`${r.crop_type}-${r.mandi_name}-${r.date}`, r)
  }
  _cache = Array.from(map.values())
  _lastSyncTimestamp = timestamp || new Date().toISOString()
}

function getAllMockMandiPrices(): MandiPrice[] {
  if (_cache) return _cache

  const prices: MandiPrice[] = []
  const dates = generateDateRange(30)
  const crops: CropType[] = ['soybean', 'tur', 'wheat', 'chana', 'watermelon', 'kharbuja', 'onion']

  let idCounter = 1
  for (const date of dates) {
    for (const crop of crops) {
      for (const mandi of MANDIS) {
        const { min, max, modal, quantity } = generateDayPrices(crop, mandi, date)
        const meta = MANDI_METADATA[mandi]
        prices.push({
          id: String(idCounter++),
          crop_type: crop,
          mandi_name: mandi,
          state: meta.state,
          district: meta.district,
          min_price: min,
          max_price: max,
          modal_price: modal,
          arrival_quantity_tonnes: quantity,
          date,
        })
      }
    }
  }

  _cache = prices
  return prices
}

/**
 * Fetch mandi prices — structured for plug-and-play e-NAM API replacement.
 *
 * To connect a real e-NAM feed, replace the body of this function with:
 *   const res = await fetch(`https://api.enam.gov.in/...?commodity=${crop}&mandi=${mandi}&from=${from}&to=${to}`)
 *   return res.json().records.map(mapENAMRecord)
 */
export function getMandiPrices({
  crop,
  mandi,
  days = 30,
}: {
  crop?: CropType
  mandi?: string
  days?: number
}): MandiPrice[] {
  const all = getAllMockMandiPrices()
  const cutoff = generateDateRange(days)[0]

  return all.filter((p) => {
    if (crop && p.crop_type !== crop) return false
    if (mandi && p.mandi_name !== mandi) return false
    if (p.date < cutoff) return false
    return true
  })
}

export function getLatestPrices(crop: CropType): MandiPrice[] {
  const all = getAllMockMandiPrices()
  const latest: Record<string, MandiPrice> = {}
  for (const p of all) {
    if (p.crop_type !== crop) continue
    const key = p.mandi_name
    if (!latest[key] || p.date > latest[key].date) {
      latest[key] = p
    }
  }
  return Object.values(latest)
}

export function getPriceTrend(crop: CropType, mandi = 'Nashik'): PriceTrend {
  const prices30 = getMandiPrices({ crop, mandi, days: 30 })
  const prices7 = getMandiPrices({ crop, mandi, days: 7 })

  if (!prices30.length || !prices7.length) {
    return { direction: 'stable', percent7d: 0, percent30d: 0, current: BASE_PRICES[crop], high30d: BASE_PRICES[crop], low30d: BASE_PRICES[crop] }
  }

  const sorted30 = [...prices30].sort((a, b) => a.date.localeCompare(b.date))
  const sorted7 = [...prices7].sort((a, b) => a.date.localeCompare(b.date))

  const current = sorted30[sorted30.length - 1].modal_price
  const start30 = sorted30[0].modal_price
  const start7 = sorted7[0].modal_price
  const high30d = Math.max(...sorted30.map((p) => p.max_price))
  const low30d = Math.min(...sorted30.map((p) => p.min_price))

  const percent30d = ((current - start30) / start30) * 100
  const percent7d = ((current - start7) / start7) * 100

  let direction: 'up' | 'down' | 'stable' = 'stable'
  if (percent7d > 1.5) direction = 'up'
  else if (percent7d < -1.5) direction = 'down'

  return { direction, percent7d, percent30d, current, high30d, low30d }
}

/**
 * Rule-based selling window suggestion.
 * Modular: replace this function with an external API call (e.g. forecasting model endpoint)
 * without changing the component interface — just swap the implementation.
 */
export function calculateSellingWindow(
  cropType: CropType,
  mandi = 'Nashik',
): SellingWindowSuggestion {
  const trend = getPriceTrend(cropType, mandi)
  const cropLabel = CROP_LABELS[cropType]

  let signal: SellingWindowSignal
  let headline: string
  let detail: string

  if (trend.direction === 'up' && trend.percent7d > 3) {
    signal = 'hold'
    headline = `Prices trending up +${trend.percent7d.toFixed(1)}% — consider holding`
    detail = `${cropLabel} modal rates in ${mandi} have risen ${trend.percent7d.toFixed(1)}% over the past 7 days. Historical pattern suggests continued strength. Estimate is not a guarantee.`
  } else if (trend.direction === 'up' && trend.percent7d <= 3) {
    signal = 'sell'
    headline = `Prices at recent peak — good time to sell`
    detail = `${cropLabel} rates are near a 30-day high (₹${trend.high30d.toLocaleString('en-IN')}/qtl). Moderate upward trend may have peaked. Estimate is not a guarantee.`
  } else if (trend.direction === 'down' && trend.percent7d < -3) {
    signal = 'sell'
    headline = `Downward trend detected — consider selling now`
    detail = `${cropLabel} rates have fallen ${Math.abs(trend.percent7d).toFixed(1)}% over 7 days. Locking in current price may reduce exposure to further decline. Estimate is not a guarantee.`
  } else if (trend.direction === 'down') {
    signal = 'watch'
    headline = `Mild price softening — monitor before deciding`
    detail = `${cropLabel} rates dipped ${Math.abs(trend.percent7d).toFixed(1)}% recently. Watch for 2–3 more days before selling or holding. Estimate is not a guarantee.`
  } else {
    signal = 'sell'
    headline = `Prices stable — good time to sell`
    detail = `${cropLabel} modal rates in ${mandi} have been stable (±1.5%) over the last 7 days. This is generally a low-risk window to sell. Estimate is not a guarantee.`
  }

  return { signal, headline, detail, trend }
}
