'use client'

import { useI18n } from '@/lib/i18n/context'

export function MarketplaceHeader() {
  const { t } = useI18n()

  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-foreground">
        {t.marketplace.pageTitle}
      </h1>
      <p className="text-muted-foreground">
        {t.marketplace.pageSubtitle}
      </p>
    </div>
  )
}
