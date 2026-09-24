'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { translations, type Locale, type Translations } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('rr_locale') as Locale | null
        if (stored === 'en' || stored === 'hi' || stored === 'mr') {
          return stored
        }
        const match = document.cookie.match(/rr_locale=(en|hi|mr)/)
        if (match && (match[1] === 'en' || match[1] === 'hi' || match[1] === 'mr')) {
          return match[1] as Locale
        }
      } catch {
        // ignore
      }
    }
    return 'en'
  })

  useEffect(() => {
    // Read persisted locale from localStorage or document cookie
    try {
      const stored = localStorage.getItem('rr_locale') as Locale | null
      if (stored && (stored === 'en' || stored === 'hi' || stored === 'mr')) {
        setLocaleState(stored)
      } else {
        const match = document.cookie.match(/rr_locale=(en|hi|mr)/)
        if (match && match[1]) {
          setLocaleState(match[1] as Locale)
        }
      }
    } catch {
      // ignore in restricted environments
    }
  }, [])

  // Dev-mode safeguard: scan DOM when locale is 'hi' or 'mr' to catch any untranslated raw English text
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || locale === 'en') return
    const englishPhrases = [
      'Fair prices for farmers',
      'Browse the marketplace',
      'List your crop',
      'How it works',
      'Ready to trade crops',
      'Create your account',
      'Explore listings',
      'Farmers list crops',
      'Quality is verified',
      'Buyers order directly',
      'Logistics and payment',
      'Your recent orders',
      'Orders placed',
      'Total order value',
      'No orders yet',
    ]

    const timeout = setTimeout(() => {
      try {
        const bodyText = document.body.innerText || ''
        for (const phrase of englishPhrases) {
          if (bodyText.includes(phrase)) {
            console.warn(
              `[i18n safeguard warning] Raw English string detected in active locale (${locale}): "${phrase}". Make sure to consume useI18n().`,
            )
          }
        }
      } catch {
        // ignore in tests
      }
    }, 1200)

    return () => clearTimeout(timeout)
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem('rr_locale', newLocale)
      document.cookie = `rr_locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch {
      // ignore
    }
  }

  const t = translations[locale] || translations.en

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
