import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { DEMO_USERS, isDemoUser, mockStore } from '@/lib/mock-store'
import type { UserRole } from '@/lib/types'

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const isPlaceholder = !url || url.includes('placeholder')

  const realSupabase = createServerClient(
    url || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy',
    {
      cookieOptions: { secure: process.env.NODE_ENV === 'production' },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Server Component ignore
          }
        },
      },
    },
  )

  // Resolve active user (either regular registered user or demo persona)
  const isExplicitlyLoggedOut = cookieStore.get('rr_logged_out')?.value === 'true'
  const userIdCookie = cookieStore.get('rr_user_id')?.value
  const demoModeCookie = cookieStore.get('rr_demo_mode')?.value === 'true'
  const activeRole = (cookieStore.get('rr_role')?.value as UserRole) || 'fpo'

  let resolvedUser: {
    id: string
    email: string
    name: string
    role: UserRole
    location: string
    is_demo: boolean
  } | null = null

  if (!isExplicitlyLoggedOut) {
    if (userIdCookie) {
      const profile = mockStore.getProfileById(userIdCookie)
      if (profile) {
        // Only marked as demo if the profile is in DEMO_USERS AND demo mode is active
        const isDemo = isDemoUser(profile.id) && demoModeCookie
        resolvedUser = {
          id: profile.id,
          email: `${profile.id}@example.com`,
          name: profile.name,
          role: profile.role,
          location: profile.location ?? 'Nashik, Maharashtra',
          is_demo: isDemo,
        }
      } else if (isDemoUser(userIdCookie) && demoModeCookie) {
        const demoRole =
          (Object.keys(DEMO_USERS) as UserRole[]).find((r) => DEMO_USERS[r].id === userIdCookie) ??
          'fpo'
        const demo = DEMO_USERS[demoRole]
        resolvedUser = {
          ...demo,
          is_demo: true,
        }
      }
    } else if (demoModeCookie) {
      // Explicit demo mode session
      const demo = DEMO_USERS[activeRole] || DEMO_USERS.fpo
      resolvedUser = {
        ...demo,
        is_demo: true,
      }
    }
  }

  // Demo sessions use the in-memory store even when production Supabase is
  // configured. Registered users continue through the real Supabase client.
  if (!isPlaceholder && !demoModeCookie) {
    return realSupabase
  }

  // Resilient Mock Client for local dev / preview environments
  return createMockSupabaseClient(resolvedUser)
}

function createMockSupabaseClient(
  resolvedUser: {
    id: string
    email: string
    name: string
    role: UserRole
    location: string
    is_demo: boolean
  } | null,
) {
  return {
    auth: {
      async getUser() {
        if (!resolvedUser) {
          return { data: { user: null }, error: null }
        }
        return {
          data: {
            user: {
              id: resolvedUser.id,
              email: resolvedUser.email,
              user_metadata: {
                role: resolvedUser.role,
                name: resolvedUser.name,
                location: resolvedUser.location,
                is_demo: resolvedUser.is_demo,
              },
            },
          },
          error: null,
        }
      },
      async signOut() {
        return { error: null }
      },
    },
    from(table: string) {
      return new MockQueryBuilder(table)
    },
  } as unknown as ReturnType<typeof createServerClient>
}

class MockQueryBuilder {
  private table: string
  private filters: Array<(item: Record<string, unknown>) => boolean> = []
  private sortField?: string
  private sortAscending: boolean = true
  private limitCount?: number

  constructor(table: string) {
    this.table = table
  }

  select(fields?: string) {
    // fields ignored for mock, returns full mock object
    return this
  }

  eq(column: string, value: unknown) {
    if (column === 'lot.farmer_id') {
      this.filters.push((item) => {
        const lot = (item as { lot?: { farmer_id?: unknown } }).lot
        return lot?.farmer_id === value
      })
      return this
    }

    this.filters.push((item) => {
      // nested or direct property
      const val = item[column]
      return val === value
    })
    return this
  }

  in(column: string, values: unknown[]) {
    this.filters.push((item) => {
      const val = item[column]
      return values.includes(val)
    })
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.sortField = column
    this.sortAscending = options?.ascending ?? true
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  private execute(): unknown[] {
    let items: Record<string, unknown>[] = []

    if (this.table === 'crop_lots') {
      items = mockStore.getLots() as unknown as Record<string, unknown>[]
    } else if (this.table === 'profiles') {
      items = mockStore.getProfiles() as unknown as Record<string, unknown>[]
    } else if (this.table === 'orders') {
      items = mockStore.getOrders() as unknown as Record<string, unknown>[]
    } else if (this.table === 'aggregated_lot_contributions') {
      items = (mockStore.getContributions('') ?? []) as unknown as Record<string, unknown>[]
    } else if (this.table === 'feedback') {
      items = mockStore.getFeedback() as unknown as Record<string, unknown>[]
    } else if (this.table === 'quality_inspections') {
      items = mockStore.getInspections() as unknown as Record<string, unknown>[]
    } else if (this.table === 'notifications') {
      items = mockStore.getNotifications() as unknown as Record<string, unknown>[]
    }

    for (const filter of this.filters) {
      items = items.filter(filter)
    }

    if (this.sortField) {
      const field = this.sortField
      const asc = this.sortAscending
      items.sort((a, b) => {
        const valA = a[field] as string | number
        const valB = b[field] as string | number
        if (valA < valB) return asc ? -1 : 1
        if (valA > valB) return asc ? 1 : -1
        return 0
      })
    }

    if (this.limitCount !== undefined) {
      items = items.slice(0, this.limitCount)
    }

    // Attach relational mock fields if queried
    if (this.table === 'crop_lots') {
      items = items.map((lot) => {
        const farmer = mockStore.getProfileById(lot.farmer_id as string)
        return {
          ...lot,
          farmer: farmer
            ? { id: farmer.id, name: farmer.name, location: farmer.location, phone: farmer.phone }
            : null,
        }
      })
    } else if (this.table === 'aggregated_lot_contributions') {
      items = items.map((contrib) => {
        const farmer = mockStore.getProfileById(contrib.farmer_id as string)
        return {
          ...contrib,
          farmer: farmer ? { name: farmer.name, location: farmer.location } : null,
        }
      })
    }

    return items
  }

  async maybeSingle() {
    const items = this.execute()
    return { data: items.length > 0 ? items[0] : null, error: null }
  }

  async single() {
    const items = this.execute()
    return { data: items.length > 0 ? items[0] : null, error: null }
  }

  async insert(recordOrRecords: Record<string, unknown> | Record<string, unknown>[]) {
    const rawRecords = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords]
    const records: Array<Record<string, unknown>> = rawRecords.map((r) => ({
      ...r,
      id: (r.id as string) || `${this.table.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: (r.created_at as string) || new Date().toISOString(),
    }))

    if (this.table === 'crop_lots') {
      for (const rec of records) {
        mockStore.addLot(rec as unknown as import('@/lib/types').CropLot)
      }
    } else if (this.table === 'aggregated_lot_contributions') {
      for (const rec of records) {
        mockStore.addContribution(rec as unknown as import('@/lib/types').AggregatedLotContribution)
      }
    } else if (this.table === 'orders') {
      for (const rec of records) {
        const lot = mockStore.getLotById(rec.lot_id as string)
        const buyer = mockStore.getProfileById(rec.buyer_id as string)
        const enrichedOrder = {
          ...rec,
          lot: lot ?? (rec.lot as any),
          buyer: buyer ? { id: buyer.id, name: buyer.name, location: buyer.location } : (rec.buyer as any),
        }
        mockStore.addOrder(enrichedOrder as unknown as import('@/lib/types').Order)
      }
    } else if (this.table === 'feedback') {
      for (const rec of records) {
        mockStore.addFeedback(rec as unknown as import('@/lib/types').Feedback)
      }
    } else if (this.table === 'quality_inspections') {
      for (const rec of records) {
        mockStore.addInspection(rec as unknown as import('@/lib/types').QualityInspection)
      }
    } else if (this.table === 'notifications') {
      for (const rec of records) {
        mockStore.addNotification(rec as unknown as import('@/lib/types').AppNotification)
      }
    }

    return { data: records, error: null }
  }

  async update(updates: Record<string, unknown>) {
    // Find matching items to update
    const items = this.execute() as Record<string, unknown>[]
    if (this.table === 'crop_lots') {
      for (const item of items) {
        if (item && item.id) {
          mockStore.updateLot(item.id as string, updates)
        }
      }
    }
    return { data: updates, error: null }
  }

  // Makes the query builder thenable (awaitable directly)
  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown[]; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    const items = this.execute()
    return Promise.resolve({ data: items, error: null }).then(onfulfilled, onrejected)
  }
}
