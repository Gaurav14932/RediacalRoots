// Follow Supabase Edge Function Deno conventions
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const externalAiUrl = Deno.env.get("EXTERNAL_AI_URL") || "http://127.0.0.1:8000";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${externalAiUrl.replace(/\/+$/, "")}/mandi-prices`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`External mandi feed returned status: ${response.status}`);
    }

    const feedData = await response.json();
    const records = feedData.records || [];

    let upsertedCount = records.length;
    let dbStatus = "synced_locally";

    // If Supabase environment is available, upsert directly into the mandi_prices table
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { error } = await supabase.from("mandi_prices").upsert(records, { onConflict: "id" });
      if (error) {
        console.warn("Supabase DB upsert notice:", error.message);
        dbStatus = "upsert_error: " + error.message;
      } else {
        dbStatus = "synced_database";
      }
    }

    return new Response(
      JSON.stringify({
        status: "success",
        db_status: dbStatus,
        upserted_count: upsertedCount,
        synced_at: feedData.synced_at || new Date().toISOString(),
        source: feedData.source || "Agmarknet / e-NAM Live Mandi Gateway",
        records: records,
        is_fallback: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("sync-mandi-prices error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to sync mandi prices",
        is_fallback: true,
        synced_at: null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
