'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { UserRole } from '@/lib/types'
import { Leaf, Loader2, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

// Supabase does not reveal whether an email is already registered, so the
// fallback stays generic. Validation failures describe the user's own input and
// are not an enumeration oracle, so surface them.
function signUpErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as { code?: string; status?: number }

  if (code === 'weak_password') {
    return 'Please choose a stronger password.'
  }
  if (code === 'email_address_invalid') {
    return 'Please use a real email address — example and test domains are not supported.'
  }
  if (code === 'email_address_not_authorized') {
    return 'We cannot send confirmation email to that address. Please use a different one.'
  }
  if (code === 'validation_failed') {
    return 'Please check the details you entered.'
  }
  if (code === 'over_email_send_rate_limit' || status === 429) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  return 'Unable to complete sign-up. Please try again.'
}

export default function Page() {
  const { t, locale } = useI18n()
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('farmer')
  const [location, setLocation] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationNotice, setLocationNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const router = useRouter()

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice({
        type: 'error',
        text: 'Geolocation is not supported by your browser. Please type location manually.',
      })
      return
    }

    setIsDetectingLocation(true)
    setLocationNotice(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            },
          )
          if (!res.ok) throw new Error('Failed to reverse geocode')
          const data = await res.json()
          const addr = data.address || {}
          const townOrCity =
            addr.village ||
            addr.town ||
            addr.city ||
            addr.suburb ||
            addr.county ||
            addr.state_district ||
            'Detected Farm'
          const stateOrRegion = addr.state || addr.country || ''
          const formatted = stateOrRegion ? `${townOrCity}, ${stateOrRegion}` : townOrCity
          setLocation(formatted)
          setLocationNotice({
            type: 'success',
            text: `Detected: ${formatted}`,
          })
        } catch {
          setLocationNotice({
            type: 'error',
            text: 'Could not fetch address details. Please type your location manually.',
          })
        } finally {
          setIsDetectingLocation(false)
        }
      },
      (geoErr) => {
        setIsDetectingLocation(false)
        let msg = 'Unable to detect location. Please enter manually.'
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please type your village/city manually.'
        } else if (geoErr.code === geoErr.POSITION_UNAVAILABLE) {
          msg = 'Location unavailable. Please type your village/city manually.'
        } else if (geoErr.code === geoErr.TIMEOUT) {
          msg = 'Location detection timed out. Please type your village/city manually.'
        }
        setLocationNotice({ type: 'error', text: msg })
      },
      { timeout: 9000, enableHighAccuracy: false },
    )
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder')

    if (isPlaceholder) {
      try {
        const { signUpDemoFallback } = await import('@/app/auth/actions')
        const res = await signUpDemoFallback({ name, email, role, location })
        if (res.success) {
          window.location.href = res.redirect || '/dashboard'
          return
        }
      } catch (fallbackErr) {
        console.error('Fallback sign-up error:', fallbackErr)
      }
      setError('Unable to complete sign-up. Please try again.')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Always use the current site origin so production emails never
          // send users back to a localhost development URL.
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name,
            role,
            location,
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error) {
      console.error('Sign-up error:', error)
      setError(signUpErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-border/60">
          <CardHeader className="items-center text-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Leaf className="size-6" />
              <span className="font-semibold text-lg text-foreground">
                RadicalRoots
              </span>
            </Link>
            <CardTitle className="text-2xl">{t.auth.signupTitle}</CardTitle>
            <CardDescription>
              {t.auth.signupSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label>{t.auth.selectRole}</Label>
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as UserRole)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">
                        {t.roles.farmer}
                      </SelectItem>
                      <SelectItem value="buyer">
                        {t.roles.buyer}
                      </SelectItem>
                      <SelectItem value="fpo">
                        {t.roles.fpo}
                      </SelectItem>
                      <SelectItem value="logistics">
                        {t.roles.logistics}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">{t.auth.fullName}</Label>
                  <Input
                    id="name"
                    placeholder="Asha Patil"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="location">{t.auth.location}</Label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isDetectingLocation}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50 transition-opacity"
                    >
                      {isDetectingLocation ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <MapPin className="size-3.5" />
                      )}
                      <span>{isDetectingLocation ? t.auth.detectingLocation : t.auth.detectLocation}</span>
                    </button>
                  </div>
                  <Input
                    id="location"
                    placeholder="e.g. Nashik, Maharashtra"
                    required
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value)
                      setLocationNotice(null)
                    }}
                  />
                  {locationNotice && (
                    <p
                      className={`text-xs ${
                        locationNotice.type === 'error'
                          ? 'text-destructive'
                          : 'text-emerald-600 dark:text-emerald-400 font-medium'
                      }`}
                    >
                      {locationNotice.text}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t.auth.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t.auth.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">{t.auth.repeatPassword}</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t.common.loading : t.auth.signUpBtn}
                </Button>
              </div>
              <div className="mt-5 text-center text-sm text-muted-foreground">
                <Link
                  href="/auth/login"
                  className="text-primary underline underline-offset-4"
                >
                  {t.auth.hasAccount}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
