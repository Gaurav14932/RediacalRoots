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
import { Leaf } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

// Only the credential/existence signal is genericized — naming it would confirm
// whether an email is registered. Errors the user can act on are passed through,
// and anything unexpected is reported as such instead of as a wrong password.
function loginErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as { code?: string; status?: number }

  if (code === 'email_not_confirmed') {
    return 'Please confirm your email address — check your inbox for the link.'
  }
  if (code === 'over_request_rate_limit' || status === 429) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (code === 'invalid_credentials') {
    return 'Invalid email or password.'
  }
  return 'Something went wrong. Please try again.'
}

function LoginForm() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder')

    if (isPlaceholder) {
      try {
        const { loginDemoFallback } = await import('@/app/auth/actions')
        const res = await loginDemoFallback(email)
        if (res.success) {
          const redirect = searchParams.get('redirect') || res.redirect || '/dashboard'
          window.location.href = redirect
          return
        }
        setError(res.error || 'Invalid email or password.')
      } catch (fallbackErr) {
        console.error('Fallback login error:', fallbackErr)
        setError('Invalid email or password.')
      } finally {
        setIsLoading(false)
      }
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const authError = error as { code?: string; message?: string }
        const isInvalidCredentials =
          authError.code === 'invalid_credentials' ||
          authError.message?.toLowerCase() === 'invalid login credentials'

        // Demo accounts are intentionally kept in the local mock store and do
        // not need matching Supabase users in the deployed preview.
        if (isInvalidCredentials) {
          const { loginDemoFallback } = await import('@/app/auth/actions')
          const fallback = await loginDemoFallback(email)
          if (fallback.success) {
            window.location.href =
              searchParams.get('redirect') || fallback.redirect || '/dashboard'
            return
          }
        }

        throw error
      }

      const redirect = searchParams.get('redirect')
      router.push(redirect || '/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      setError(loginErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="items-center text-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Leaf className="size-6" />
          <span className="font-semibold text-lg text-foreground">
            RadicalRoots
          </span>
        </Link>
        <CardTitle className="text-2xl">{t.auth.loginTitle}</CardTitle>
        <CardDescription>
          {t.auth.loginSubtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-5">
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
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t.common.loading : t.auth.signInBtn}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/sign-up"
              className="text-primary underline underline-offset-4"
            >
              {t.auth.noAccount}
            </Link>
          </div>

          {/* Explicit Demo Mode Entrance */}
          <div className="mt-6 border-t border-border/80 pt-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                {t.auth.demoTitle}
              </span>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                {t.header.demoMode}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3">
              {t.auth.demoSubtitle}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={async () => {
                  const { enterDemoMode } = await import('@/app/auth/actions')
                  const res = await enterDemoMode('farmer')
                  window.location.href = res.redirect
                }}
                className="flex flex-col items-start p-2 rounded-md border border-border/80 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
              >
                <span className="font-semibold text-foreground">{t.roles.farmer}</span>
                <span className="text-[10px] text-muted-foreground">Ramesh Patil</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { enterDemoMode } = await import('@/app/auth/actions')
                  const res = await enterDemoMode('fpo')
                  window.location.href = res.redirect
                }}
                className="flex flex-col items-start p-2 rounded-md border border-border/80 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
              >
                <span className="font-semibold text-foreground">{t.roles.fpo}</span>
                <span className="text-[10px] text-muted-foreground">Kisan Vikas FPO</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { enterDemoMode } = await import('@/app/auth/actions')
                  const res = await enterDemoMode('buyer')
                  window.location.href = res.redirect
                }}
                className="flex flex-col items-start p-2 rounded-md border border-border/80 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
              >
                <span className="font-semibold text-foreground">{t.roles.buyer}</span>
                <span className="text-[10px] text-muted-foreground">FreshAgro Wholesale</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { enterDemoMode } = await import('@/app/auth/actions')
                  const res = await enterDemoMode('logistics')
                  window.location.href = res.redirect
                }}
                className="flex flex-col items-start p-2 rounded-md border border-border/80 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
              >
                <span className="font-semibold text-foreground">{t.roles.logistics}</span>
                <span className="text-[10px] text-muted-foreground">Sahyadri Fleet</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { enterDemoMode } = await import('@/app/auth/actions')
                  const res = await enterDemoMode('inspector')
                  window.location.href = res.redirect
                }}
                className="flex flex-col items-start p-2 rounded-md border border-border/80 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
              >
                <span className="font-semibold text-foreground">{t.roles.inspector}</span>
                <span className="text-[10px] text-muted-foreground">Dr. Arun Joshi</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { enterDemoMode } = await import('@/app/auth/actions')
                  const res = await enterDemoMode('admin')
                  window.location.href = res.redirect
                }}
                className="flex flex-col items-start p-2 rounded-md border border-border/80 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
              >
                <span className="font-semibold text-foreground">{t.roles.admin}</span>
                <span className="text-[10px] text-muted-foreground">System Ops</span>
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
