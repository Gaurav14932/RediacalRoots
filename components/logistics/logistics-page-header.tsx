'use client'

import { useI18n } from '@/lib/i18n/context'

export function LogisticsPageHeader() {
  const { t } = useI18n()

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.logistics.pageTitle}</h1>
      <p className="text-muted-foreground">{t.logistics.pageSubtitle}</p>
    </div>
  )
}
