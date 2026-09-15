import { verifyAndProcessPayment, recordPaymentFailure, normalizePlanId, MEMBERSHIP_TIERS } from './subscriptionService';

let isProcessingPayment = false;

/**
 * Dynamically load Razorpay checkout SDK
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay Payment for selected membership plan.
 * Safe fallback to test modal if live credentials are not provided.
 */
export async function initiatePlanSubscription({
  user,
  plan, // { name, monthlyPrice, annualPrice }
  billingCycle = 'annual',
  onSuccess,
  onError
}) {
  if (isProcessingPayment) return;
  isProcessingPayment = true;

  try {
    if (!user || !user.id) {
      isProcessingPayment = false;
      if (onError) onError('Please log in or create an account to select a subscription plan.');
      return;
    }

    const normId = normalizePlanId(plan.name || plan.id);
    const amountUsd = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
    
    // Convert USD to INR approximate (1 USD = 83 INR) or direct INR amount for Razorpay checkout
    const amountInrPaisa = Math.round(amountUsd * 83 * 100);

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    // IF RAZORPAY KEY IS NOT PRESENT OR TEST KEY, OFFER SAFE TEST PAYMENT SANDBOX
    if (!razorpayKey || razorpayKey === 'your_razorpay_key_id' || razorpayKey.includes('test')) {
      const isConfirmed = window.confirm(
        `KadamFind Safe Payment Sandbox\n\nPlan: ${plan.name}\nBilling: ${billingCycle} ($${amountUsd}/mo)\nUser: ${user.email}\n\nClick OK to simulate verified payment, or Cancel to simulate a payment failure.`
      );

      if (!isConfirmed) {
        isProcessingPayment = false;
        await recordPaymentFailure({ userId: user.id, planId: normId, errorMessage: 'User cancelled payment' });
        if (onError) onError('Payment could not be completed. Please try again.');
        return;
      }

      // Process backend payment verification
      const result = await verifyAndProcessPayment({
        userId: user.id,
        planId: normId,
        billingCycle,
        providerPaymentId: `pay_rzp_test_${Date.now()}`
      });

      isProcessingPayment = false;
      if (result.success) {
        if (onSuccess) onSuccess(result.subscription);
      } else {
        if (onError) onError(result.message || 'Payment could not be completed. Please try again.');
      }
      return;
    }

    // LIVE RAZORPAY CHECKOUT FLOW
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      isProcessingPayment = false;
      if (onError) onError('Payment gateway could not be loaded. Please check your internet connection.');
      return;
    }

    const options = {
      key: razorpayKey,
      amount: amountInrPaisa,
      currency: 'INR',
      name: 'KadamFind Travel',
      description: `KadamFind ${plan.name} (${billingCycle})`,
      image: '/logo.svg',
      prefill: {
        email: user.email || '',
        name: user.user_metadata?.full_name || ''
      },
      theme: {
        color: '#FF5E00'
      },
      handler: async function (response) {
        try {
          const result = await verifyAndProcessPayment({
            userId: user.id,
            planId: normId,
            billingCycle,
            providerPaymentId: response.razorpay_payment_id,
            providerOrderId: response.razorpay_order_id,
            providerSignature: response.razorpay_signature
          });

          isProcessingPayment = false;
          if (result.success) {
            if (onSuccess) onSuccess(result.subscription);
          } else {
            if (onError) onError(result.message || 'Payment could not be completed. Please try again.');
          }
        } catch (err) {
          isProcessingPayment = false;
          console.error('Error verifying Razorpay response:', err);
          if (onError) onError('Payment could not be completed. Please try again.');
        }
      },
      modal: {
        ondismiss: async function () {
          isProcessingPayment = false;
          await recordPaymentFailure({ userId: user.id, planId: normId, errorMessage: 'Modal dismissed' });
          if (onError) onError('Payment could not be completed. Please try again.');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', async function (response) {
      isProcessingPayment = false;
      console.error('Razorpay payment failed:', response.error);
      await recordPaymentFailure({
        userId: user.id,
        planId: normId,
        errorMessage: response.error?.description || 'Razorpay payment failed'
      });
      if (onError) onError('Payment could not be completed. Please try again.');
    });

    rzp.open();

  } catch (err) {
    isProcessingPayment = false;
    console.error('Error in initiatePlanSubscription:', err);
    if (onError) onError('Payment could not be completed. Please try again.');
  }
}
