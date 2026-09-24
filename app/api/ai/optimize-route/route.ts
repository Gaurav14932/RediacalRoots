import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const externalAiUrl =
    process.env.EXTERNAL_AI_URL ||
    process.env.NEXT_PUBLIC_EXTERNAL_AI_URL ||
    'http://127.0.0.1:8000'

  try {
    const body = await req.json()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${externalAiUrl.replace(/\/+$/, '')}/optimize-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`AI service responded with HTTP ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({
      run_id: data.run_id,
      optimized_stops: data.optimized_stops,
      stop_sequence: data.stop_sequence,
      total_distance_km: data.total_distance_km,
      baseline_distance_km: data.baseline_distance_km,
      efficiency_gain_pct: data.efficiency_gain_pct,
      algorithm: data.algorithm || 'OR-Tools 2-Opt Vehicle Routing',
      is_fallback: false,
    })
  } catch (error) {
    console.warn('[AI Service] optimize-route failed or timed out (>5s), fallback engaged:', error)
    return NextResponse.json({
      is_fallback: true,
      error: error instanceof Error ? error.message : 'Timeout or unreachable',
    })
  }
}
