import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Compass, ShieldCheck, Users, Sparkles, Filter, ArrowRight, Plane, Globe, Award } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import confetti from 'canvas-confetti';

const DESTINATION_ROTATIONS = [
  "Bali, Indonesia 🌴",
  "Tokyo, Japan 🌸",
  "Swiss Alps 🏔️",
  "Santorini, Greece 🌅",
  "Reykjavik, Iceland 🌌",
  "Amalfi Coast, Italy 🇮🇹"
];

export default function Hero({ onSearch, onOpenWizard }) {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('Next 30 Days');
  const [vibe, setVibe] = useState('All Vibes');
  const [genderFilter, setGenderFilter] = useState('Any');

  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [fadeText, setFadeText] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeText(false);
      setTimeout(() => {
        setRotatingIndex((prev) => (prev + 1) % DESTINATION_ROTATIONS.length);
        setFadeText(true);
      }, 250);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 75,
      spread: 75,
      origin: { y: 0.6 }
    });
    onSearch({ destination, dates, vibe, genderFilter });
    const target = document.getElementById('kamrads-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const quickPills = [
    { label: '🏝️ Bali, Indonesia', value: 'Bali' },
    { label: '🏛️ Santorini, Greece', value: 'Santorini' },
    { label: '🌸 Tokyo, Japan', value: 'Tokyo' },
    { label: '🏔️ Swiss Alps', value: 'Swiss Alps' },
    { label: '🌋 Reykjavik, Iceland', value: 'Iceland' }
  ];

  return (
    <section style={{
      position: 'relative',
      minHeight: '700px',
      display: 'flex',
      alignItems: 'center',
      padding: '60px 0 80px 0',
      background: 'linear-gradient(135deg, #0B132B 0%, #1C2541 50%, #0F172A 100%)',
      overflow: 'hidden',
      color: '#FFFFFF'
    }}>
      {/* Background Image with Vibrant Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url('/images/hero_travel_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.35,
        filter: 'contrast(1.1) saturate(1.2)'
      }} />

      {/* Dynamic Animated Gradient Light Orbs */}
      <div className="float-slow" style={{
        position: 'absolute',
        top: '-120px',
        left: '-120px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 94, 0, 0.45) 0%, rgba(255, 94, 0, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div className="float-slow" style={{
        position: 'absolute',
        bottom: '-120px',
        right: '-120px',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.35) 0%, rgba(0, 240, 255, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        animationDelay: '-3.5s',
        pointerEvents: 'none'
      }} />

      {/* Floating Travel Graphic Element */}
      <div className="float-element hero-floating-badge" style={{
        position: 'absolute',
        top: '32px',
        right: '4%',
        zIndex: 2,
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '20px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
        pointerEvents: 'none'
      }}>
        <div style={{ backgroundColor: '#FF5E00', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plane size={16} style={{ color: '#FFF' }} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>Next Trip Flight</div>
          <div style={{ fontSize: '0.7rem', color: '#00F0FF', fontWeight: 700 }}>Bali ✈️ Tokyo Matched</div>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Entrance Animation Wrap for Header Content */}
        <ScrollReveal animation="fade-up" delay={0}>
          {/* Top Floating Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '6px 18px',
            borderRadius: '999px',
            marginBottom: '20px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
          }}>
            <Sparkles size={16} style={{ color: '#FF8A00' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
              #1 Rated Verified Travel Matching Platform
            </span>
            <span style={{
              backgroundColor: '#FF5E00',
              color: '#FFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              VERIFIED
            </span>
          </div>

          {/* Main Headline with Dynamic Rotating Text */}
          <h1 style={{
            fontSize: '3.6rem',
            fontWeight: 900,
            lineHeight: 1.1,
            maxWidth: '860px',
            marginBottom: '18px',
            letterSpacing: '-0.03em',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            Find Your Perfect <span className="animated-gradient-text">Travel Companion</span> for{' '}
            <span style={{
              display: 'inline-block',
              color: '#00F0FF',
              textShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
              opacity: fadeText ? 1 : 0,
              transform: fadeText ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.25s ease, transform 0.25s ease'
            }}>
              {DESTINATION_ROTATIONS[rotatingIndex]}
            </span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#E2E8F0',
            maxWidth: '680px',
            marginBottom: '32px',
            lineHeight: 1.5,
            fontWeight: 400
          }}>
            Connect with 100% ID-verified travel buddies matching your dates, destination, budget, and travel vibe. Split costs, share unforgettable memories & never travel alone again.
          </p>
        </ScrollReveal>

        {/* Interactive Search & Filter Card */}
        <ScrollReveal animation="zoom-in" delay={150}>
          <form
            onSubmit={handleSearchSubmit}
            className="hero-search-form"
          >

            {/* Destination Field */}
            <div className="hero-input-field">
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} style={{ color: '#FF5E00' }} /> Where to?
              </label>
              <input
                type="text"
                placeholder="e.g. Bali, Tokyo, Paris..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>

            {/* Dates Field */}
            <div className="hero-input-field">
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} style={{ color: '#00F0FF' }} /> Travel Dates
              </label>
              <select
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option value="Anytime">Anytime Flexible</option>
                <option value="Next 30 Days">Next 30 Days</option>
                <option value="October 2026">October 2026</option>
                <option value="November 2026">November 2026</option>
                <option value="December 2026">Holidays 2026</option>
              </select>
            </div>

            {/* Vibe Field */}
            <div className="hero-input-field">
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Compass size={13} style={{ color: '#A855F7' }} /> Travel Vibe
              </label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option value="All Vibes">All Vibes & Styles</option>
                <option value="Adventure">🏔️ Hiking & Adventure</option>
                <option value="Beach">🏝️ Beach & Chill</option>
                <option value="Nomad">💻 Digital Nomad</option>
                <option value="Foodie">🍜 Food & Culture</option>
                <option value="Luxury">✨ Luxury Escape</option>
              </select>
            </div>

            {/* Companion Gender Preference */}
            <div className="hero-input-field">
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={13} style={{ color: '#10B981' }} /> Companion Vibe
              </label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option value="Any">Any Gender / Vibe</option>
                <option value="Female Only">👩 Female Only</option>
                <option value="Male Only">👨 Male Only</option>
                <option value="LGBTQ+ Friendly">🌈 LGBTQ+ Friendly</option>
                <option value="Small Group">👥 Small Group (3-4)</option>
              </select>
            </div>

            {/* Search CTA */}
            <button
              type="submit"
              className="btn-primary hero-search-btn"
            >
              <Search size={18} />
              Find Kamrads
            </button>
          </form>
        </ScrollReveal>

        {/* Quick Destination Filter Pills */}
        <ScrollReveal animation="fade-up" delay={250}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '36px'
          }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#CBD5E1' }}>
              Trending Hubs:
            </span>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDestination(pill.value);
                  onSearch({ destination: pill.value, dates, vibe, genderFilter });
                  const target = document.getElementById('kamrads-section');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#FF5E00';
                  e.currentTarget.style.borderColor = '#FF5E00';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 94, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Live Metrics Grid */}
        <ScrollReveal animation="fade-up" delay={350}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            {[
              { value: '450,000+', label: 'Verified Travelers', icon: <Users size={18} style={{ color: '#FF5E00' }} /> },
              { value: '120+ Countries', label: 'Global Destinations', icon: <MapPin size={18} style={{ color: '#00F0FF' }} /> },
              { value: '99.4%', label: 'ID Verification Rating', icon: <ShieldCheck size={18} style={{ color: '#10B981' }} /> },
              { value: '1.8 Million', label: 'Trip Matches Made', icon: <Sparkles size={18} style={{ color: '#EC4899' }} /> }
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>

      {/* Responsive Style Overrides */}
      <style>{`
        .hero-search-form {
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 16px 20px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 94, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.9);
          color: #0F172A;
          display: grid;
          grid-template-columns: repeat(4, 1fr) auto;
          gap: 12px;
          align-items: center;
          margin-bottom: 28px;
        }

        .hero-input-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background-color: #F8FAFC;
          padding: 10px 14px;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
        }

        .hero-search-btn {
          height: 52px !important;
          padding: 0 28px !important;
          font-size: 0.98rem !important;
          font-weight: 800 !important;
          border-radius: 16px !important;
          box-shadow: 0 8px 24px rgba(255, 94, 0, 0.4) !important;
          justify-content: center !important;
          white-space: nowrap !important;
        }

        @media (max-width: 1024px) {
          .hero-search-form {
            grid-template-columns: repeat(2, 1fr);
          }
          .hero-search-btn {
            grid-column: 1 / -1;
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .hero-search-form {
            grid-template-columns: 1fr;
          }
          .hero-search-btn {
            grid-column: 1 / -1;
            width: 100%;
          }
        }

        @media (max-width: 1200px) {
          .hero-floating-badge {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
