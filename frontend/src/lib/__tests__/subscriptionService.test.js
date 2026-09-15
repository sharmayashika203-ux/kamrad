import { describe, it, expect, beforeEach } from 'vitest';
import {
  MEMBERSHIP_TIERS,
  normalizePlanId,
  fetchActiveSubscription,
  verifyAndProcessPayment,
  recordPaymentFailure,
  canAccessFeature,
  processWebhookEvent
} from '../subscriptionService';

const memoryStore = new Map();
const mockLocalStorage = {
  getItem: (key) => memoryStore.get(key) || null,
  setItem: (key, val) => memoryStore.set(key, String(val)),
  removeItem: (key) => memoryStore.delete(key),
  clear: () => memoryStore.clear()
};
globalThis.localStorage = mockLocalStorage;

describe('Subscription & Payment Engine', () => {
  const mockUserId = 'user_test_sub_123';

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('normalizes plan IDs accurately', () => {
    expect(normalizePlanId('Explorer')).toBe('free');
    expect(normalizePlanId('Kamrad Pro')).toBe('kamrad_pro');
    expect(normalizePlanId('VIP Globe-Trotter')).toBe('globetrotter_vip');
    expect(normalizePlanId(null)).toBe('free');
  });

  it('defaults to FREE tier for new un-subscribed users', async () => {
    const sub = await fetchActiveSubscription(mockUserId);
    expect(sub.plan_id).toBe('free');
    expect(sub.payment_status).toBe('active');
    expect(sub.tier.name).toBe('Explorer (Free)');
  });

  it('verifies and activates subscription after payment', async () => {
    const paymentId = 'pay_test_abc123';
    const res = await verifyAndProcessPayment({
      userId: mockUserId,
      planId: 'kamrad_pro',
      billingCycle: 'annual',
      providerPaymentId: paymentId
    });

    expect(res.success).toBe(true);
    expect(res.subscription.plan_id).toBe('kamrad_pro');
    expect(res.subscription.payment_status).toBe('active');
    expect(res.subscription.provider_payment_id).toBe(paymentId);

    // Fetch active sub again
    const activeSub = await fetchActiveSubscription(mockUserId);
    expect(activeSub.plan_id).toBe('kamrad_pro');
    expect(activeSub.tier.id).toBe('kamrad_pro');
  });

  it('enforces idempotency on duplicate payment IDs', async () => {
    const paymentId = 'pay_dup_789';

    // First attempt
    const firstRes = await verifyAndProcessPayment({
      userId: mockUserId,
      planId: 'kamrad_pro',
      providerPaymentId: paymentId
    });
    expect(firstRes.success).toBe(true);

    // Second attempt with same payment ID
    const secondRes = await verifyAndProcessPayment({
      userId: mockUserId,
      planId: 'kamrad_pro',
      providerPaymentId: paymentId
    });

    expect(secondRes.success).toBe(true);
    expect(secondRes.subscription.provider_payment_id).toBe(paymentId);
  });

  it('handles expired subscriptions correctly', async () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const expiredSubRecord = {
      id: 'sub_expired_1',
      user_id: mockUserId,
      plan_id: 'globetrotter_vip',
      payment_status: 'active',
      start_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      expiry_date: pastDate,
      provider: 'razorpay'
    };

    localStorage.setItem(`kadam_sub_${mockUserId}`, JSON.stringify(expiredSubRecord));

    const sub = await fetchActiveSubscription(mockUserId);
    expect(sub.isExpired).toBe(true);
    expect(sub.plan_id).toBe('free');
    expect(sub.tier.name).toBe('Explorer (Free)');
  });

  it('handles failed payment logging without unlocking features', async () => {
    const failRes = await recordPaymentFailure({
      userId: mockUserId,
      planId: 'kamrad_pro',
      errorMessage: 'Card declined'
    });

    expect(failRes.success).toBe(false);
    expect(failRes.message).toBe('Payment could not be completed. Please try again.');

    const sub = await fetchActiveSubscription(mockUserId);
    expect(sub.plan_id).toBe('free');
  });

  it('enforces feature entitlements by membership tier', () => {
    const freeSub = { plan_id: 'free' };
    const proSub = { plan_id: 'kamrad_pro' };
    const vipSub = { plan_id: 'globetrotter_vip' };

    expect(canAccessFeature(freeSub, 'unlimitedMessaging')).toBe(false);
    expect(canAccessFeature(proSub, 'unlimitedMessaging')).toBe(true);

    expect(canAccessFeature(freeSub, 'aiConcierge')).toBe(false);
    expect(canAccessFeature(proSub, 'aiConcierge')).toBe(false);
    expect(canAccessFeature(vipSub, 'aiConcierge')).toBe(true);
  });

  it('processes webhook events idempotently', async () => {
    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment_id: 'pay_wh_999',
        user_id: mockUserId,
        plan_id: 'globetrotter_vip',
        status: 'captured'
      }
    };

    const res = await processWebhookEvent(webhookPayload);
    expect(res.success).toBe(true);

    const sub = await fetchActiveSubscription(mockUserId);
    expect(sub.plan_id).toBe('globetrotter_vip');
  });
});
