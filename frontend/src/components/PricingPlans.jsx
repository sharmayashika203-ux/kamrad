import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Zap, Crown, ArrowRight, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { fetchActiveSubscription, normalizePlanId } from '../lib/subscriptionService';
import { initiatePlanSubscription } from '../lib/razorpayService';

export default function PricingPlans({ onOpenAuth, onSuccessSubscription }) {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' or 'annual'
  const [currentSub, setCurrentSub] = useState(null);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch active subscription for user
  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      fetchActiveSubscription(user.id).then((sub) => {
        if (isMounted) setCurrentSub(sub);
      });
    } else {
      setCurrentSub(null);
    }
    return () => { isMounted = false; };
  }, [user]);

  const plans = [
    {
      id: 'free',
      name: "Explorer",
      badge: "Get Started",
      monthlyPrice: 0,
      annualPrice: 0,
      desc: "Perfect for casual travelers looking to browse verified travel companions.",
      features: [
        "Browse 100% ID Verified Profiles",
        "Public Trip Request Search",
        "Standard AI Match Calculations",
        "Send 3 Companion Connection Invites/mo",
        "Basic Safety Verification Badge"
      ],
      cta: "Create Free Account",
      popular: false,
      icon: <Zap size={22} style={{ color: '#64748B' }} />
    },
    {
      id: 'kamrad_pro',
      name: "Kamrad Pro",
      badge: "🔥 MOST POPULAR",
      monthlyPrice: 12,
      annualPrice: 9,
      desc: "For active travelers & solo explorers seeking guaranteed safe companions.",
      features: [
        "Unlimited Direct Messaging & Video Calls",
        "100% ID & Biometric Verification Badge",
        "Priority AI Match Radar Engine",
        "Split Cost Escrow Payment Protection",
        "Unlimited Trip Requests & Destination Alerts",
        "24/7 SOS Emergency In-App Safety Line"
      ],
      cta: "Start 7-Day Free Trial",
      popular: true,
      icon: <Sparkles size={22} style={{ color: '#FF5E00' }} />
    },
    {
      id: 'globetrotter_vip',
      name: "VIP Globe-Trotter",
      badge: "Ultimate Experience",
      monthlyPrice: 29,
      annualPrice: 22,
      desc: "For frequent wanderers, group leaders & luxury trip planners.",
      features: [
        "Everything in Pro Plan",
        "Personal AI Travel Companion Concierge",
        "Host & Lead Unlimited Group Trips",
        "Exclusive Discounts on Hotels & Rental Cars",
        "Airport Lounge Access & Emergency Insurance",
        "Dedicated 24/7 VIP Support Manager"
      ],
      cta: "Join VIP Club",
      popular: false,
      icon: <Crown size={22} style={{ color: '#A855F7' }} />
    }
  ];

  const handleSelectPlan = async (plan) => {
    setErrorMessage('');
    setSuccessMessage('');

    // If not logged in, prompt user auth
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const normTarget = normalizePlanId(plan.name || plan.id);
    const currentNorm = normalizePlanId(currentSub?.plan_id);

    // If clicking Free plan
    if (normTarget === 'free') {
      if (currentNorm === 'free') {
        setSuccessMessage('You are currently on the Explorer (Free) plan.');
      } else {
        setSuccessMessage('You have an active premium membership.');
      }
      return;
    }

    // If already subscribed to this plan
    if (currentNorm === normTarget && currentSub?.payment_status === 'active') {
      setSuccessMessage(`You are already subscribed to ${plan.name}!`);
      return;
    }

    setProcessingPlan(plan.name);

    await initiatePlanSubscription({
      user,
      plan,
      billingCycle,
      onSuccess: (newSub) => {
        setProcessingPlan(null);
        setCurrentSub(newSub);
        setSuccessMessage(`🎉 Welcome to ${plan.name}! Your payment has been verified and your subscription is active.`);
        if (onSuccessSubscription) onSuccessSubscription(newSub);
      },
      onError: (msg) => {
        setProcessingPlan(null);
        setErrorMessage(msg || 'Payment could not be completed. Please try again.');
      }
    });
  };

  return (
    <section id="plans-section" style={{
      padding: '90px 0',
      backgroundColor: '#F8FAFC'
    }}>
      <div className="container">

        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="section-tag">
              <Sparkles size={14} /> Flexible Membership Plans
            </div>
            <h2 className="section-title">
              Simple, Transparent Pricing in USD ($)
            </h2>
            <p className="section-subtitle">
              Unlock unlimited verified matching, encrypted direct messaging, and split-expense safety features. All transactions are securely processed in USD ($).
            </p>

            {/* Error Message Toast */}
            {errorMessage && (
              <div style={{
                backgroundColor: '#FEF2F2',
                color: '#EF4444',
                border: '1px solid #FCA5A5',
                padding: '12px 20px',
                borderRadius: '12px',
                margin: '20px auto 0',
                maxWidth: '600px',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Success Message Toast */}
            {successMessage && (
              <div style={{
                backgroundColor: '#F0FDF4',
                color: '#16A34A',
                border: '1px solid #86EFAC',
                padding: '12px 20px',
                borderRadius: '12px',
                margin: '20px auto 0',
                maxWidth: '600px',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                {successMessage}
              </div>
            )}

            {/* Billing Toggle */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '999px',
              padding: '4px',
              marginTop: '28px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  background: billingCycle === 'monthly' ? '#0B132B' : 'transparent',
                  color: billingCycle === 'monthly' ? '#FFFFFF' : '#64748B',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                Monthly Billing
              </button>

              <button
                onClick={() => setBillingCycle('annual')}
                style={{
                  background: billingCycle === 'annual' ? '#FF5E00' : 'transparent',
                  color: billingCycle === 'annual' ? '#FFFFFF' : '#64748B',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Annual Billed (Save 25%)
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'stretch'
        }}>
          {plans.map((plan, idx) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            const normTarget = normalizePlanId(plan.name || plan.id);
            const currentNorm = normalizePlanId(currentSub?.plan_id);
            const isCurrentActive = currentSub?.payment_status === 'active' && currentNorm === normTarget;
            const isBusy = processingPlan === plan.name;

            return (
              <ScrollReveal key={idx} animation="zoom-in" delay={100 + idx * 100}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '28px',
                    padding: '36px 28px',
                    border: isCurrentActive
                      ? '2.5px solid #10B981'
                      : plan.popular
                        ? '2px solid #FF5E00'
                        : '1px solid #E2E8F0',
                    boxShadow: plan.popular ? '0 20px 45px rgba(255, 94, 0, 0.2)' : '0 8px 24px rgba(0,0,0,0.04)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = plan.popular ? 'scale(1.04) translateY(-6px)' : 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(255, 94, 0, 0.22)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = plan.popular ? '0 20px 45px rgba(255, 94, 0, 0.2)' : '0 8px 24px rgba(0,0,0,0.04)';
                  }}
                >

                  {/* Card Top */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        backgroundColor: plan.popular ? '#FFF4EC' : '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {plan.icon}
                      </div>

                      <span style={{
                        backgroundColor: isCurrentActive
                          ? '#10B981'
                          : plan.popular
                            ? '#FF5E00'
                            : '#F1F5F9',
                        color: (isCurrentActive || plan.popular) ? '#FFFFFF' : '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        padding: '4px 14px',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {isCurrentActive && <CheckCircle2 size={13} />}
                        {isCurrentActive ? 'ACTIVE PLAN' : plan.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
                      {plan.name}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                      {plan.desc}
                    </p>

                    {/* Price Display */}
                    <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.2rem', fontWeight: 900, color: '#0F172A', transition: 'all 0.3s ease' }}>
                        ${price}
                      </span>
                      <span style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 600 }}>
                        / month {billingCycle === 'annual' && price > 0 ? '(billed annually)' : ''}
                      </span>
                    </div>

                    {/* Features list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: plan.popular ? 'rgba(255, 94, 0, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: plan.popular ? '#FF5E00' : '#10B981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Check size={13} />
                          </div>
                          <span style={{ fontWeight: 500 }}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isBusy}
                    className={plan.popular ? "btn-primary" : "btn-outline"}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '14px',
                      borderRadius: '16px',
                      fontSize: '0.95rem',
                      opacity: isBusy ? 0.7 : 1,
                      cursor: isBusy ? 'wait' : 'pointer'
                    }}
                  >
                    {isBusy ? 'Verifying Payment...' : isCurrentActive ? 'Current Active Plan' : plan.cta}
                    {!isBusy && <ArrowRight size={16} />}
                  </button>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
