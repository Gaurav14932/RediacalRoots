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

    const response = await fetch(`${externalAiUrl.replace(/\/+$/, "")}/optimize-route`, {
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
        run_id: data.run_id,
        optimized_stops: data.optimized_stops,
        stop_sequence: data.stop_sequence,
        total_distance_km: data.total_distance_km,
        baseline_distance_km: data.baseline_distance_km,
        efficiency_gain_pct: data.efficiency_gain_pct,
        algorithm: data.algorithm || "OR-Tools 2-Opt Vehicle Routing",
        is_fallback: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("optimize-route error or timeout:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Route optimization timed out or failed",
        is_fallback: true,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
