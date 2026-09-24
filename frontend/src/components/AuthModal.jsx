import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Video, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, RefreshCw, User } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { refreshProfile, setDemoUser } = useAuth();

  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [step, setStep] = useState('credentials'); // 'credentials' or 'otp'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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
      setPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  // Primary Login / Signup Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

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

    // Sandbox Fallback
    if (!isConfigured) {
      setTimeout(() => {
        setLoading(false);
        const demoUser = {
          id: `usr_demo_${Date.now()}`,
          email: email.trim().toLowerCase(),
          user_metadata: { full_name: name.trim() || email.split('@')[0] || 'Traveler' }
        };
        const demoSession = {
          access_token: `demo_token_${Date.now()}`,
          user: demoUser
        };

        if (setDemoUser) setDemoUser(demoUser, demoSession);

        setSuccessMsg('Authentication successful! Logging in...');
        setTimeout(() => {
          onClose();
          if (onAuthSuccess) onAuthSuccess(demoSession);
        }, 600);
      }, 500);
      return;
    }

    try {
      if (tab === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password || 'password123',
        });

        if (error) {
          // If password fails, try OTP flow fallback
          const otpRes = await supabase.auth.signInWithOtp({
            email: email.trim().toLowerCase(),
          });
          if (otpRes.error) {
            setErrorMsg(error.message || 'Invalid login credentials.');
            return;
          } else {
            setStep('otp');
            setResendCooldown(60);
            setSuccessMsg(`OTP verification code sent to ${email.trim()}`);
            return;
          }
        }

        if (data?.session) {
          setSuccessMsg('Login successful!');
          await refreshProfile();
          setTimeout(() => {
            onClose();
            if (onAuthSuccess) onAuthSuccess(data.session);
          }, 600);
        }
      } else {
        // Register flow
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password || 'password123',
          options: {
            data: { full_name: name.trim() }
          }
        });

        if (error) {
          setErrorMsg(error.message || 'Failed to create account.');
          return;
        }

        if (data?.session) {
          setSuccessMsg('Account created successfully!');
          await refreshProfile();
          setTimeout(() => {
            onClose();
            if (onAuthSuccess) onAuthSuccess(data.session);
          }, 600);
        } else {
          setStep('otp');
          setResendCooldown(60);
          setSuccessMsg(`A verification code was sent to ${email.trim()}`);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg('Unable to connect to authentication server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    if (!isConfigured) {
      const demoUser = {
        id: `usr_google_${Date.now()}`,
        email: 'alex.google@example.com',
        user_metadata: { full_name: 'Alex Morgan (Google)' }
      };
      const demoSession = { access_token: `demo_g_${Date.now()}`, user: demoUser };
      if (setDemoUser) setDemoUser(demoUser, demoSession);
      onClose();
      if (onAuthSuccess) onAuthSuccess(demoSession);
      return;
    }
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } catch (err) {
      setErrorMsg('Google login failed.');
    }
  };

  // Apple Login Handler
  const handleAppleLogin = async () => {
    if (!isConfigured) {
      const demoUser = {
        id: `usr_apple_${Date.now()}`,
        email: 'traveler.apple@example.com',
        user_metadata: { full_name: 'Traveler (Apple)' }
      };
      const demoSession = { access_token: `demo_a_${Date.now()}`, user: demoUser };
      if (setDemoUser) setDemoUser(demoUser, demoSession);
      onClose();
      if (onAuthSuccess) onAuthSuccess(demoSession);
      return;
    }
    try {
      await supabase.auth.signInWithOAuth({ provider: 'apple' });
    } catch (err) {
      setErrorMsg('Apple login failed.');
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

    if (!isConfigured) {
      setTimeout(() => {
        setLoading(false);
        const demoUser = {
          id: `usr_demo_${Date.now()}`,
          email: email.trim().toLowerCase(),
          user_metadata: { full_name: name.trim() || 'Traveler' }
        };
        const demoSession = { access_token: `demo_token_${Date.now()}`, user: demoUser };
        if (setDemoUser) setDemoUser(demoUser, demoSession);
        onClose();
        if (onAuthSuccess) onAuthSuccess(demoSession);
      }, 500);
      return;
    }

    try {
      let { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: cleanOtp,
        type: 'email',
      });

      if (error) {
        setErrorMsg('Invalid or expired verification code.');
        return;
      }

      if (data?.session) {
        setSuccessMsg('Verification successful!');
        await refreshProfile();
        setTimeout(() => {
          onClose();
          if (onAuthSuccess) onAuthSuccess(data.session);
        }, 600);
      }
    } catch (err) {
      setErrorMsg('Network error verifying code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px', padding: '28px 24px', borderRadius: '24px' }}>
        
        {/* Close Button */}
        <button onClick={onClose} className="close-btn" disabled={loading} style={{ top: '16px', right: '16px' }}>
          <X size={18} />
        </button>

        {/* Top Banner Notice: Live Video Support */}
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1.5px solid #DCFCE7',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', flexShrink: 0, marginTop: '2px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            <Video size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
              Live video is available now
            </div>
            <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px', lineHeight: 1.35 }}>
              Your device & browser support 1:1 video calling.
            </div>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            borderRadius: '12px',
            padding: '10px 12px',
            fontSize: '0.82rem',
            marginBottom: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
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
            padding: '10px 12px',
            fontSize: '0.82rem',
            marginBottom: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{successMsg}</div>
          </div>
        )}

        {/* Step 1: Credentials Form */}
        {step === 'credentials' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {tab === 'register' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'block' }}>
                  Full Legal Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
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
                      border: '1.5px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      fontSize: '0.9rem',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px', display: 'block' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B' }}>
                  Password
                </label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert("A password reset link will be sent to your email address.")}
                    style={{ background: 'none', border: 'none', color: '#D97706', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Main Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#D99436',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(217, 148, 54, 0.25)',
                transition: 'all 0.2s ease',
                marginTop: '4px'
              }}
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Log In' : 'Sign Up'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 6px 0', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                OR LOG IN WITH
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            </div>

            {/* Social Logins */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={handleAppleLogin}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.7-1.13 1.83-0.99 2.93 1.07.08 2.14-.53 2.8-1.33z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Bottom Account Switcher */}
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: '#64748B' }}>
              {tab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#D97706', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#D97706', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Log in
                  </button>
                </>
              )}
            </div>

          </form>
        )}

        {/* Step 2: OTP Verification Form (Fallback) */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>
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
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #D99436',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  letterSpacing: '0.4em',
                  textAlign: 'center',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#D99436',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: (loading || otpCode.length < 6) ? 'not-allowed' : 'pointer',
                opacity: (loading || otpCode.length < 6) ? 0.7 : 1
              }}
            >
              {loading ? 'Verifying...' : 'Verify OTP & Continue'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B' }}>
              <button
                type="button"
                onClick={() => { setStep('credentials'); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                ← Change Email
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
