'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import type { UserRole } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Store,
  TrendingUp,
  Truck,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SiteHeaderNavProps {
  isAuthenticated: boolean
  role: UserRole | null
}

export function SiteHeaderNav({ isAuthenticated, role }: SiteHeaderNavProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop / Tablet Nav */}
      <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground md:flex">
        <Link href="/marketplace" className="hover:text-foreground transition-colors">
          {t.common.marketplace}
        </Link>
        <Link href="/mandi-prices" className="hover:text-foreground transition-colors">
          {t.common.mandiPrices}
        </Link>
        {isAuthenticated && (
          <>
            {role === 'admin' ? (
              <Link
                href="/admin"
                className="hover:text-foreground transition-colors font-semibold text-primary"
              >
                {t.common.analytics}
              </Link>
            ) : role === 'inspector' ? (
              <Link
                href="/inspector"
                className="hover:text-foreground transition-colors font-semibold text-teal-600"
              >
                {t.common.inspectorQueue}
              </Link>
            ) : (
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                {t.common.dashboard}
              </Link>
            )}
            {role === 'logistics' && (
              <Link href="/logistics" className="hover:text-foreground transition-colors">
                {t.common.logisticsRuns}
              </Link>
            )}
            <Link href="/orders" className="hover:text-foreground transition-colors">
              {t.common.orders}
            </Link>
          </>
        )}
      </nav>

      {/* Mobile Nav Hamburger Menu (< md, 375px) */}
      <div className="md:hidden">
        <DropdownMenu open={mobileOpen} onOpenChange={setMobileOpen}>
          <DropdownMenuTrigger
            className="inline-flex size-8 items-center justify-center rounded-md border border-border/80 bg-background text-foreground hover:bg-muted transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Navigation Menu"
          >
            <Menu className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-1.5 shadow-lg">
            <DropdownMenuItem
              onClick={() => {
                setMobileOpen(false)
                router.push('/marketplace')
              }}
              className="flex items-center gap-2.5 py-2 text-xs font-medium cursor-pointer"
            >
              <Store className="size-4 text-primary" />
              <span>{t.common.marketplace}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setMobileOpen(false)
                router.push('/mandi-prices')
              }}
              className="flex items-center gap-2.5 py-2 text-xs font-medium cursor-pointer"
            >
              <TrendingUp className="size-4 text-chart-2" />
              <span>{t.common.mandiPrices}</span>
            </DropdownMenuItem>

            {isAuthenticated && (
              <>
                <DropdownMenuSeparator />
                {role === 'admin' ? (
                  <DropdownMenuItem
                    onClick={() => {
                      setMobileOpen(false)
                      router.push('/admin')
                    }}
                    className="flex items-center gap-2.5 py-2 text-xs font-semibold text-primary cursor-pointer"
                  >
                    <BarChart3 className="size-4" />
                    <span>{t.common.analytics}</span>
                  </DropdownMenuItem>
                ) : role === 'inspector' ? (
                  <DropdownMenuItem
                    onClick={() => {
                      setMobileOpen(false)
                      router.push('/inspector')
                    }}
                    className="flex items-center gap-2.5 py-2 text-xs font-semibold text-teal-600 cursor-pointer"
                  >
                    <ShieldCheck className="size-4" />
                    <span>{t.common.inspectorQueue}</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => {
                      setMobileOpen(false)
                      router.push('/dashboard')
                    }}
                    className="flex items-center gap-2.5 py-2 text-xs font-medium cursor-pointer"
                  >
                    <LayoutDashboard className="size-4 text-primary" />
                    <span>{t.common.dashboard}</span>
                  </DropdownMenuItem>
                )}

                {role === 'logistics' && (
                  <DropdownMenuItem
                    onClick={() => {
                      setMobileOpen(false)
                      router.push('/logistics')
                    }}
                    className="flex items-center gap-2.5 py-2 text-xs font-medium cursor-pointer"
                  >
                    <Truck className="size-4 text-amber-600" />
                    <span>{t.common.logisticsRuns}</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => {
                    setMobileOpen(false)
                    router.push('/orders')
                  }}
                  className="flex items-center gap-2.5 py-2 text-xs font-medium cursor-pointer"
                >
                  <ClipboardList className="size-4 text-indigo-500" />
                  <span>{t.common.orders}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
