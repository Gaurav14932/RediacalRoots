'use client'

import { useI18n } from '@/lib/i18n/context'

export function AdminPageHeader() {
  const { t } = useI18n()

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-foreground">{t.admin.pageTitle}</h1>
        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
          {t.roles.admin}
        </span>
      </div>
      <p className="text-muted-foreground mt-1">
        {t.admin.pageSubtitle}
      </p>
    </div>
  )
}
