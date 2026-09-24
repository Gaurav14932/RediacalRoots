'use client'

import { switchDemoPersona } from '@/app/auth/actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ROLE_LABELS } from '@/lib/constants'
import type { UserRole } from '@/lib/types'
import { ChevronDown, Sparkles, Building2, Sprout, ShoppingCart, Truck, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

const PERSONA_CONFIG: Record<
  string,
  { icon: typeof Sprout; name: string; org: string; color: string; defaultPath: string }
> = {
  fpo: {
    icon: Building2,
    name: 'Kisan Vikas FPO',
    org: 'FPO Manager',
    color: 'text-purple-600 dark:text-purple-400',
    defaultPath: '/dashboard',
  },
  farmer: {
    icon: Sprout,
    name: 'Ramesh Patil',
    org: 'Farmer (Nashik)',
    color: 'text-green-600 dark:text-green-400',
    defaultPath: '/dashboard',
  },
  buyer: {
    icon: ShoppingCart,
    name: 'FreshAgro Wholesale',
    org: 'Verified Buyer',
    color: 'text-blue-600 dark:text-blue-400',
    defaultPath: '/marketplace',
  },
  logistics: {
    icon: Truck,
    name: 'Sahyadri Logistics',
    org: 'Logistics Partner',
    color: 'text-amber-600 dark:text-amber-400',
    defaultPath: '/logistics',
  },
  inspector: {
    icon: ShieldCheck,
    name: 'Dr. Arun Joshi',
    org: 'Quality Inspector',
    color: 'text-teal-600 dark:text-teal-400',
    defaultPath: '/inspector',
  },
  admin: {
    icon: ShieldAlert,
    name: 'System Operations',
    org: 'Platform Admin',
    color: 'text-rose-600 dark:text-rose-400',
    defaultPath: '/admin',
  },
}

import { useI18n } from '@/lib/i18n/context'
import { getRoleLabel } from '@/lib/i18n/translations'

export function DemoPersonaSwitcher({ currentRole }: { currentRole: UserRole | null }) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const [isPending, startTransition] = useTransition()

  const activeRole = currentRole ?? 'fpo'
  const current = PERSONA_CONFIG[activeRole] ?? PERSONA_CONFIG.fpo
  const Icon = current.icon

  const handleSelectRole = (role: UserRole) => {
    startTransition(async () => {
      const targetPath = PERSONA_CONFIG[role]?.defaultPath ?? '/dashboard'
      document.cookie = 'rr_demo_mode=true; path=/; max-age=604800;'
      document.cookie = `rr_role=${role}; path=/; max-age=604800;`
      document.cookie = 'rr_logged_out=; path=/; max-age=0;'

      // Clear any in-progress draft forms and cached client state to prevent cross-persona leakage
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.clear()
          localStorage.removeItem('farmer_lot_draft')
          localStorage.removeItem('rr_lot_draft')
          localStorage.removeItem('rr_order_draft')
        } catch {
          // ignore in restricted iframe/browser environments
        }
      }

      await switchDemoPersona(role, targetPath)
      window.location.href = targetPath
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="inline-flex items-center h-8 gap-1.5 rounded-md border border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 px-2 text-xs font-medium hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
          {t.common.demoModeBadge}
        </span>
        {currentRole ? (
          <>
            <Icon className={`size-3.5 ${current.color} shrink-0`} />
            <span className="hidden md:inline font-semibold">{getRoleLabel(activeRole, locale)}</span>
            <span className="md:hidden font-semibold">{getRoleLabel(activeRole, locale).split(' ')[0]}</span>
          </>
        ) : (
          <span className="font-semibold text-muted-foreground">{t.common.switchDemoRole}</span>
        )}
        <ChevronDown className="size-3 text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between text-xs text-muted-foreground font-normal">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary" />
            <span>{t.common.switchDemoRole}</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1 py-0.5 rounded">
            {t.common.demoMode}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(PERSONA_CONFIG) as UserRole[]).map((role) => {
          const cfg = PERSONA_CONFIG[role]
          const RoleIcon = cfg.icon
          const isSelected = activeRole === role
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleSelectRole(role)}
              className={`flex items-center gap-2.5 py-2 cursor-pointer ${
                isSelected ? 'bg-primary/10 font-semibold' : ''
              }`}
            >
              <RoleIcon className={`size-4 ${cfg.color}`} />
              <div className="flex flex-col">
                <span className="text-sm leading-tight text-foreground">{getRoleLabel(role, locale)}</span>
                <span className="text-xs text-muted-foreground">{cfg.name}</span>
              </div>
              {isSelected && (
                <span className="ml-auto size-1.5 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
