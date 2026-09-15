// Supabase Edge Function: Razorpay Webhook Handler (Idempotent)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const event = body.event;
    const paymentEntity = body.payload?.payment?.entity;

    if (!paymentEntity) {
      return new Response(
        JSON.stringify({ message: "Ignored: invalid payload format." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paymentId = paymentEntity.id;
    const userId = paymentEntity.notes?.user_id;
    const planId = paymentEntity.notes?.plan_id || "kamrad_pro";

    if (event === "payment.captured") {
      // Idempotent processing
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("provider_payment_id", paymentId)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ message: "Event acknowledged: Payment already recorded." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await supabase.from("subscriptions").insert({
        user_id: userId,
        plan_id: planId,
        payment_status: "active",
        start_date: new Date().toISOString(),
        expiry_date: expiryDate.toISOString(),
        provider: "razorpay",
        provider_payment_id: paymentId,
      });

      return new Response(
        JSON.stringify({ message: "Subscription activated via webhook." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: `Event ${event} acknowledged.` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
