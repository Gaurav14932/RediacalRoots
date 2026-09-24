// Follow Supabase Edge Function Deno conventions
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const externalAiUrl = Deno.env.get("EXTERNAL_AI_URL") || "http://127.0.0.1:8000";
    const body = await req.json();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${externalAiUrl.replace(/\/+$/, "")}/predict-quality`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`External AI service returned status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        quality_score: data.quality_score,
        fault_flags: data.fault_flags || [],
        suggested_grade: data.suggested_grade || (data.quality_score >= 90 ? "A" : "B"),
        moisture_est: data.moisture_est,
        uniformity_est: data.uniformity_est,
        confidence: data.confidence,
        model_name: data.model_name || "VisionAgri-ViT-v2",
        is_fallback: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("predict-quality error or timeout:", error);
    // Return graceful fallback indicator so client can seamlessly use rule-based fallback
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "AI Quality Pre-Screening timed out or failed",
        is_fallback: true,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
