import React, { useState } from 'react';
import { Search, MapPin, Calendar, Compass, ShieldCheck, Users, Sparkles, Filter, ArrowRight } from 'lucide-react';

export default function Hero({ onSearch, onOpenWizard }) {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('Next 30 Days');
  const [vibe, setVibe] = useState('All Vibes');
  const [genderFilter, setGenderFilter] = useState('Any');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
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
      minHeight: '680px',
      display: 'flex',
      alignItems: 'center',
      padding: '60px 0 80px 0',
      background: 'linear-gradient(135deg, #0B132B 0%, #1C2541 50%, #0F172A 100%)',
      overflow: 'hidden',
      color: '#FFFFFF'
    }}>
      {/* Background Image with Vibrant Gradient Blur Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url('/images/hero_travel_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.35,
        filter: 'contrast(1.1) saturate(1.2)'
      }} />

      {/* Colorful Gradient Light Orbs */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(255, 107, 0, 0.35) 0%, rgba(255, 107, 0, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.25) 0%, rgba(0, 229, 255, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Top Floating Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '6px 18px',
          borderRadius: '999px',
          marginBottom: '24px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <Sparkles size={16} style={{ color: '#FF8A00' }} />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
            #1 Rated Verified Travel Matching Platform
          </span>
          <span style={{
            backgroundColor: '#FF6B00',
            color: '#FFF',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            VERIFIED
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 900,
          lineHeight: 1.1,
          maxWidth: '860px',
          marginBottom: '20px',
          letterSpacing: '-0.03em',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          Find Your Perfect <span style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FFA800 50%, #FF3D00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Travel Companion.</span> Safely.
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#E2E8F0',
          maxWidth: '680px',
          marginBottom: '36px',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          Connect with 100% ID-verified travel buddies matching your dates, destination, budget, and travel vibe. Split costs, share unforgettable memories & never travel alone again.
        </p>

        {/* Interactive Search & Filter Card */}
        <form onSubmit={handleSearchSubmit} style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          color: '#0F172A',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
          gap: '14px',
          alignItems: 'center',
          marginBottom: '24px'
        }}>

          {/* Destination Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backgroundColor: '#F8FAFC',
            padding: '12px 16px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0'
          }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} style={{ color: '#FF6B00' }} /> Where to?
            </label>
            <input
              type="text"
              placeholder="e.g. Bali, Tokyo, Paris..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.98rem',
                fontWeight: 700,
                color: '#0F172A',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          {/* Dates Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backgroundColor: '#F8FAFC',
            padding: '12px 16px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0'
          }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} style={{ color: '#00B0FF' }} /> Travel Dates
            </label>
            <select
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.95rem',
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backgroundColor: '#F8FAFC',
            padding: '12px 16px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0'
          }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Compass size={13} style={{ color: '#7C4DFF' }} /> Travel Vibe
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.95rem',
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backgroundColor: '#F8FAFC',
            padding: '12px 16px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0'
          }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={13} style={{ color: '#00C853' }} /> Companion Vibe
            </label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.95rem',
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
            className="btn-primary"
            style={{
              padding: '16px 28px',
              fontSize: '1rem',
              fontWeight: 800,
              height: '100%',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(255, 107, 0, 0.4)'
            }}
          >
            <Search size={20} />
            Find Kamrads
          </button>
        </form>

        {/* Quick Destination Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '40px'
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
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#FF6B00';
                e.currentTarget.style.borderColor = '#FF6B00';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Live Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {[
            { value: '450,000+', label: 'Verified Travelers', icon: <Users size={18} style={{ color: '#FF6B00' }} /> },
            { value: '120+ Countries', label: 'Global Destinations', icon: <MapPin size={18} style={{ color: '#00E5FF' }} /> },
            { value: '99.4%', label: 'ID Verification Rating', icon: <ShieldCheck size={18} style={{ color: '#00E676' }} /> },
            { value: '1.8 Million', label: 'Trip Matches Made', icon: <Sparkles size={18} style={{ color: '#E040FB' }} /> }
          ].map((stat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.15)'
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

      </div>
    </section>
  );
}
