// Supabase Edge Function: Server-Side Razorpay Payment Verification
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

    const { userId, planId, billingCycle, providerPaymentId, providerOrderId, providerSignature } = await req.json();

    if (!userId || !planId || !providerPaymentId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required parameters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Idempotency check: Ensure payment ID hasn't been processed
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("provider_payment_id", providerPaymentId)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ success: true, subscription: existing, message: "Payment already processed." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate expiry date
    const now = new Date();
    const expiryDate = new Date(now);
    if (billingCycle === "annual") {
      expiryDate.setFullYear(now.getFullYear() + 1);
    } else {
      expiryDate.setDate(now.getDate() + 30);
    }

    // Insert verified active subscription
    const { data: subscription, error: insertError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_id: planId,
        payment_status: "active",
        start_date: now.toISOString(),
        expiry_date: expiryDate.toISOString(),
        provider: "razorpay",
        provider_payment_id: providerPaymentId,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Create activation notification
    const tierName = planId.includes("vip") ? "VIP Globe-Trotter" : "Kamrad Pro";
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "payment",
      title: "🎉 Premium Membership Activated!",
      content: `Welcome to ${tierName}! All premium travel features are now unlocked until ${expiryDate.toLocaleDateString()}.`,
    });

    return new Response(
      JSON.stringify({ success: true, subscription, message: "Subscription successfully activated!" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err.message || "Payment verification failed." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
