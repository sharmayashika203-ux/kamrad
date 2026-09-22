import React, { useState } from 'react';
import { Compass, ShieldCheck, Mail, ArrowRight, Globe, Lock, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function Footer({ onOpenWizard, onOpenAuth, onOpenSupport }) {
  const [email, setEmail] = useState('');
  const [destInterest, setDestInterest] = useState('Bali');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const travelHubs = [
    { name: 'Bali, Indonesia', flag: '🏝️', count: 240, color: '#FF6B00' },
    { name: 'Santorini, Greece', flag: '🏛️', count: 210, color: '#00E5FF' },
    { name: 'Tokyo, Japan', flag: '🌸', count: 380, color: '#E040FB' },
    { name: 'Swiss Alps, CH', flag: '🏔️', count: 140, color: '#00E676' },
    { name: 'Reykjavik, Iceland', flag: '🌋', count: 115, color: '#7C4DFF' }
  ];

  const socialIcons = [
    { name: 'Instagram', href: 'https://www.instagram.com/kamradfinder', color: '#E1306C', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
    { name: 'Twitter', href: '#', color: '#1DA1F2', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { name: 'YouTube', href: 'https://youtube.com/@kamradfinder', color: '#FF0000', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> },
    { name: 'Discord', href: '#', color: '#5865F2', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6h0a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h12zm-9 6h.01M15 12h.01"/></svg> }
  ];

  return (
    <footer style={{
      backgroundColor: '#040914',
      color: '#94A3B8',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '60px',
      paddingBottom: '95px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      
      {/* Ambient Gradient Light Orbs in Background */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, rgba(255, 107, 0, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-150px',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, rgba(0, 229, 255, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '30%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(124, 77, 255, 0.12) 0%, rgba(124, 77, 255, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>

        {/* 1. PRE-FOOTER VIP CTA BANNER matching user screenshot */}
        <div style={{
          background: 'linear-gradient(180deg, #121A2D 0%, #0D1424 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          padding: '40px 48px',
          marginBottom: '60px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '28px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Glowing Top Rainbow Border Strip matching screenshot */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3.5px',
            background: 'linear-gradient(90deg, #FF7A00 0%, #00E5FF 50%, #D946EF 100%)'
          }} />

          <div>
            {/* Avatar Stack + Live Green Badge matching screenshot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                ].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Traveler"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #121A2D',
                      marginLeft: i > 0 ? '-12px' : 0
                    }}
                  />
                ))}
              </div>

              {/* Green Badge */}
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="pulse-dot" style={{ backgroundColor: '#10B981' }} />
                1,420 Active Matches Today
              </div>
            </div>

            {/* Headline matching screenshot */}
            <h3 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '10px',
              letterSpacing: '-0.025em',
              lineHeight: 1.15
            }}>
              Never Explore The World Alone.
            </h3>

            {/* Subtitle matching screenshot */}
            <p style={{
              fontSize: '1.02rem',
              color: '#94A3B8',
              maxWidth: '520px',
              lineHeight: 1.55,
              fontWeight: 400
            }}>
              Connect with 100% ID-verified travel companions who match your dates, destination, budget, and travel vibe.
            </p>
          </div>

          {/* Buttons Right Alignment matching screenshot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            
            {/* Glowing Orange Button */}
            <button
              onClick={onOpenWizard}
              style={{
                background: 'linear-gradient(135deg, #FF5500 0%, #FF7700 100%)',
                color: '#FFFFFF',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: '14px 28px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 30px rgba(255, 85, 0, 0.55), 0 4px 15px rgba(255, 85, 0, 0.35)',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 85, 0, 0.75), 0 6px 20px rgba(255, 85, 0, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 85, 0, 0.55), 0 4px 15px rgba(255, 85, 0, 0.35)';
              }}
            >
              <Sparkles size={18} />
              Find Companion Now
            </button>

            {/* Dark Outlined Button */}
            <button
              onClick={onOpenAuth}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '14px 24px',
                borderRadius: '14px',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = '#00E676';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <ShieldCheck size={18} style={{ color: '#00E676' }} />
              Verify Your ID
            </button>
          </div>
        </div>

        {/* 2. LIVE MARQUEE GLOBAL CONNECT TICKER */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '12px 20px',
          marginBottom: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00E5FF', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase' }}>
            <Globe size={16} /> Live Global Connections
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '0.84rem', color: '#E2E8F0', flexWrap: 'wrap' }}>
            <span>🇺🇸 Sophia & 🇪🇸 Elena ➔ 🏝️ Bali</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span>🇮🇪 Liam & 🇬🇧 Marcus ➔ 🌋 Iceland</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span>🇨🇦 Aria ➔ 🌅 Santorini</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span>🇮🇹 Diego ➔ 🌸 Tokyo</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00E676', fontSize: '0.8rem', fontWeight: 700 }}>
            <ShieldCheck size={14} /> 100% ID Authenticated
          </div>
        </div>

        {/* 3. MAIN 4-COLUMN ENHANCED GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>

          {/* COL 1: BRAND & SECURITY */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#0B132B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FF6B00',
                boxShadow: '0 0 20px rgba(255, 107, 0, 0.4)'
              }}>
                <Compass size={28} style={{ color: '#FF6B00', transform: 'rotate(15deg)' }} />
              </div>

              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                  Kamrad <span style={{
                    background: 'linear-gradient(135deg, #FF6B00 0%, #FF3D00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>Finder</span>
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.12em', marginTop: '3px', textTransform: 'uppercase' }}>
                  Verified Travel Matching
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
              The world's premier verified travel companion matching platform. Connecting safe, background-screened solo adventurers for split-cost trips worldwide.
            </p>

            {/* Trust Badges 2x2 Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '24px'
            }}>
              {[
                { text: '100% ID Verified', icon: '🛡️', color: '#00E676' },
                { text: 'Escrow Protected', icon: '🔒', color: '#00E5FF' },
                { text: 'Biometric Check', icon: '👤', color: '#E040FB' }
              ].map((badge, i) => (
                <div key={i} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>{badge.icon}</span> {badge.text}
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {socialIcons.map((soc, i) => (
                <a
                  key={i}
                  href={soc.href}
                  target={soc.href !== '#' ? '_blank' : '_self'}
                  rel={soc.href !== '#' ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (soc.href === '#') e.preventDefault();
                  }}
                  title={`Follow us on ${soc.name}`}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#CBD5E1',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = soc.color;
                    e.currentTarget.style.color = '#FFF';
                    e.currentTarget.style.borderColor = soc.color;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#CBD5E1';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {soc.svg}
                </a>
              ))}
            </div>

          </div>

          {/* COL 2: EXPLORE PLATFORM */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: '#FF6B00' }} /> Explore Platform
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              {[
                { title: 'Popular Destinations', href: '/' },
                { title: 'How Matching Works', href: '/how-it-works' },
                { title: '100% ID Safety Guarantee', href: '/about', tag: 'Guaranteed' },
                { title: 'Membership Plans', href: '/plans', tag: 'Save 25%' },
                { title: 'AI Companion Matchmaker', action: onOpenWizard, highlight: true },
                { title: 'Identity Verification Desk', action: onOpenAuth }
              ].map((link, idx) => {
                const isInternal = !!link.href;
                const linkStyle = {
                  color: link.highlight ? '#FF6B00' : '#94A3B8',
                  fontWeight: link.highlight ? 800 : 500,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  padding: '4px 0'
                };
                const handleMouseOver = (e) => {
                  if (!link.highlight) e.currentTarget.style.color = '#00E5FF';
                  e.currentTarget.style.transform = 'translateX(4px)';
                };
                const handleMouseOut = (e) => {
                  if (!link.highlight) e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.transform = 'translateX(0)';
                };
                const linkContent = (
                  <>
                    <span>{link.title} {link.highlight && '→'}</span>
                    {link.tag && (
                      <span style={{
                        backgroundColor: 'rgba(255, 107, 0, 0.15)',
                        color: '#FF6B00',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '999px'
                      }}>{link.tag}</span>
                    )}
                  </>
                );

                return isInternal ? (
                  <Link
                    key={idx}
                    to={link.href}
                    style={linkStyle}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {linkContent}
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.action) link.action();
                    }}
                    style={linkStyle}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {linkContent}
                  </a>
                );
              })}
            </div>
          </div>

          {/* COL 3: ACTIVE TRAVEL HUBS */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} style={{ color: '#00E5FF' }} /> Active Travel Hubs
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {travelHubs.map((hub, idx) => (
                <div
                  key={idx}
                  onClick={onOpenWizard}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = hub.color;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 600, color: '#F1F5F9' }}>
                    <span style={{ fontSize: '1.1rem' }}>{hub.flag}</span>
                    <span>{hub.name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#00E676', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: hub.color }}>
                      {hub.count} active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COL 4: TRAVEL COMPANION ALERTS & NEWSLETTER */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} style={{ color: '#E040FB' }} /> Travel Companion Alerts
            </h4>

            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '16px' }}>
              Subscribe to get instant alerts when verified travel companions post trips to your target destinations.
            </p>

            {subscribed ? (
              <div style={{
                backgroundColor: 'rgba(0, 230, 118, 0.15)',
                border: '1px solid rgba(0, 230, 118, 0.4)',
                color: '#00E676',
                padding: '14px',
                borderRadius: '16px',
                fontSize: '0.88rem',
                fontWeight: 700,
                textAlign: 'center',
                animation: 'fadeIn 0.3s ease'
              }}>
                <CheckCircle2 size={24} style={{ margin: '0 auto 6px auto', display: 'block' }} />
                Subscribed! Watch your inbox for destination alerts.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Destination Dropdown selection in newsletter */}
                <div style={{ position: 'relative' }}>
                  <select
                    value={destInterest}
                    onChange={(e) => setDestInterest(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      color: '#F1F5F9',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Bali" style={{ color: '#000' }}>Target: 🏝️ Bali, Indonesia</option>
                    <option value="Santorini" style={{ color: '#000' }}>Target: 🏛️ Santorini, Greece</option>
                    <option value="Tokyo" style={{ color: '#000' }}>Target: 🌸 Tokyo, Japan</option>
                    <option value="SwissAlps" style={{ color: '#000' }}>Target: 🏔️ Swiss Alps</option>
                    <option value="All" style={{ color: '#000' }}>Target: 🌍 All Worldwide Destinations</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      padding: '12px 20px',
                      borderRadius: '14px',
                      boxShadow: '0 6px 18px rgba(255, 107, 0, 0.4)'
                    }}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <Lock size={12} /> Spam-free • Unsubscribe anytime
                </div>
              </form>
            )}
          </div>

        </div>

        {/* 4. ENHANCED BOTTOM BAR */}
        <div style={{
          paddingTop: '32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '0.85rem'
        }}>
          
          {/* Copyright & Mail */}
          <div style={{ color: '#94A3B8' }}>
            © {new Date().getFullYear()} <strong style={{ color: '#FFF' }}>Kamrad Finder Inc.</strong> All Rights Reserved. • Support:{' '}
            <a href="mailto:info@kamradfinder.com" style={{ color: '#FF6B00', textDecoration: 'none', fontWeight: 700 }}>
              info@kamradfinder.com
            </a>
          </div>

          {/* Links & SOS Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }} className="footer-links-row">
            {/* Emergency SOS Hotline Pill */}
            <button
              onClick={onOpenSupport}
              style={{
                backgroundColor: 'rgba(255, 61, 0, 0.18)',
                border: '1px solid rgba(255, 61, 0, 0.5)',
                color: '#FF5E00',
                padding: '7px 16px',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(255, 61, 0, 0.25)',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 61, 0, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 61, 0, 0.18)';
              }}
            >
              <PhoneCall size={14} /> 24/7 Emergency SOS Line
            </button>

            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#94A3B8', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#94A3B8', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#94A3B8', textDecoration: 'none', fontWeight: 600 }}>Safety Guidelines</a>
          </div>

        </div>

      </div>
    </footer>
  );
}
