'use client'

import { useI18n } from '@/lib/i18n/context'

export function MandiPricesHeader() {
  const { t } = useI18n()

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.mandi.pageTitle}</h1>
      <p className="text-muted-foreground">
        {t.mandi.pageSubtitle}{' '}
        <span className="text-xs text-muted-foreground/70">
          (AGMARKNET / e-NAM Live Data Gateway)
        </span>
      </p>
    </div>
  )
}
