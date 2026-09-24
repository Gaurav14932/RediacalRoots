'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signOutAction } from '@/app/auth/actions'

import { useI18n } from '@/lib/i18n/context'

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useI18n()

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      // 1. Explicitly mark as logged out in browser cookies and clear session cookies
      document.cookie = 'rr_logged_out=true; path=/; max-age=604800;'
      document.cookie = 'rr_demo_mode=; path=/; max-age=0;'
      document.cookie = 'rr_user_id=; path=/; max-age=0;'
      document.cookie = 'rr_role=; path=/; max-age=0;'

      // 2. Clear browser client cache / storage while preserving selected language
      try {
        const savedLocale = localStorage.getItem('rr_locale')
        localStorage.clear()
        if (savedLocale) {
          localStorage.setItem('rr_locale', savedLocale)
        }
        sessionStorage.clear()
      } catch {}

      // 3. Attempt Supabase client signOut if initialized
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
      } catch {}

      // 4. Server-side cookie cleanup
      await signOutAction()
    } catch (e) {
      console.error('Sign-out error:', e)
    } finally {
      // 5. Force fresh reload to landing page
      window.location.href = '/'
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={isLoading}
      className="gap-2 text-muted-foreground hover:text-foreground"
    >
      <LogOut className="size-4" />
      <span>{t.common.signOut}</span>
    </Button>
  )
}
