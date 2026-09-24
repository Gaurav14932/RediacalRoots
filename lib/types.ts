export type UserRole = 'farmer' | 'buyer' | 'logistics' | 'inspector' | 'admin' | 'fpo'

export type CropType =
  | 'soybean'
  | 'tur'
  | 'wheat'
  | 'chana'
  | 'watermelon'
  | 'kharbuja'
  | 'onion'

export type Grade = 'A' | 'B' | 'C'

export type LotStatus =
  | 'listed'
  | 'under_verification'
  | 'verified'
  | 'sold'
  | 'delivered'
  | 'paid'
  | 'aggregated'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'invoiced'
  | 'paid'
  | 'scheduled'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'

export type DeliveryStopStatus = 'pending' | 'picked_up' | 'in_transit' | 'delivered'

export interface Profile {
  id: string
  role: UserRole
  name: string
  phone: string | null
  location: string | null
  fpo_id: string | null
  created_at: string
}

export interface CropLot {
  id: string
  farmer_id: string
  fpo_id: string | null
  crop_type: CropType
  quantity: number
  unit: string
  harvest_date: string | null
  location: string
  price_expected: number
  ai_prescreen_score: number | null
  ai_prescreen_grade: Grade | null
  inspector_grade: Grade | null
  final_grade: Grade | null
  status: LotStatus
  qr_code: string | null
  is_aggregated: boolean
  parent_lot_id: string | null
  contributing_lots_count: number | null
  moisture_pct?: number | null
  foreign_matter_pct?: number | null
  damaged_grain_pct?: number | null
  inspection_notes?: string | null
  photos?: string[]
  photo_count?: number
  created_at: string
  farmer?: Pick<Profile, 'id' | 'name' | 'location' | 'phone'> | null
  contributions?: AggregatedLotContribution[]
}

export interface AggregatedLotContribution {
  id: string
  aggregated_lot_id: string
  original_lot_id: string
  farmer_id: string
  farmer_name: string
  location: string
  quantity: number
  unit: string
  grade: Grade | null
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  lot_id: string
  quantity: number
  price_agreed: number
  status: OrderStatus
  delivery_run_id: string | null
  created_at: string
  lot?: Pick<CropLot, 'id' | 'crop_type' | 'unit' | 'location' | 'farmer_id'> | null
  buyer?: Pick<Profile, 'id' | 'name' | 'location'> | null
}

export interface MandiPrice {
  id: string
  crop_type: CropType
  mandi_name: string
  state: string
  district: string
  min_price: number
  max_price: number
  modal_price: number
  arrival_quantity_tonnes: number
  date: string // ISO date string YYYY-MM-DD
}

export interface PriceTrend {
  direction: 'up' | 'down' | 'stable'
  percent7d: number
  percent30d: number
  current: number
  high30d: number
  low30d: number
}

export type SellingWindowSignal = 'hold' | 'sell' | 'watch'

export interface SellingWindowSuggestion {
  signal: SellingWindowSignal
  headline: string
  detail: string
  trend: PriceTrend
}

export interface DeliveryStop {
  id: string
  run_id: string
  sequence: number
  type: 'pickup' | 'dropoff'
  order_id: string
  contact_name: string
  contact_phone: string | null
  location: string
  lat: number
  lng: number
  crop_type: CropType
  quantity: number
  unit: string
  status: DeliveryStopStatus
}

export interface DeliveryRun {
  id: string
  label: string
  region: string
  stops: DeliveryStop[]
  total_distance_km: number
  created_at: string
}

export interface Feedback {
  id: string
  order_id: string
  lot_id: string
  buyer_id: string
  buyer_name: string
  seller_id: string
  rating: number // 1 to 5
  comment: string
  flagged_for_review: boolean // true if rating <= 2
  created_at: string
}

export interface QualityInspection {
  id: string
  lot_id: string
  crop_type: CropType
  inspector_id: string
  inspector_name: string
  farmer_id: string
  farmer_name: string
  moisture_pct: number
  foreign_matter_pct: number
  damaged_grain_pct: number
  declared_grade: Grade | null
  ai_score: number | null
  final_grade: Grade
  notes: string | null
  created_at: string
}

export interface AppNotification {
  id: string
  user_id: string // recipient user id or role
  title: string
  message: string
  link: string
  read: boolean
  type: 'order' | 'delivery' | 'inspection' | 'feedback' | 'admin'
  created_at: string
}

