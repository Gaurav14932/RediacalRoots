'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/context'
import { Store } from 'lucide-react'
import Link from 'next/link'

export function EmptyLotsState() {
  const { t } = useI18n()

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <Store className="size-8 text-muted-foreground" />
        <p className="font-medium text-foreground">{t.marketplace.noLotsFound}</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {t.marketplace.noLotsFoundDesc}
        </p>
        <Button size="sm" variant="outline" nativeButton={false} render={<Link href="/marketplace" />}>
          {t.marketplace.clearFilters}
        </Button>
      </CardContent>
    </Card>
  )
}
