'use client'

import { Button } from '@/components/ui/button'
import { SignOutButton } from '@/components/sign-out-button'
import { useI18n } from '@/lib/i18n/context'
import { getRoleLabel } from '@/lib/i18n/translations'
import type { UserRole } from '@/lib/types'
import { User as UserIcon } from 'lucide-react'
import Link from 'next/link'

interface HeaderAuthSectionProps {
  isAuthenticated: boolean
  role: UserRole | null
  displayName: string | null
  isDemoMode: boolean
}

export function HeaderAuthSection({
  isAuthenticated,
  role,
  displayName,
  isDemoMode,
}: HeaderAuthSectionProps) {
  const { t, locale } = useI18n()

  if (isAuthenticated) {
    const roleLabel = role ? getRoleLabel(role, locale) : null

    return (
      <div className="flex items-center gap-2">
        {!isDemoMode && (
          <span className="hidden items-center gap-1.5 rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-semibold text-foreground sm:inline-flex">
            <UserIcon className="size-3.5 text-primary" />
            <span className="truncate max-w-[140px]">{displayName || t.common.myAccount}</span>
            {roleLabel && (
              <span className="text-[10px] font-normal text-muted-foreground">({roleLabel})</span>
            )}
          </span>
        )}
        <SignOutButton />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/auth/login" />}
      >
        {t.common.signIn}
      </Button>
      <Button size="sm" nativeButton={false} render={<Link href="/auth/sign-up" />}>
        {t.common.getStarted}
      </Button>
    </div>
  )
}
