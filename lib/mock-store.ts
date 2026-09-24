/**
 * RadicalRoots In-Memory Mock Store
 *
 * Provides pre-seeded crop lots, profiles, orders, and aggregation traceability.
 * Operates as a resilient data layer so the app functions seamlessly in all
 * environments, persisting changes in memory while syncing with Supabase when available.
 */

import type {
  AggregatedLotContribution,
  AppNotification,
  CropLot,
  Feedback,
  Order,
  Profile,
  QualityInspection,
  UserRole,
} from '@/lib/types'

export interface MockUser {
  id: string
  email: string
  name: string
  role: UserRole
  location: string
}

export const DEMO_USERS: Record<UserRole, MockUser> = {
  fpo: {
    id: 'usr-fpo-1',
    email: 'fpo@radicalroots.in',
    name: 'Maharashtra Kisan Vikas FPO',
    role: 'fpo',
    location: 'Nashik, Maharashtra',
  },
  farmer: {
    id: 'usr-farmer-1',
    email: 'ramesh.farmer@radicalroots.in',
    name: 'Ramesh Patil',
    role: 'farmer',
    location: 'Nashik, Maharashtra',
  },
  buyer: {
    id: 'usr-buyer-1',
    email: 'procurement@freshagro.in',
    name: 'FreshAgro Wholesale Mart',
    role: 'buyer',
    location: 'Pune, Maharashtra',
  },
  logistics: {
    id: 'usr-logistics-1',
    email: 'fleet@sahyadrilogistics.in',
    name: 'Sahyadri Agri Logistics',
    role: 'logistics',
    location: 'Nashik, Maharashtra',
  },
  inspector: {
    id: 'usr-inspector-1',
    email: 'inspector@agmarknet.gov.in',
    name: 'Dr. Arun Joshi (APMC Inspector)',
    role: 'inspector',
    location: 'Nagpur, Maharashtra',
  },
  admin: {
    id: 'usr-admin-1',
    email: 'admin@radicalroots.in',
    name: 'System Admin',
    role: 'admin',
    location: 'Mumbai, Maharashtra',
  },
}

export function isDemoUser(userId?: string | null): boolean {
  if (!userId) return false
  return Object.values(DEMO_USERS).some((u) => u.id === userId)
}

// Initial member farmer profiles
const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr-farmer-1',
    name: 'Ramesh Patil',
    role: 'farmer',
    phone: '+91 98220 12345',
    location: 'Nashik, Maharashtra',
    fpo_id: 'usr-fpo-1',
    created_at: '2026-08-10T08:00:00Z',
  },
  {
    id: 'usr-farmer-2',
    name: 'Suresh More',
    role: 'farmer',
    phone: '+91 98221 23456',
    location: 'Dindori, Nashik, Maharashtra',
    fpo_id: 'usr-fpo-1',
    created_at: '2026-08-12T09:30:00Z',
  },
  {
    id: 'usr-farmer-3',
    name: 'Anita Shinde',
    role: 'farmer',
    phone: '+91 98222 34567',
    location: 'Lasalgaon, Nashik, Maharashtra',
    fpo_id: 'usr-fpo-1',
    created_at: '2026-08-15T11:00:00Z',
  },
  {
    id: 'usr-farmer-4',
    name: 'Mukesh Wagh',
    role: 'farmer',
    phone: '+91 98223 45678',
    location: 'Niphad, Nashik, Maharashtra',
    fpo_id: 'usr-fpo-1',
    created_at: '2026-08-18T14:15:00Z',
  },
  {
    id: 'usr-farmer-5',
    name: 'Vijay Deshmukh',
    role: 'farmer',
    phone: '+91 98224 56789',
    location: 'Latur, Maharashtra',
    fpo_id: 'usr-fpo-1',
    created_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'usr-fpo-1',
    name: 'Maharashtra Kisan Vikas FPO',
    role: 'fpo',
    phone: '+91 94220 99887',
    location: 'Nashik, Maharashtra',
    fpo_id: null,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'usr-buyer-1',
    name: 'FreshAgro Wholesale Mart',
    role: 'buyer',
    phone: '+91 98230 44556',
    location: 'Pune, Maharashtra',
    fpo_id: null,
    created_at: '2026-08-05T12:00:00Z',
  },
  {
    id: 'usr-logistics-1',
    name: 'Sahyadri Agri Logistics',
    role: 'logistics',
    phone: '+91 98231 66778',
    location: 'Nashik, Maharashtra',
    fpo_id: null,
    created_at: '2026-08-08T09:00:00Z',
  },
]

// Pre-seeded crop lots
const INITIAL_LOTS: CropLot[] = [
  // Pre-aggregated lot demonstrating Phase 2 feature
  {
    id: 'lot-agg-001',
    farmer_id: 'usr-fpo-1',
    fpo_id: 'usr-fpo-1',
    crop_type: 'soybean',
    quantity: 350,
    unit: 'quintal',
    harvest_date: '2026-09-12',
    location: 'Nashik FPO Central Hub, Maharashtra',
    price_expected: 4650,
    ai_prescreen_score: 94,
    ai_prescreen_grade: 'A',
    inspector_grade: 'A',
    final_grade: 'A',
    status: 'verified',
    qr_code: 'RR-AGG-SOY-2026-001',
    is_aggregated: true,
    parent_lot_id: null,
    contributing_lots_count: 3,
    created_at: '2026-09-18T10:00:00Z',
    farmer: {
      id: 'usr-fpo-1',
      name: 'Maharashtra Kisan Vikas FPO',
      location: 'Nashik, Maharashtra',
      phone: '+91 94220 99887',
    },
  },

  // Individual farmer lots available for aggregation
  {
    id: 'lot-ind-001',
    farmer_id: 'usr-farmer-1',
    fpo_id: 'usr-fpo-1',
    crop_type: 'soybean',
    quantity: 120,
    unit: 'quintal',
    harvest_date: '2026-09-15',
    location: 'Nashik, Maharashtra',
    price_expected: 4600,
    ai_prescreen_score: 92,
    ai_prescreen_grade: 'A',
    inspector_grade: 'A',
    final_grade: 'A',
    status: 'verified',
    qr_code: 'RR-LOT-SOY-001',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-19T08:30:00Z',
    farmer: {
      id: 'usr-farmer-1',
      name: 'Ramesh Patil',
      location: 'Nashik, Maharashtra',
      phone: '+91 98220 12345',
    },
  },
  {
    id: 'lot-ind-002',
    farmer_id: 'usr-farmer-2',
    fpo_id: 'usr-fpo-1',
    crop_type: 'soybean',
    quantity: 150,
    unit: 'quintal',
    harvest_date: '2026-09-16',
    location: 'Dindori, Nashik, Maharashtra',
    price_expected: 4620,
    ai_prescreen_score: 90,
    ai_prescreen_grade: 'A',
    inspector_grade: 'A',
    final_grade: 'A',
    status: 'verified',
    qr_code: 'RR-LOT-SOY-002',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-19T10:15:00Z',
    farmer: {
      id: 'usr-farmer-2',
      name: 'Suresh More',
      location: 'Dindori, Nashik, Maharashtra',
      phone: '+91 98221 23456',
    },
  },
  {
    id: 'lot-ind-003',
    farmer_id: 'usr-farmer-3',
    fpo_id: 'usr-fpo-1',
    crop_type: 'soybean',
    quantity: 80,
    unit: 'quintal',
    harvest_date: '2026-09-17',
    location: 'Lasalgaon, Nashik, Maharashtra',
    price_expected: 4580,
    ai_prescreen_score: 89,
    ai_prescreen_grade: 'A',
    inspector_grade: 'A',
    final_grade: 'A',
    status: 'verified',
    qr_code: 'RR-LOT-SOY-003',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-20T09:00:00Z',
    farmer: {
      id: 'usr-farmer-3',
      name: 'Anita Shinde',
      location: 'Lasalgaon, Nashik, Maharashtra',
      phone: '+91 98222 34567',
    },
  },
  {
    id: 'lot-ind-004',
    farmer_id: 'usr-farmer-4',
    fpo_id: 'usr-fpo-1',
    crop_type: 'onion',
    quantity: 250,
    unit: 'quintal',
    harvest_date: '2026-09-14',
    location: 'Lasalgaon, Maharashtra',
    price_expected: 1750,
    ai_prescreen_score: 86,
    ai_prescreen_grade: 'B',
    inspector_grade: 'B',
    final_grade: 'B',
    status: 'verified',
    qr_code: 'RR-LOT-ONI-004',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-20T11:45:00Z',
    farmer: {
      id: 'usr-farmer-4',
      name: 'Mukesh Wagh',
      location: 'Niphad, Nashik, Maharashtra',
      phone: '+91 98223 45678',
    },
  },
  {
    id: 'lot-ind-005',
    farmer_id: 'usr-farmer-5',
    fpo_id: 'usr-fpo-1',
    crop_type: 'onion',
    quantity: 180,
    unit: 'quintal',
    harvest_date: '2026-09-15',
    location: 'Niphad, Nashik, Maharashtra',
    price_expected: 1720,
    ai_prescreen_score: 85,
    ai_prescreen_grade: 'B',
    inspector_grade: 'B',
    final_grade: 'B',
    status: 'verified',
    qr_code: 'RR-LOT-ONI-005',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-21T07:30:00Z',
    farmer: {
      id: 'usr-farmer-5',
      name: 'Vijay Deshmukh',
      location: 'Latur, Maharashtra',
      phone: '+91 98224 56789',
    },
  },
  {
    id: 'lot-ind-006',
    farmer_id: 'usr-farmer-1',
    fpo_id: 'usr-fpo-1',
    crop_type: 'tur',
    quantity: 90,
    unit: 'quintal',
    harvest_date: '2026-09-10',
    location: 'Nashik, Maharashtra',
    price_expected: 7100,
    ai_prescreen_score: 95,
    ai_prescreen_grade: 'A',
    inspector_grade: 'A',
    final_grade: 'A',
    status: 'verified',
    qr_code: 'RR-LOT-TUR-006',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-21T14:00:00Z',
    farmer: {
      id: 'usr-farmer-1',
      name: 'Ramesh Patil',
      location: 'Nashik, Maharashtra',
      phone: '+91 98220 12345',
    },
  },
  {
    id: 'lot-ind-007',
    farmer_id: 'usr-farmer-3',
    fpo_id: 'usr-fpo-1',
    crop_type: 'tur',
    quantity: 110,
    unit: 'quintal',
    harvest_date: '2026-09-11',
    location: 'Lasalgaon, Nashik, Maharashtra',
    price_expected: 7050,
    ai_prescreen_score: 93,
    ai_prescreen_grade: 'A',
    inspector_grade: 'A',
    final_grade: 'A',
    status: 'verified',
    qr_code: 'RR-LOT-TUR-007',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-21T15:20:00Z',
    farmer: {
      id: 'usr-farmer-3',
      name: 'Anita Shinde',
      location: 'Lasalgaon, Nashik, Maharashtra',
      phone: '+91 98222 34567',
    },
  },
  {
    id: 'lot-ind-008',
    farmer_id: 'usr-farmer-2',
    fpo_id: 'usr-fpo-1',
    crop_type: 'wheat',
    quantity: 200,
    unit: 'quintal',
    harvest_date: '2026-09-08',
    location: 'Dindori, Nashik, Maharashtra',
    price_expected: 2320,
    ai_prescreen_score: 91,
    ai_prescreen_grade: 'A',
    inspector_grade: null,
    final_grade: null,
    status: 'under_verification',
    qr_code: 'RR-LOT-WHT-008',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-22T08:00:00Z',
    farmer: {
      id: 'usr-farmer-2',
      name: 'Suresh More',
      location: 'Dindori, Nashik, Maharashtra',
      phone: '+91 98221 23456',
    },
  },
  {
    id: 'lot-ind-009',
    farmer_id: 'usr-farmer-4',
    fpo_id: 'usr-fpo-1',
    crop_type: 'chana',
    quantity: 140,
    unit: 'quintal',
    harvest_date: '2026-09-05',
    location: 'Niphad, Nashik, Maharashtra',
    price_expected: 5400,
    ai_prescreen_score: 90,
    ai_prescreen_grade: 'A',
    inspector_grade: 'A',
    final_grade: 'A',
    status: 'verified',
    qr_code: 'RR-LOT-CHN-009',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-22T10:30:00Z',
    farmer: {
      id: 'usr-farmer-4',
      name: 'Mukesh Wagh',
      location: 'Niphad, Nashik, Maharashtra',
      phone: '+91 98223 45678',
    },
  },
  {
    id: 'lot-ind-010',
    farmer_id: 'usr-farmer-5',
    fpo_id: 'usr-fpo-1',
    crop_type: 'watermelon',
    quantity: 35,
    unit: 'tonne',
    harvest_date: '2026-09-18',
    location: 'Latur, Maharashtra',
    price_expected: 820,
    ai_prescreen_score: 88,
    ai_prescreen_grade: 'B',
    inspector_grade: 'B',
    final_grade: 'B',
    status: 'verified',
    qr_code: 'RR-LOT-WTM-010',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-22T13:00:00Z',
    farmer: {
      id: 'usr-farmer-5',
      name: 'Vijay Deshmukh',
      location: 'Latur, Maharashtra',
      phone: '+91 98224 56789',
    },
  },
  {
    id: 'lot-ind-011',
    farmer_id: 'usr-farmer-1',
    fpo_id: 'usr-fpo-1',
    crop_type: 'kharbuja',
    quantity: 25,
    unit: 'tonne',
    harvest_date: '2026-09-17',
    location: 'Nashik, Maharashtra',
    price_expected: 1180,
    ai_prescreen_score: 92,
    ai_prescreen_grade: 'A',
    inspector_grade: 'A',
    final_grade: 'A',
    status: 'verified',
    qr_code: 'RR-LOT-KHB-011',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-22T16:00:00Z',
    farmer: {
      id: 'usr-farmer-1',
      name: 'Ramesh Patil',
      location: 'Nashik, Maharashtra',
      phone: '+91 98220 12345',
    },
  },
  {
    id: 'lot-ind-012',
    farmer_id: 'usr-farmer-1',
    fpo_id: 'usr-fpo-1',
    crop_type: 'soybean',
    quantity: 85,
    unit: 'quintal',
    harvest_date: '2026-09-21',
    location: 'Nashik, Maharashtra',
    price_expected: 4680,
    ai_prescreen_score: 88,
    ai_prescreen_grade: 'A',
    inspector_grade: null,
    final_grade: null,
    status: 'under_verification',
    qr_code: 'RR-LOT-SOY-012',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-23T07:15:00Z',
    farmer: {
      id: 'usr-farmer-1',
      name: 'Ramesh Patil',
      location: 'Nashik, Maharashtra',
      phone: '+91 98220 12345',
    },
  },
  {
    id: 'lot-ind-013',
    farmer_id: 'usr-farmer-3',
    fpo_id: 'usr-fpo-1',
    crop_type: 'chana',
    quantity: 115,
    unit: 'quintal',
    harvest_date: '2026-09-20',
    location: 'Lasalgaon, Nashik, Maharashtra',
    price_expected: 5350,
    ai_prescreen_score: 79,
    ai_prescreen_grade: 'B',
    inspector_grade: null,
    final_grade: null,
    status: 'under_verification',
    qr_code: 'RR-LOT-CHN-013',
    is_aggregated: false,
    parent_lot_id: null,
    contributing_lots_count: null,
    created_at: '2026-09-23T09:40:00Z',
    farmer: {
      id: 'usr-farmer-3',
      name: 'Anita Shinde',
      location: 'Lasalgaon, Nashik, Maharashtra',
      phone: '+91 98222 34567',
    },
  },
]

// Traceability contributions for lot-agg-001
const INITIAL_CONTRIBUTIONS: AggregatedLotContribution[] = [
  {
    id: 'contrib-001',
    aggregated_lot_id: 'lot-agg-001',
    original_lot_id: 'child-lot-001',
    farmer_id: 'usr-farmer-1',
    farmer_name: 'Ramesh Patil',
    location: 'Nashik, Maharashtra',
    quantity: 120,
    unit: 'quintal',
    grade: 'A',
    created_at: '2026-09-18T10:00:00Z',
  },
  {
    id: 'contrib-002',
    aggregated_lot_id: 'lot-agg-001',
    original_lot_id: 'child-lot-002',
    farmer_id: 'usr-farmer-2',
    farmer_name: 'Suresh More',
    location: 'Dindori, Nashik, Maharashtra',
    quantity: 130,
    unit: 'quintal',
    grade: 'A',
    created_at: '2026-09-18T10:00:00Z',
  },
  {
    id: 'contrib-003',
    aggregated_lot_id: 'lot-agg-001',
    original_lot_id: 'child-lot-003',
    farmer_id: 'usr-farmer-3',
    farmer_name: 'Anita Shinde',
    location: 'Lasalgaon, Nashik, Maharashtra',
    quantity: 100,
    unit: 'quintal',
    grade: 'A',
    created_at: '2026-09-18T10:00:00Z',
  },
]

// Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-001',
    buyer_id: 'usr-buyer-1',
    lot_id: 'lot-agg-001',
    quantity: 150,
    price_agreed: 4650,
    status: 'scheduled',
    delivery_run_id: 'run-nashik-pune-01',
    created_at: '2026-09-20T10:00:00Z',
    lot: {
      id: 'lot-agg-001',
      crop_type: 'soybean',
      unit: 'quintal',
      location: 'Nashik FPO Central Hub, Maharashtra',
      farmer_id: 'usr-fpo-1',
    },
    buyer: {
      id: 'usr-buyer-1',
      name: 'FreshAgro Wholesale Mart',
      location: 'Pune, Maharashtra',
    },
  },
  {
    id: 'ord-002',
    buyer_id: 'usr-buyer-1',
    lot_id: 'lot-ind-004',
    quantity: 100,
    price_agreed: 1750,
    status: 'in_transit',
    delivery_run_id: 'run-nashik-pune-01',
    created_at: '2026-09-21T09:30:00Z',
    lot: {
      id: 'lot-ind-004',
      crop_type: 'onion',
      unit: 'quintal',
      location: 'Lasalgaon, Maharashtra',
      farmer_id: 'usr-farmer-4',
    },
    buyer: {
      id: 'usr-buyer-1',
      name: 'FreshAgro Wholesale Mart',
      location: 'Pune, Maharashtra',
    },
  },
  {
    id: 'ord-003',
    buyer_id: 'usr-buyer-1',
    lot_id: 'lot-ind-006',
    quantity: 50,
    price_agreed: 7100,
    status: 'delivered',
    delivery_run_id: 'run-latur-nagpur-01',
    created_at: '2026-09-19T14:00:00Z',
    lot: {
      id: 'lot-ind-006',
      crop_type: 'tur',
      unit: 'quintal',
      location: 'Nashik, Maharashtra',
      farmer_id: 'usr-farmer-1',
    },
    buyer: {
      id: 'usr-buyer-1',
      name: 'FreshAgro Wholesale Mart',
      location: 'Pune, Maharashtra',
    },
  },
]

// Initial Feedback & Ratings
const INITIAL_FEEDBACK: Feedback[] = [
  {
    id: 'fb-001',
    order_id: 'ord-003',
    lot_id: 'lot-ind-006',
    buyer_id: 'usr-buyer-1',
    buyer_name: 'FreshAgro Wholesale Mart',
    seller_id: 'usr-farmer-1',
    rating: 5,
    comment: 'Exceptional purity and uniform grain size. Harvest was properly dried, moisture well within limits. Highly recommend Ramesh Patil!',
    flagged_for_review: false,
    created_at: '2026-09-21T10:00:00Z',
  },
  {
    id: 'fb-002',
    order_id: 'ord-001',
    lot_id: 'lot-agg-001',
    buyer_id: 'usr-buyer-1',
    buyer_name: 'FreshAgro Wholesale Mart',
    seller_id: 'usr-fpo-1',
    rating: 4,
    comment: 'Well-aggregated lot with consistent Grade A quality across all batches. Delivery schedule was maintained properly.',
    flagged_for_review: false,
    created_at: '2026-09-22T14:30:00Z',
  },
  {
    id: 'fb-003',
    order_id: 'ord-002',
    lot_id: 'lot-ind-004',
    buyer_id: 'usr-buyer-1',
    buyer_name: 'FreshAgro Wholesale Mart',
    seller_id: 'usr-farmer-4',
    rating: 2,
    comment: 'Moisture content was higher than declared and 5 bags had partial spoilage upon arrival. Needs better grading oversight.',
    flagged_for_review: true,
    created_at: '2026-09-22T16:15:00Z',
  },
]

// Initial Quality Inspections
const INITIAL_INSPECTIONS: QualityInspection[] = [
  {
    id: 'insp-001',
    lot_id: 'lot-ind-001',
    crop_type: 'soybean',
    inspector_id: 'usr-inspector-1',
    inspector_name: 'Dr. Arun Joshi',
    farmer_id: 'usr-farmer-1',
    farmer_name: 'Ramesh Patil',
    moisture_pct: 10.2,
    foreign_matter_pct: 1.1,
    damaged_grain_pct: 1.5,
    declared_grade: 'A',
    ai_score: 92,
    final_grade: 'A',
    notes: 'Exceeds Agmark Grade A standard. Clean, dry seed with optimal oil potential.',
    created_at: '2026-09-19T09:30:00Z',
  },
  {
    id: 'insp-002',
    lot_id: 'lot-ind-006',
    crop_type: 'tur',
    inspector_id: 'usr-inspector-1',
    inspector_name: 'Dr. Arun Joshi',
    farmer_id: 'usr-farmer-1',
    farmer_name: 'Ramesh Patil',
    moisture_pct: 11.0,
    foreign_matter_pct: 1.4,
    damaged_grain_pct: 1.8,
    declared_grade: 'A',
    ai_score: 95,
    final_grade: 'A',
    notes: 'Premium bold grain tur. Ready for direct milling/processing.',
    created_at: '2026-09-21T15:00:00Z',
  },
]

// Initial In-App Notifications
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    user_id: 'usr-admin-1',
    title: 'Quality Alert: Rating Flagged',
    message: 'Order #ord-002 received a 2-star rating from FreshAgro Wholesale Mart and is flagged for review.',
    link: '/admin',
    read: false,
    type: 'admin',
    created_at: '2026-09-22T16:16:00Z',
  },
  {
    id: 'notif-002',
    user_id: 'usr-farmer-1',
    title: 'Lot Verification Approved',
    message: 'Your Tur lot #lot-ind-006 has been verified as Grade A by Dr. Arun Joshi.',
    link: '/marketplace/lot-ind-006',
    read: false,
    type: 'inspection',
    created_at: '2026-09-21T15:05:00Z',
  },
  {
    id: 'notif-003',
    user_id: 'usr-buyer-1',
    title: 'Delivery Completed',
    message: 'Order #ord-003 has been delivered. Please share your rating and feedback.',
    link: '/orders',
    read: false,
    type: 'delivery',
    created_at: '2026-09-21T09:45:00Z',
  },
  {
    id: 'notif-004',
    user_id: 'usr-farmer-1',
    title: 'New Feedback Received',
    message: 'FreshAgro Wholesale rated your Tur lot 5 stars: "Exceptional purity and uniform grain size."',
    link: '/dashboard',
    read: false,
    type: 'feedback',
    created_at: '2026-09-21T10:05:00Z',
  },
  {
    id: 'notif-005',
    user_id: 'usr-fpo-1',
    title: 'New Marketplace Order',
    message: 'FreshAgro Wholesale Mart placed order #ord-001 for 150 quintal of Aggregated Soybean.',
    link: '/orders',
    read: false,
    type: 'order',
    created_at: '2026-09-20T10:05:00Z',
  },
]

// Global singleton in-memory state
class MemoryStore {
  private lots: CropLot[] = [...INITIAL_LOTS]
  private profiles: Profile[] = [...INITIAL_PROFILES]
  private contributions: AggregatedLotContribution[] = [...INITIAL_CONTRIBUTIONS]
  private orders: Order[] = [...INITIAL_ORDERS]
  private feedback: Feedback[] = [...INITIAL_FEEDBACK]
  private inspections: QualityInspection[] = [...INITIAL_INSPECTIONS]
  private notifications: AppNotification[] = [...INITIAL_NOTIFICATIONS]

  getLots(): CropLot[] {
    return [...this.lots]
  }

  getLotById(id: string): CropLot | null {
    const lot = this.lots.find((l) => l.id === id)
    if (!lot) return null
    const contribs = this.getContributions(id)
    return {
      ...lot,
      contributions: contribs.length > 0 ? contribs : undefined,
    }
  }

  addLot(lot: CropLot): void {
    this.lots.unshift(lot)
  }

  updateLot(id: string, updates: Partial<CropLot>): void {
    const idx = this.lots.findIndex((l) => l.id === id)
    if (idx !== -1) {
      this.lots[idx] = { ...this.lots[idx], ...updates }
    }
  }

  getContributions(aggregatedLotId: string): AggregatedLotContribution[] {
    return this.contributions.filter((c) => c.aggregated_lot_id === aggregatedLotId)
  }

  addContribution(contrib: AggregatedLotContribution): void {
    this.contributions.push(contrib)
  }

  getOrders(): Order[] {
    return [...this.orders]
  }

  addOrder(order: Order): void {
    this.orders.unshift(order)
  }

  updateOrder(id: string, updates: Partial<Order>): void {
    const idx = this.orders.findIndex((o) => o.id === id)
    if (idx !== -1) {
      this.orders[idx] = { ...this.orders[idx], ...updates }
    }
  }

  getProfiles(): Profile[] {
    return [...this.profiles]
  }

  getProfileById(id: string): Profile | null {
    return this.profiles.find((p) => p.id === id) ?? null
  }

  getProfileByRole(role: UserRole): Profile | null {
    return this.profiles.find((p) => p.role === role) ?? null
  }

  addProfile(profile: Profile): void {
    this.profiles.push(profile)
  }

  // Feedback methods
  getFeedback(): Feedback[] {
    return [...this.feedback]
  }

  getFeedbackBySeller(sellerId: string): Feedback[] {
    return this.feedback.filter((f) => f.seller_id === sellerId)
  }

  getFeedbackByLot(lotId: string): Feedback[] {
    return this.feedback.filter((f) => f.lot_id === lotId)
  }

  getFeedbackByOrder(orderId: string): Feedback | null {
    return this.feedback.find((f) => f.order_id === orderId) ?? null
  }

  addFeedback(item: Feedback): void {
    this.feedback.unshift(item)
  }

  getSellerRatingStats(sellerId: string): { average: number; count: number; reviews: Feedback[] } {
    const reviews = this.getFeedbackBySeller(sellerId)
    if (reviews.length === 0) return { average: 5.0, count: 0, reviews: [] }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return {
      average: Number((sum / reviews.length).toFixed(1)),
      count: reviews.length,
      reviews,
    }
  }

  getLotRatingStats(lotId: string): { average: number; count: number; reviews: Feedback[] } {
    const reviews = this.getFeedbackByLot(lotId)
    if (reviews.length === 0) {
      // Fallback to seller rating if lot has no direct reviews yet
      const lot = this.lots.find((l) => l.id === lotId)
      if (lot) {
        return this.getSellerRatingStats(lot.farmer_id)
      }
      return { average: 5.0, count: 0, reviews: [] }
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return {
      average: Number((sum / reviews.length).toFixed(1)),
      count: reviews.length,
      reviews,
    }
  }

  // Quality Inspections methods
  getInspections(): QualityInspection[] {
    return [...this.inspections]
  }

  getInspectionsByInspector(inspectorId: string): QualityInspection[] {
    return this.inspections.filter((i) => i.inspector_id === inspectorId)
  }

  addInspection(inspection: QualityInspection): void {
    this.inspections.unshift(inspection)
  }

  // Notifications methods
  getNotifications(userId?: string): AppNotification[] {
    if (!userId) return [...this.notifications]
    return this.notifications.filter((n) => n.user_id === userId || n.user_id === 'all')
  }

  addNotification(notif: AppNotification): void {
    this.notifications.unshift(notif)
  }

  markNotificationAsRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id)
    if (notif) notif.read = true
  }

  markAllNotificationsAsRead(userId?: string): void {
    for (const notif of this.notifications) {
      if (!userId || notif.user_id === userId || notif.user_id === 'all') {
        notif.read = true
      }
    }
  }
}

// Global variable across hot-reloads
const globalStore = (globalThis as unknown as { __RR_STORE__?: MemoryStore })
if (!globalStore.__RR_STORE__) {
  globalStore.__RR_STORE__ = new MemoryStore()
}

export const mockStore = globalStore.__RR_STORE__

