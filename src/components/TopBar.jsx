import React, { useState, useEffect } from 'react';
import { Mail, Clock, ShieldCheck, Sparkles, Globe2 } from 'lucide-react';

const TICKER_MESSAGES = [
  "🔥 2,840 Kamrad matches made in Bali, Tokyo & Santorini this week!",
  "🛡️ 100% ID & Biometric Verification Guarantee for all active profiles",
  "✈️ Split Airbnb & Car Rental costs up to 50% with verified travel buddies",
  "⭐ Rated 4.9/5 by over 18,400 solo travelers worldwide"
];

export default function TopBar({ onOpenAuth, currency, setCurrency }) {
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      backgroundColor: '#0B132B',
      color: '#E2E8F0',
      fontSize: '0.82rem',
      padding: '8px 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Left Info Links matching user screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a
            href="mailto:info@kamradfinder.com"
            style={{
              color: '#F1F5F9',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'}
            onMouseOut={(e) => e.currentTarget.style.color = '#F1F5F9'}
          >
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 107, 0, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF6B00'
            }}>
              <Mail size={13} />
            </span>
            info@kamradfinder.com
          </a>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#94A3B8'
          }}>
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00E5FF'
            }}>
              <Clock size={13} />
            </span>
            <span>9 AM to 5 PM MST</span>
          </div>
        </div>

        {/* Center Live Animated Ticker */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '4px 14px',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '420px',
          overflow: 'hidden'
        }}>
          <Sparkles size={14} style={{ color: '#FF6B00', flexShrink: 0 }} />
          <span style={{
            fontSize: '0.8rem',
            color: '#F8FAFC',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'all 0.4s ease'
          }}>
            {TICKER_MESSAGES[tickerIndex]}
          </span>
        </div>

        {/* Right Verified Badge matching screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Currency Switcher */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Globe2 size={13} style={{ color: '#94A3B8' }} />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#F1F5F9',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="USD" style={{ color: '#000' }}>$ USD (US Dollar)</option>
              <option value="INR" style={{ color: '#000' }}>₹ INR (India)</option>
              <option value="EUR" style={{ color: '#000' }}>€ EUR (Euro)</option>
              <option value="GBP" style={{ color: '#000' }}>£ GBP (Pound)</option>
            </select>
          </div>

          <div
            onClick={onOpenAuth}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 230, 118, 0.08)',
              border: '1px solid rgba(0, 230, 118, 0.4)',
              borderRadius: '999px',
              padding: '4px 12px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div className="pulse-dot" />
            <ShieldCheck size={14} style={{ color: '#00E676' }} />
            <span style={{
              color: '#00E676',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.02em'
            }}>
              100% ID Verified Platform
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
