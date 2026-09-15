import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, User, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { refreshProfile, setDemoUser } = useAuth();

  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [step, setStep] = useState('credentials'); // 'credentials' or 'otp'
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Resend cooldown timer in seconds
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Reset modal state when closed or opened
  useEffect(() => {
    if (!isOpen) {
      setStep('credentials');
      setOtpCode('');
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  // Send OTP handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (loading || resendCooldown > 55) return; // prevent duplicate clicks

    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (tab === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }

    setLoading(true);

    // If Supabase .env keys are unconfigured, run in safe Local Test Sandbox Mode
    if (!isConfigured) {
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
        setResendCooldown(60);
        setSuccessMsg(`Test Sandbox Mode: Enter test OTP code 123456 to complete ${tab === 'register' ? 'registration' : 'login'}.`);
      }, 400);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          data: {
            full_name: name.trim(),
          },
          shouldCreateUser: tab === 'register',
        },
      });

      if (error) {
        console.error('Supabase signInWithOtp error:', error);
        if (error.message.includes('User not found') || error.status === 422) {
          setErrorMsg('Account not found with this email. Please switch to "Create Account" tab to register.');
        } else if (error.message.includes('rate limit') || error.status === 429) {
          setErrorMsg('Too many authentication requests sent. Please wait a minute before requesting another code.');
        } else {
          setErrorMsg(error.message || 'Failed to send verification code. Please check your email.');
        }
        return;
      }

      setStep('otp');
      setResendCooldown(60);
      setSuccessMsg(`A 6-digit OTP verification code was sent to ${email.trim()}`);
    } catch (err) {
      console.error('Network failure sending OTP:', err);
      setErrorMsg('Network error: Unable to reach authentication server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMsg('');
    setSuccessMsg('');

    const cleanOtp = otpCode.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP verification code.');
      return;
    }

    setLoading(true);

    // Test Sandbox Mode fallback if Supabase keys not set in .env
    if (!isConfigured) {
      setTimeout(() => {
        setLoading(false);
        if (cleanOtp !== '123456' && cleanOtp !== '000000') {
          setErrorMsg('Invalid test code. Please enter 123456 to verify in sandbox mode.');
          return;
        }

        const demoUser = {
          id: `usr_demo_${Date.now()}`,
          email: email.trim().toLowerCase(),
          user_metadata: { full_name: name.trim() || 'Traveler' }
        };
        const demoSession = {
          access_token: `demo_token_${Date.now()}`,
          user: demoUser
        };

        if (setDemoUser) setDemoUser(demoUser, demoSession);

        setSuccessMsg('Verification successful! Authenticating account...');
        setTimeout(() => {
          onClose();
          if (onAuthSuccess) onAuthSuccess(demoSession);
        }, 800);
      }, 500);
      return;
    }

    try {
      let { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: cleanOtp,
        type: 'email',
      });

      // Retry with type: 'signup' if type 'email' yields error on signup
      if (error && tab === 'register') {
        const retryRes = await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: cleanOtp,
          type: 'signup',
        });
        if (!retryRes.error) {
          data = retryRes.data;
          error = null;
        }
      }

      if (error) {
        console.error('Supabase verifyOtp error:', error);
        if (error.message.includes('expired')) {
          setErrorMsg('The OTP code has expired. Please click "Resend Code" below to receive a new 6-digit code.');
        } else {
          setErrorMsg('Invalid verification code. Please check your email and enter the latest 6-digit code.');
        }
        return;
      }

      if (data?.session) {
        setSuccessMsg('Verification successful! Authenticating account...');
        await refreshProfile();
        
        setTimeout(() => {
          onClose();
          if (onAuthSuccess) {
            onAuthSuccess(data.session);
          }
        }, 800);
      } else {
        setErrorMsg('Authentication complete but session could not be established. Please try logging in.');
      }
    } catch (err) {
      console.error('Network failure verifying OTP:', err);
      setErrorMsg('Network error while verifying code. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!isConfigured) {
      setTimeout(() => {
        setLoading(false);
        setResendCooldown(60);
        setSuccessMsg(`Test code 123456 ready for ${email.trim()}`);
      }, 300);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          data: {
            full_name: name.trim(),
          },
          shouldCreateUser: tab === 'register',
        },
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to resend verification code.');
        return;
      }

      setResendCooldown(60);
      setSuccessMsg(`New 6-digit verification code resent to ${email.trim()}`);
    } catch (err) {
      console.error('Resend OTP network error:', err);
      setErrorMsg('Network failure resending OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px', padding: '32px' }}>
        
        <button onClick={onClose} className="close-btn" disabled={loading}>
          <X size={20} />
        </button>

        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            backgroundColor: '#FFF4EC',
            color: '#FF5E00',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            border: '1px solid #FFD8A8'
          }}>
            <ShieldCheck size={26} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>
            {step === 'otp'
              ? 'Enter Verification Code'
              : tab === 'login'
              ? 'Welcome Back to Kamrad'
              : 'Join Verified Travel Network'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
            {step === 'otp'
              ? `We sent a 6-digit OTP code to ${email}`
              : tab === 'login'
              ? 'Log in to connect with active travel buddies'
              : 'Create an account with 100% ID verification'}
          </p>
        </div>

        {/* Informative notice if .env has placeholder keys */}
        {!isConfigured && (
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#1E40AF',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '0.82rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Test Sandbox Mode Active:</strong> You can test immediately using test OTP code <code>123456</code>. (To send live emails, update <code>VITE_SUPABASE_URL</code> in <code>.env</code>).
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{errorMsg}</div>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMsg && (
          <div style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#059669',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{successMsg}</div>
          </div>
        )}

        {/* Step 1: Login / Register Tab Switcher & Form */}
        {step === 'credentials' && (
          <>
            <div style={{
              display: 'flex',
              backgroundColor: '#F1F5F9',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => { setTab('login'); setErrorMsg(''); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: tab === 'login' ? '#FFFFFF' : 'transparent',
                  color: tab === 'login' ? '#0F172A' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: tab === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setErrorMsg(''); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: tab === 'register' ? '#FFFFFF' : 'transparent',
                  color: tab === 'register' ? '#0F172A' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: tab === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tab === 'register' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                    Full Legal Name (as on Passport) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94A3B8' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                  Email Address <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94A3B8' }} />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  marginTop: '8px',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Sending OTP Code...' : tab === 'login' ? 'Send Login Code' : 'Send Verification Code'}
                <ArrowRight size={16} />
              </button>
            </form>
          </>
        )}

        {/* Step 2: OTP Input & Verification Form */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
                6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: '2px solid #FF5E00',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  letterSpacing: '0.4em',
                  textAlign: 'center',
                  color: '#0F172A',
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(255, 94, 0, 0.15)'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                opacity: (loading || otpCode.length < 6) ? 0.7 : 1,
                cursor: (loading || otpCode.length < 6) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP & Continue'}
              <CheckCircle2 size={16} />
            </button>

            {/* Actions Footer: Resend OTP & Back */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '8px',
              fontSize: '0.82rem',
              color: '#64748B'
            }}>
              <button
                type="button"
                onClick={() => { setStep('credentials'); setErrorMsg(''); setOtpCode(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ArrowLeft size={14} /> Change Email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendCooldown > 0 ? '#94A3B8' : '#FF5E00',
                  fontWeight: 700,
                  cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={13} className={loading ? 'spin' : ''} />
                {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
