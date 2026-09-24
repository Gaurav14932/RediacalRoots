'use client'

import { Button } from '@/components/ui/button'
import { CROP_LABELS } from '@/lib/constants'
import { useI18n } from '@/lib/i18n/context'
import { getCropLabel } from '@/lib/i18n/translations'
import type { CropType } from '@/lib/types'
import { useRouter, useSearchParams } from 'next/navigation'

export function CropFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useI18n()
  const activeCrop = searchParams.get('crop')

  const setCrop = (crop: CropType | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (crop) {
      params.set('crop', crop)
    } else {
      params.delete('crop')
    }
    router.push(`/marketplace${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={!activeCrop ? 'default' : 'outline'}
        onClick={() => setCrop(null)}
      >
        {t.marketplace.allCropsFilter}
      </Button>
      {(Object.keys(CROP_LABELS) as CropType[]).map((crop) => (
        <Button
          key={crop}
          size="sm"
          variant={activeCrop === crop ? 'default' : 'outline'}
          onClick={() => setCrop(crop)}
        >
          {getCropLabel(crop, locale)}
        </Button>
      ))}
    </div>
  )
}
