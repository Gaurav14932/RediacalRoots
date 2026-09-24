import { NextResponse } from 'next/server'

export async function GET() {
  const externalAiUrl =
    process.env.EXTERNAL_AI_URL ||
    process.env.NEXT_PUBLIC_EXTERNAL_AI_URL ||
    'http://127.0.0.1:8000'

  let isReachable = false
  let serviceData: any = null

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2500)

    const response = await fetch(`${externalAiUrl.replace(/\/+$/, '')}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      serviceData = await response.json()
      isReachable = true
    }
  } catch {
    isReachable = false
  }

  return NextResponse.json({
    status: isReachable ? 'healthy' : 'unreachable',
    external_ai_url: externalAiUrl,
    reachability: {
      predict_quality: isReachable,
      optimize_route: isReachable,
      sync_mandi_prices: isReachable,
    },
    service: serviceData?.service || 'RadicalRoots AI/ML External Service',
    timestamp: new Date().toISOString(),
  })
}
