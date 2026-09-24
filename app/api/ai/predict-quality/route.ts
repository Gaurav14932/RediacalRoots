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

    const response = await fetch(`${externalAiUrl.replace(/\/+$/, '')}/predict-quality`, {
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
      quality_score: data.quality_score,
      fault_flags: data.fault_flags || [],
      suggested_grade: data.suggested_grade || (data.quality_score >= 90 ? 'A' : 'B'),
      moisture_est: data.moisture_est ?? 11.2,
      uniformity_est: data.uniformity_est ?? 96.0,
      confidence: data.confidence ?? 0.92,
      model_name: data.model_name || 'VisionAgri-ViT-v2',
      is_fallback: false,
    })
  } catch (error) {
    console.warn('[AI Service] predict-quality failed or timed out (>5s), fallback engaged:', error)
    return NextResponse.json({
      is_fallback: true,
      error: error instanceof Error ? error.message : 'Timeout or unreachable',
    })
  }
}
