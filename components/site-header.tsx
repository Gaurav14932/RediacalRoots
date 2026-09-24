import { Button } from '@/components/ui/button'
import { SignOutButton } from '@/components/sign-out-button'
import { createClient } from '@/lib/supabase/server'
import { ROLE_LABELS } from '@/lib/constants'
import { Leaf, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { DemoPersonaSwitcher } from '@/components/demo-persona-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationBell } from '@/components/notification-bell'
import { SiteHeaderNav } from '@/components/site-header-nav'
import { HeaderAuthSection } from '@/components/header-auth-section'
import { isDemoUser, mockStore } from '@/lib/mock-store'
import type { AppNotification, UserRole } from '@/lib/types'

export async function SiteHeader() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  let roleLabel: string | null = null
  let role: UserRole | null = null
  let displayName: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .maybeSingle()
    if (profile) {
      role = profile.role as UserRole
      roleLabel = ROLE_LABELS[role]
      displayName = profile.name
    } else if (user.user_metadata?.role) {
      role = user.user_metadata.role as UserRole
      roleLabel = ROLE_LABELS[role]
      displayName = user.user_metadata?.name || null
    }
  }

  // Security Gate: Demo persona switcher is ONLY rendered when:
  // 1) Demo Mode is enabled by environment flag (NEXT_PUBLIC_ENABLE_DEMO_MODE !== 'false')
  // 2) An active user session is explicitly marked as a designated demo persona (is_demo === true)
  // For registered regular users (is_demo === false) or unauthenticated visitors, it is completely absent.
  const demoAllowed = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== 'false'
  const isDemoMode = Boolean(
    demoAllowed &&
      user &&
      user.user_metadata?.is_demo === true &&
      isDemoUser(user.id)
  )

  // Fetch in-app notifications for active user
  const notifications: AppNotification[] = user
    ? mockStore.getNotifications(user.id)
    : []

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="size-5 text-primary" />
          <span className="font-semibold text-foreground">RadicalRoots</span>
        </Link>

        {/* Dynamic i18n Navigation Links */}
        <SiteHeaderNav isAuthenticated={!!user} role={role} />

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />

          {user && <NotificationBell notifications={notifications} userId={user.id} />}

          {/* Persona Switcher ONLY in Demo Mode */}
          {isDemoMode && <DemoPersonaSwitcher currentRole={role} />}

          {/* Localized Auth Actions & Account Badge */}
          <HeaderAuthSection
            isAuthenticated={!!user}
            role={role}
            displayName={displayName}
            isDemoMode={isDemoMode}
          />
        </div>
      </div>
    </header>
  )
}
