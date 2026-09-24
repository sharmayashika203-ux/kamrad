import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Compass, ShieldCheck, Users, Plane } from 'lucide-react';
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
        opacity: 0.45,
        filter: 'contrast(1.15) saturate(1.25)'
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
          <h1 className="hero-headline" style={{
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


        </ScrollReveal>

        {/* Interactive Search & Filter Card */}
        <ScrollReveal animation="zoom-in" delay={150}>
          <form
            onSubmit={handleSearchSubmit}
            className="hero-search-form"
          >

            {/* Destination Field */}
            <div className="hero-input-field">
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.03em' }}>
                <MapPin size={13} style={{ color: '#FF5E00' }} /> Where to?
              </label>
              <input
                type="text"
                placeholder="e.g. Bali, Tokyo..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                  width: '100%',
                  textOverflow: 'ellipsis'
                }}
              />
            </div>

            {/* Dates Field */}
            <div className="hero-input-field">
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.03em' }}>
                <Calendar size={13} style={{ color: '#00F0FF' }} /> Travel Dates
              </label>
              <select
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textOverflow: 'ellipsis'
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
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.03em' }}>
                <Compass size={13} style={{ color: '#A855F7' }} /> Travel Vibe
              </label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textOverflow: 'ellipsis'
                }}
              >
                <option value="All Vibes">All Vibes</option>
                <option value="Adventure">🏔️ Hiking & Adventure</option>
                <option value="Beach">🏝️ Beach & Chill</option>
                <option value="Nomad">💻 Digital Nomad</option>
                <option value="Foodie">🍜 Food & Culture</option>
                <option value="Luxury">💎 Luxury Escape</option>
              </select>
            </div>

            {/* Companion Gender Preference */}
            <div className="hero-input-field">
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.03em' }}>
                <Users size={13} style={{ color: '#10B981' }} /> Companion Vibe
              </label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textOverflow: 'ellipsis'
                }}
              >
                <option value="Any">Any Gender</option>
                <option value="Female Only">👩 Female Only</option>
                <option value="Male Only">👨 Male Only</option>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            padding: '16px 20px',
            borderRadius: '24px',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
            marginTop: '20px'
          }}>
            {[
              { 
                value: '450,000+', 
                label: 'Verified Companions', 
                icon: <Users size={20} style={{ color: '#FF7A00' }} />,
                bgGlow: 'rgba(255, 122, 0, 0.2)',
                borderGlow: 'rgba(255, 122, 0, 0.5)'
              },
              { 
                value: '120+ Countries', 
                label: 'Global Destinations', 
                icon: <MapPin size={20} style={{ color: '#00F0FF' }} />,
                bgGlow: 'rgba(0, 240, 255, 0.2)',
                borderGlow: 'rgba(0, 240, 255, 0.5)'
              },
              { 
                value: '99.4%', 
                label: 'ID Verification Rating', 
                icon: <ShieldCheck size={20} style={{ color: '#10B981' }} />,
                bgGlow: 'rgba(16, 185, 129, 0.2)',
                borderGlow: 'rgba(16, 185, 129, 0.5)'
              },
              { 
                value: '1.8 Million', 
                label: 'Trip Matches Made', 
                icon: <Plane size={20} style={{ color: '#EC4899' }} />,
                bgGlow: 'rgba(236, 72, 153, 0.2)',
                borderGlow: 'rgba(236, 72, 153, 0.5)'
              }
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = stat.bgGlow;
                  e.currentTarget.style.borderColor = stat.borderGlow;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 10px 25px ${stat.bgGlow}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: stat.bgGlow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1.5px solid ${stat.borderGlow}`,
                  boxShadow: `0 0 15px ${stat.bgGlow}`,
                  flexShrink: 0
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#F1F5F9', fontWeight: 600, letterSpacing: '0.01em' }}>
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
          border-radius: 20px;
          padding: 10px 12px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), 0 0 25px rgba(255, 94, 0, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.9);
          color: #0F172A;
          display: grid;
          grid-template-columns: 1.15fr 1fr 1fr 1fr auto;
          gap: 8px;
          align-items: center;
          margin-bottom: 28px;
          width: 100%;
          max-width: 1060px;
        }

        .hero-input-field {
          display: flex;
          flex-direction: column;
          gap: 3px;
          background-color: #F8FAFC;
          padding: 8px 12px;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          transition: all 0.2s ease;
          min-width: 0;
        }

        .hero-input-field:focus-within, .hero-input-field:hover {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .hero-search-btn {
          height: 48px !important;
          padding: 0 20px !important;
          font-size: 0.92rem !important;
          font-weight: 800 !important;
          border-radius: 14px !important;
          box-shadow: 0 6px 20px rgba(255, 94, 0, 0.35) !important;
          justify-content: center !important;
          white-space: nowrap !important;
        }

        @media (max-width: 768px) {
          .hero-headline {
            font-size: 2.2rem !important;
          }
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
