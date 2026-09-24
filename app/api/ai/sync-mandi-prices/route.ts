import { NextRequest, NextResponse } from 'next/server'
import { setSyncedMandiPrices } from '@/lib/mandi-data'
import type { MandiPrice } from '@/lib/types'

export async function GET() {
  return handleSync()
}

export async function POST() {
  return handleSync()
}

async function handleSync() {
  const externalAiUrl =
    process.env.EXTERNAL_AI_URL ||
    process.env.NEXT_PUBLIC_EXTERNAL_AI_URL ||
    'http://127.0.0.1:8000'

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${externalAiUrl.replace(/\/+$/, '')}/mandi-prices`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Mandi feed returned HTTP ${response.status}`)
    }

    const data = await response.json()
    const records: MandiPrice[] = data.records || []

    if (records.length > 0) {
      setSyncedMandiPrices(records, data.synced_at)
    }

    return NextResponse.json({
      status: 'success',
      source: data.source || 'Agmarknet / e-NAM Live Mandi Gateway',
      synced_at: data.synced_at || new Date().toISOString(),
      count: records.length,
      records,
      is_fallback: false,
    })
  } catch (error) {
    console.warn('[AI Service] sync-mandi-prices failed or timed out (>5s):', error)
    return NextResponse.json({
      status: 'error',
      is_fallback: true,
      error: error instanceof Error ? error.message : 'Timeout or unreachable',
    })
  }
}
