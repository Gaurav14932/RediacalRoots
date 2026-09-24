'use client'

import { useI18n } from '@/lib/i18n/context'
import { getRoleLabel } from '@/lib/i18n/translations'
import type { UserRole } from '@/lib/types'

interface DashboardHeaderProps {
  role: UserRole
  userName?: string | null
}

export function DashboardHeader({ role, userName }: DashboardHeaderProps) {
  const { t, locale } = useI18n()

  function getSubtitle() {
    if (role === 'farmer') return t.farmer.dashboardSubtitle
    if (role === 'buyer') return t.buyer.recentOrdersTitle
    if (role === 'fpo') return t.fpo.pageSubtitle
    if (role === 'logistics') return t.logistics.pageSubtitle
    return `${t.header.welcomeBack} (${getRoleLabel(role, locale)})`
  }

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-foreground">
        {t.header.welcomeBack}{userName ? `, ${userName}` : ''}
      </h1>
      <p className="text-muted-foreground">{getSubtitle()}</p>
    </div>
  )
}
