'use client'

import { useI18n } from '@/lib/i18n/context'

export function InspectorPageHeader() {
  const { t } = useI18n()

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-foreground">
          {t.inspector.pageTitle}
        </h1>
        <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
          {t.lotDetail.apmcCertified}
        </span>
      </div>
      <p className="text-muted-foreground mt-1">
        {t.inspector.pageSubtitle}
      </p>
    </div>
  )
}
