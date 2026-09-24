'use client'

import { useI18n } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/translations'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LANGUAGES: Array<{ code: Locale; label: string; nativeName: string }> = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex items-center gap-1.5">
      <Select value={locale} onValueChange={(val) => setLocale(val as Locale)}>
        <SelectTrigger
          aria-label="Change language"
          className="h-8 w-auto gap-1.5 border-border/60 bg-background/50 px-2.5 text-xs font-medium hover:bg-muted/50 focus:ring-1 focus:ring-primary"
        >
          <Globe className="size-3.5 text-primary shrink-0" />
          <SelectValue>
            <span className="font-medium">
              {locale === 'en' ? 'EN' : locale === 'hi' ? 'हिन्दी' : 'मराठी'}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end" className="text-xs">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-xs py-1.5 cursor-pointer">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="ml-1.5 text-[11px] text-muted-foreground">({lang.label})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
