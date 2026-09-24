/**
 * Logistics Data Layer
 *
 * Provides mock delivery run generation with nearest-neighbor geographic grouping.
 * DeliveryStop status updates are stored in a module-level in-memory store
 * (sufficient for demo; replace with Supabase writes in production).
 */

import type { CropType, DeliveryRun, DeliveryStop, DeliveryStopStatus } from '@/lib/types'
import { MANDI_LOCATIONS } from '@/lib/constants'
import { mockStore } from '@/lib/mock-store'

// ---------------------------------------------------------------------------
// Mock confirmed orders seed data (represents orders in 'confirmed' / 'scheduled' status)
// ---------------------------------------------------------------------------

interface SeedOrder {
  id: string
  crop_type: CropType
  quantity: number
  unit: string
  farmer_name: string
  farmer_location: string
  buyer_name: string
  buyer_location: string
  status: DeliveryStopStatus
}

const SEED_ORDERS: SeedOrder[] = [
  {
    id: 'ord-001',
    crop_type: 'soybean',
    quantity: 120,
    unit: 'quintal',
    farmer_name: 'Ramesh Patil',
    farmer_location: 'Nashik, Maharashtra',
    buyer_name: 'Agro Exports Ltd',
    buyer_location: 'Pune, Maharashtra',
    status: 'pending',
  },
  {
    id: 'ord-002',
    crop_type: 'onion',
    quantity: 200,
    unit: 'quintal',
    farmer_name: 'Sushila Bai',
    farmer_location: 'Lasalgaon, Maharashtra',
    buyer_name: 'Fresh Mart Mumbai',
    buyer_location: 'Pune, Maharashtra',
    status: 'picked_up',
  },
  {
    id: 'ord-003',
    crop_type: 'soybean',
    quantity: 80,
    unit: 'quintal',
    farmer_name: 'Mukesh Wagh',
    farmer_location: 'Nashik, Maharashtra',
    buyer_name: 'Agro Exports Ltd',
    buyer_location: 'Pune, Maharashtra',
    status: 'pending',
  },
  {
    id: 'ord-004',
    crop_type: 'tur',
    quantity: 60,
    unit: 'quintal',
    farmer_name: 'Vijay Deshmukh',
    farmer_location: 'Latur, Maharashtra',
    buyer_name: 'Pulses India Corp',
    buyer_location: 'Nagpur, Maharashtra',
    status: 'in_transit',
  },
  {
    id: 'ord-005',
    crop_type: 'chana',
    quantity: 100,
    unit: 'quintal',
    farmer_name: 'Anita Sonawane',
    farmer_location: 'Akola, Maharashtra',
    buyer_name: 'Pulses India Corp',
    buyer_location: 'Nagpur, Maharashtra',
    status: 'pending',
  },
  {
    id: 'ord-006',
    crop_type: 'wheat',
    quantity: 150,
    unit: 'quintal',
    farmer_name: 'Santosh More',
    farmer_location: 'Nagpur, Maharashtra',
    buyer_name: 'Flour Mills Pvt Ltd',
    buyer_location: 'Nagpur, Maharashtra',
    status: 'delivered',
  },
  {
    id: 'ord-007',
    crop_type: 'watermelon',
    quantity: 45,
    unit: 'tonne',
    farmer_name: 'Priya Kulkarni',
    farmer_location: 'Nashik, Maharashtra',
    buyer_name: 'FreshVeg Chain',
    buyer_location: 'Pune, Maharashtra',
    status: 'pending',
  },
]

// Resolve city name to lat/lng, fallback to fuzzy match
function resolveCoordinates(location: string): { lat: number; lng: number } {
  for (const [city, coords] of Object.entries(MANDI_LOCATIONS)) {
    if (location.toLowerCase().includes(city.toLowerCase())) {
      return { lat: coords.lat, lng: coords.lng }
    }
  }
  // Default to Maharashtra centre
  return { lat: 19.7515, lng: 75.7139 }
}

function distance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// In-memory stop status store (keyed by stopId -> status)
const _stopStatuses = new Map<string, DeliveryStopStatus>()

// ---------------------------------------------------------------------------
// Nearest-neighbor grouping: group orders by buyer location proximity
// ---------------------------------------------------------------------------
function groupOrdersByRegion(orders: SeedOrder[]): Map<string, SeedOrder[]> {
  const groups = new Map<string, SeedOrder[]>()
  for (const order of orders) {
    // Use buyer city as group key
    const city = Object.keys(MANDI_LOCATIONS).find((c) =>
      order.buyer_location.toLowerCase().includes(c.toLowerCase()),
    ) ?? 'Other'
    const existing = groups.get(city) ?? []
    existing.push(order)
    groups.set(city, existing)
  }
  return groups
}

function buildDeliveryRun(
  id: string,
  region: string,
  orders: SeedOrder[],
): DeliveryRun {
  const stops: DeliveryStop[] = []
  let sequence = 1

  // Sort orders by farmer location proximity (nearest-neighbor heuristic)
  const sorted = [...orders]
  const startCoords = resolveCoordinates(orders[0]?.farmer_location ?? 'Nashik')
  sorted.sort((a, b) => {
    const ca = resolveCoordinates(a.farmer_location)
    const cb = resolveCoordinates(b.farmer_location)
    const da = distance(startCoords.lat, startCoords.lng, ca.lat, ca.lng)
    const db = distance(startCoords.lat, startCoords.lng, cb.lat, cb.lng)
    return da - db
  })

  // Build pickup → dropoff stop pairs
  for (const order of sorted) {
    const pickupCoords = resolveCoordinates(order.farmer_location)
    const dropCoords = resolveCoordinates(order.buyer_location)
    const stopStatus = _stopStatuses.get(`${id}-pickup-${order.id}`) ?? order.status

    stops.push({
      id: `${id}-pickup-${order.id}`,
      run_id: id,
      sequence: sequence++,
      type: 'pickup',
      order_id: order.id,
      contact_name: order.farmer_name,
      contact_phone: '+91 98765 43210',
      location: order.farmer_location,
      lat: pickupCoords.lat,
      lng: pickupCoords.lng,
      crop_type: order.crop_type,
      quantity: order.quantity,
      unit: order.unit,
      status: stopStatus,
    })

    const dropStatus = _stopStatuses.get(`${id}-drop-${order.id}`) ?? (
      order.status === 'delivered' ? 'delivered' :
      order.status === 'in_transit' ? 'in_transit' : 'pending'
    )

    stops.push({
      id: `${id}-drop-${order.id}`,
      run_id: id,
      sequence: sequence++,
      type: 'dropoff',
      order_id: order.id,
      contact_name: order.buyer_name,
      contact_phone: '+91 87654 32109',
      location: order.buyer_location,
      lat: dropCoords.lat,
      lng: dropCoords.lng,
      crop_type: order.crop_type,
      quantity: order.quantity,
      unit: order.unit,
      status: dropStatus,
    })
  }

  // Estimate total distance (sum of consecutive haversine distances)
  let totalKm = 0
  for (let i = 1; i < stops.length; i++) {
    totalKm += distance(stops[i - 1].lat, stops[i - 1].lng, stops[i].lat, stops[i].lng)
  }

  return {
    id,
    label: `Run ${id.split('-')[1].toUpperCase()}`,
    region,
    stops,
    total_distance_km: Math.round(totalKm),
    created_at: new Date('2026-09-24').toISOString(),
  }
}

let _runs: DeliveryRun[] | null = null

export function getDeliveryRuns(): DeliveryRun[] {
  if (!_runs) {
    const groups = groupOrdersByRegion(SEED_ORDERS)
    _runs = []
    let runIndex = 1
    for (const [region, orders] of groups.entries()) {
      const runId = `run-${String(runIndex).padStart(3, '0')}`
      _runs.push(buildDeliveryRun(runId, region, orders))
      runIndex++
    }
  }
  // Re-apply in-memory status updates
  return _runs.map((run) => ({
    ...run,
    stops: run.stops.map((stop) => ({
      ...stop,
      status: _stopStatuses.get(stop.id) ?? stop.status,
    })),
  }))
}

export function getDeliveryRunById(runId: string): DeliveryRun | undefined {
  return getDeliveryRuns().find((r) => r.id === runId)
}

export function updateStopStatus(stopId: string, newStatus: DeliveryStopStatus): void {
  _stopStatuses.set(stopId, newStatus)
  // Invalidate run cache so next call rebuilds with new statuses
  _runs = null

  // Cascade to mockStore orders, notifications, and rating prompts
  try {
    const runs = getDeliveryRuns()
    const allStops = runs.flatMap((r) => r.stops)
    const stop = allStops.find((s) => s.id === stopId)
    if (stop && stop.order_id) {
      if (newStatus === 'delivered' && stop.type === 'dropoff') {
        mockStore.updateOrder(stop.order_id, { status: 'delivered' })
        const order = mockStore.getOrders().find((o) => o.id === stop.order_id)
        if (order) {
          mockStore.addNotification({
            id: `notif-${Date.now()}-deliv`,
            user_id: order.buyer_id,
            title: 'Order Delivered — Review Pending',
            message: `Shipment for Order #${stop.order_id} has arrived. Please inspect your produce and rate your seller.`,
            link: `/orders/${stop.order_id}`,
            read: false,
            type: 'delivery',
            created_at: new Date().toISOString(),
          })
          const sellerId = order.lot?.farmer_id ?? 'usr-farmer-1'
          mockStore.addNotification({
            id: `notif-${Date.now()}-seller`,
            user_id: sellerId,
            title: 'Shipment Successfully Delivered',
            message: `Your crop shipment for Order #${stop.order_id} has reached the buyer. Escrow payout unlocked.`,
            link: '/dashboard',
            read: false,
            type: 'order',
            created_at: new Date().toISOString(),
          })
        }
      } else if (newStatus === 'picked_up' && stop.type === 'pickup') {
        mockStore.updateOrder(stop.order_id, { status: 'confirmed' })
      }
    }
  } catch (err) {
    console.error('[logistics-data] Error cascading stop status:', err)
  }
}

export function getOrderDeliveryStatus(orderId: string): {
  stop: DeliveryStop | undefined
  run: DeliveryRun | undefined
} {
  const runs = getDeliveryRuns()
  const order = mockStore.getOrders().find((o) => o.id === orderId)
  for (const run of runs) {
    const stop = run.stops.find((s) => s.order_id === orderId && s.type === 'dropoff')
    if (stop) {
      // Harmonize: if order itself was marked delivered first, reflect delivered on stop
      if (order?.status === 'delivered' && stop.status !== 'delivered') {
        return {
          stop: { ...stop, status: 'delivered' },
          run,
        }
      }
      return { stop, run }
    }
  }
  return { stop: undefined, run: undefined }
}

