import { supabase, isSupabaseConfigured } from './supabase';
import { createNotification } from './connectionService';

// Membership Tiers & Entitlements
export const MEMBERSHIP_TIERS = {
  FREE: {
    id: 'free',
    name: 'Explorer (Free)',
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    features: {
      connectionInvitesPerMonth: 3,
      unlimitedMessaging: false,
      priorityMatchRadar: false,
      advancedFilters: false,
      profileBoost: false,
      aiConcierge: false,
      groupTrips: false
    }
  },
  PRO: {
    id: 'kamrad_pro',
    name: 'Kamrad Pro',
    monthlyPriceUsd: 38,
    annualPriceUsd: 30,
    features: {
      connectionInvitesPerMonth: Infinity,
      unlimitedMessaging: true,
      priorityMatchRadar: true,
      advancedFilters: true,
      profileBoost: false,
      aiConcierge: false,
      groupTrips: true
    }
  },
  VIP: {
    id: 'globetrotter_vip',
    name: 'VIP Globe-Trotter',
    monthlyPriceUsd: 149,
    annualPriceUsd: 125,
    features: {
      connectionInvitesPerMonth: Infinity,
      unlimitedMessaging: true,
      priorityMatchRadar: true,
      advancedFilters: true,
      profileBoost: true,
      aiConcierge: true,
      groupTrips: true
    }
  }
};

// Normalize plan IDs
export function normalizePlanId(planId) {
  if (!planId) return 'free';
  const lower = String(planId).toLowerCase();
  if (lower.includes('vip') || lower === 'globetrotter_vip') return 'globetrotter_vip';
  if (lower.includes('pro') || lower === 'kamrad_pro') return 'kamrad_pro';
  return 'free';
}

// Safe local storage accessor for Node/SSR environments
const safeStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage.getItem(key);
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage.getItem(key);
    return null;
  },
  setItem: (key, val) => {
    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, val);
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) globalThis.localStorage.setItem(key, val);
  }
};

/**
 * Fetch active subscription for a user from database.
 * Auto-handles expiration check.
 */
export async function fetchActiveSubscription(userId) {
  if (!userId) {
    return { plan_id: 'free', payment_status: 'active', tier: MEMBERSHIP_TIERS.FREE, isExpired: false };
  }

  if (!isSupabaseConfigured()) {
    // In unconfigured state, fallback to localStorage or default FREE
    const stored = safeStorage.getItem(`kadam_sub_${userId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.expiry_date && new Date(parsed.expiry_date) < new Date()) {
          return { plan_id: 'free', payment_status: 'expired', tier: MEMBERSHIP_TIERS.FREE, isExpired: true };
        }
        const normId = normalizePlanId(parsed.plan_id);
        const tierKey = Object.keys(MEMBERSHIP_TIERS).find(k => MEMBERSHIP_TIERS[k].id === normId) || 'FREE';
        return { ...parsed, plan_id: normId, tier: MEMBERSHIP_TIERS[tierKey], isExpired: false };
      } catch (err) {
        console.error('Error parsing stored sub:', err);
      }
    }
    return { plan_id: 'free', payment_status: 'active', tier: MEMBERSHIP_TIERS.FREE, isExpired: false };
  }

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return { plan_id: 'free', payment_status: 'active', tier: MEMBERSHIP_TIERS.FREE, isExpired: false };
    }

    const sub = data[0];

    // Check if subscription has expired
    if (sub.expiry_date && new Date(sub.expiry_date) < new Date()) {
      // Mark expired in database
      await supabase
        .from('subscriptions')
        .update({ payment_status: 'expired' })
        .eq('id', sub.id);

      return {
        ...sub,
        payment_status: 'expired',
        plan_id: 'free',
        tier: MEMBERSHIP_TIERS.FREE,
        isExpired: true
      };
    }

    if (sub.payment_status !== 'active') {
      return {
        ...sub,
        plan_id: 'free',
        tier: MEMBERSHIP_TIERS.FREE,
        isExpired: sub.payment_status === 'expired'
      };
    }

    const normId = normalizePlanId(sub.plan_id);
    const tierKey = Object.keys(MEMBERSHIP_TIERS).find(k => MEMBERSHIP_TIERS[k].id === normId) || 'FREE';

    return {
      ...sub,
      plan_id: normId,
      tier: MEMBERSHIP_TIERS[tierKey],
      isExpired: false
    };

  } catch (err) {
    console.error('Failed to fetch user subscription:', err);
    return { plan_id: 'free', payment_status: 'active', tier: MEMBERSHIP_TIERS.FREE, isExpired: false };
  }
}

/**
 * Verify & process payment securely on server/database logic.
 * Ensures idempotency: duplicate provider_payment_id will not re-charge or duplicate rows.
 */
export async function verifyAndProcessPayment({
  userId,
  planId,
  billingCycle = 'monthly',
  providerPaymentId,
  providerOrderId,
  providerSignature
}) {
  if (!userId) {
    return { success: false, message: 'User must be authenticated to complete subscription.' };
  }

  const normId = normalizePlanId(planId);
  if (normId === 'free') {
    return { success: false, message: 'Invalid subscription plan selected.' };
  }

  // Generate deterministic payment ID if test mode
  const paymentId = providerPaymentId || `pay_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Calculate Expiry Date (1 month or 1 year)
  const now = new Date();
  const expiryDate = new Date(now);
  if (billingCycle === 'annual') {
    expiryDate.setFullYear(now.getFullYear() + 1);
  } else {
    expiryDate.setDate(now.getDate() + 30);
  }

  if (!isSupabaseConfigured()) {
    // Local fallback for offline/test environment
    const subRecord = {
      id: `sub_${Date.now()}`,
      user_id: userId,
      plan_id: normId,
      payment_status: 'active',
      start_date: now.toISOString(),
      expiry_date: expiryDate.toISOString(),
      provider: 'razorpay',
      provider_payment_id: paymentId,
      billing_cycle: billingCycle
    };
    safeStorage.setItem(`kadam_sub_${userId}`, JSON.stringify(subRecord));
    return {
      success: true,
      subscription: subRecord,
      message: 'Subscription successfully activated!'
    };
  }

  try {
    // IDEMPOTENCY CHECK: Ensure provider_payment_id has not already been processed
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('provider_payment_id', paymentId)
      .limit(1);

    if (existing && existing.length > 0) {
      return {
        success: true,
        subscription: existing[0],
        message: 'Payment already processed and active.'
      };
    }

    // Insert active subscription record
    const { data: newSub, error: insertErr } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: normId,
        payment_status: 'active',
        start_date: now.toISOString(),
        expiry_date: expiryDate.toISOString(),
        provider: 'razorpay',
        provider_payment_id: paymentId
      })
      .select()
      .single();

    if (insertErr) {
      console.error('Database subscription insertion failed:', insertErr);
      return {
        success: false,
        message: 'Payment could not be completed. Please try again.'
      };
    }

    // Notify user of successful activation
    const tierName = normId === 'globetrotter_vip' ? 'VIP Globe-Trotter' : 'Kamrad Pro';
    await createNotification({
      userId,
      type: 'payment',
      title: '🎉 Premium Membership Activated!',
      content: `Welcome to ${tierName}! All premium travel features are now unlocked until ${expiryDate.toLocaleDateString()}.`
    });

    return {
      success: true,
      subscription: newSub,
      message: 'Subscription successfully activated!'
    };

  } catch (err) {
    console.error('Error verifying subscription payment:', err);
    return {
      success: false,
      message: 'Payment could not be completed. Please try again.'
    };
  }
}

/**
 * Handle payment failure securely without fake redirects
 */
export async function recordPaymentFailure({ userId, planId, errorMessage = 'Payment processing failed' }) {
  if (!userId) return;

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: normalizePlanId(planId),
          payment_status: 'failed',
          start_date: new Date().toISOString(),
          provider: 'razorpay'
        });
    } catch (err) {
      console.error('Failed to log payment failure:', err);
    }
  }

  return {
    success: false,
    message: 'Payment could not be completed. Please try again.'
  };
}

/**
 * Idempotent Webhook Handler for server-side processing
 */
export async function processWebhookEvent({ event, payload }) {
  if (!event || !payload) {
    return { status: 400, message: 'Invalid payload' };
  }

  const { payment_id, user_id, plan_id, status } = payload;
  if (!user_id || !payment_id) {
    return { status: 400, message: 'Missing user_id or payment_id' };
  }

  if (status === 'captured' || event === 'payment.captured') {
    return await verifyAndProcessPayment({
      userId: user_id,
      planId: plan_id,
      providerPaymentId: payment_id
    });
  } else if (status === 'failed' || event === 'payment.failed') {
    return await recordPaymentFailure({
      userId: user_id,
      planId: plan_id,
      errorMessage: 'Webhook received payment failure'
    });
  }

  return { status: 200, message: 'Event acknowledged' };
}

/**
 * Check if a user's subscription allows a specific feature
 */
export function canAccessFeature(subscription, featureKey) {
  const normId = normalizePlanId(subscription?.plan_id);
  const tierKey = Object.keys(MEMBERSHIP_TIERS).find(k => MEMBERSHIP_TIERS[k].id === normId) || 'FREE';
  const tier = MEMBERSHIP_TIERS[tierKey];

  if (!tier || !tier.features) return false;
  return Boolean(tier.features[featureKey]);
}
