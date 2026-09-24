'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/lib/types'
import { DEMO_USERS, isDemoUser, mockStore } from '@/lib/mock-store'

export async function enterDemoMode(role: UserRole = 'fpo', redirectTo?: string) {
  const cookieStore = await cookies()
  const demoUser = DEMO_USERS[role] || DEMO_USERS.fpo
  cookieStore.set('rr_demo_mode', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.set('rr_role', role, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.set('rr_user_id', demoUser.id, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.delete('rr_logged_out')

  const redirectPath =
    redirectTo ||
    (role === 'admin'
      ? '/admin'
      : role === 'inspector'
        ? '/inspector'
        : role === 'logistics'
          ? '/logistics'
          : role === 'buyer'
            ? '/marketplace'
            : '/dashboard')

  return { success: true, redirect: redirectPath }
}

export async function switchDemoPersona(role: UserRole, redirectTo?: string) {
  const cookieStore = await cookies()
  const userIdCookie = cookieStore.get('rr_user_id')?.value
  const demoModeCookie = cookieStore.get('rr_demo_mode')?.value === 'true'

  // Gate: persona switching is strictly restricted to Demo Mode sessions.
  // Registered regular accounts or sessions not in Demo Mode are forbidden.
  if ((userIdCookie && !isDemoUser(userIdCookie)) || !demoModeCookie) {
    return { error: 'Persona switching is only available in Demo Mode and is disabled for registered user accounts.' }
  }

  const demoUser = DEMO_USERS[role] || DEMO_USERS.fpo
  cookieStore.set('rr_demo_mode', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.set('rr_role', role, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.set('rr_user_id', demoUser.id, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.delete('rr_logged_out')

  if (redirectTo) {
    redirect(redirectTo)
  }
  return { success: true }
}

export async function signOutAction() {
  const cookieStore = await cookies()
  cookieStore.set('rr_logged_out', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.delete('rr_demo_mode')
  cookieStore.delete('rr_role')
  cookieStore.delete('rr_user_id')
  return { success: true }
}

export async function signOutDemo() {
  await signOutAction()
  redirect('/')
}

export async function loginDemoFallback(email: string) {
  const cleanEmail = email.trim().toLowerCase()
  const cookieStore = await cookies()

  // Match demo user or profile
  const demoRole = (Object.keys(DEMO_USERS) as UserRole[]).find(
    (r) => DEMO_USERS[r].email.toLowerCase() === cleanEmail,
  )

  const profile = mockStore.getProfiles().find(
    (p) => p.name.toLowerCase().includes(cleanEmail.split('@')[0]) || p.id === cleanEmail,
  )

  const resolvedRole: UserRole = demoRole ?? (profile?.role as UserRole) ?? 'farmer'

  if (demoRole) {
    const demoUser = DEMO_USERS[demoRole]
    cookieStore.set('rr_demo_mode', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 })
    cookieStore.set('rr_user_id', demoUser.id, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  } else if (profile) {
    cookieStore.delete('rr_demo_mode')
    cookieStore.set('rr_user_id', profile.id, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  } else {
    return { error: 'Account not found. Please check your email or sign up.' }
  }

  cookieStore.set('rr_role', resolvedRole, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.delete('rr_logged_out')

  const redirectPath =
    resolvedRole === 'admin'
      ? '/admin'
      : resolvedRole === 'inspector'
        ? '/inspector'
        : resolvedRole === 'logistics'
          ? '/logistics'
          : resolvedRole === 'buyer'
            ? '/marketplace'
            : '/dashboard'

  return { success: true, redirect: redirectPath }
}

export async function signUpDemoFallback(data: {
  name: string
  email: string
  role: UserRole
  location: string
}) {
  const cookieStore = await cookies()
  const newId = `usr-${data.role}-${Date.now().toString().slice(-4)}`

  mockStore.addProfile({
    id: newId,
    name: data.name,
    role: data.role,
    location: data.location,
    phone: '+91 98220 12345',
    fpo_id: data.role === 'farmer' ? 'usr-fpo-1' : null,
    created_at: new Date().toISOString(),
  })

  // Set cookies marking this as a regular authenticated user (NOT in demo mode)
  cookieStore.delete('rr_demo_mode')
  cookieStore.set('rr_user_id', newId, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.set('rr_role', data.role, { path: '/', maxAge: 60 * 60 * 24 * 7 })
  cookieStore.delete('rr_logged_out')

  const redirectPath =
    data.role === 'admin'
      ? '/admin'
      : data.role === 'inspector'
        ? '/inspector'
        : data.role === 'logistics'
          ? '/logistics'
          : data.role === 'buyer'
            ? '/marketplace'
            : '/dashboard'

  return { success: true, redirect: redirectPath }
}


