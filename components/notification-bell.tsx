'use client'

import { markAllAsRead, markAsRead } from '@/app/notifications/actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AppNotification } from '@/lib/types'
import { formatTime } from '@/lib/constants'
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Package,
  ShieldAlert,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const TYPE_ICONS: Record<string, typeof Package> = {
  order: Package,
  delivery: Truck,
  inspection: ShieldCheck,
  feedback: Star,
  admin: ShieldAlert,
}

const TYPE_COLORS: Record<string, string> = {
  order: 'text-primary bg-primary/10',
  delivery: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
  inspection: 'text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400',
  feedback: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400',
  admin: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400',
}

interface NotificationBellProps {
  notifications: AppNotification[]
  userId?: string
}

export function NotificationBell({ notifications: initialNotifications, userId }: NotificationBellProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [, startTransition] = useTransition()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string, link: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    startTransition(async () => {
      await markAsRead(id)
      router.push(link)
    })
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    startTransition(async () => {
      await markAllAsRead(userId)
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex size-8 items-center justify-center rounded-md border border-border/60 bg-background text-foreground hover:bg-muted transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Notifications"
      >
        <Bell className="size-4 text-foreground/80" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96 shadow-lg">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[380px] divide-y divide-border/40 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
              <CheckCircle2 className="size-6 text-muted-foreground/60" />
              <p className="text-sm">You&apos;re all caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = TYPE_ICONS[notif.type] ?? Bell
              const colorClass = TYPE_COLORS[notif.type] ?? 'text-primary bg-primary/10'

              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id, notif.link)}
                  className={`flex items-start gap-3 p-3 transition-colors hover:bg-muted/50 cursor-pointer ${
                    !notif.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div
                    className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs truncate ${
                          !notif.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'
                        }`}
                      >
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="size-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {formatTime(notif.created_at)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
