import React, { useState } from 'react';
import { Compass, ArrowRight, Menu, X, ChevronDown, MapPin, Sparkles, Shield, UserCheck } from 'lucide-react';

export default function Navbar({ onOpenWizard, onOpenAuth, onOpenSupport }) {
  const [activeTab, setActiveTab] = useState('Destinations');
  const [destMenuOpen, setDestMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id, name) => {
    setActiveTab(name);
    setMobileMenuOpen(false);
    setDestMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        padding: '0 24px'
      }}>

        {/* Brand Logo matching exact styling in user screenshot */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none'
          }}
        >
          {/* Logo Badge Icon */}
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#0B132B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(11, 19, 43, 0.25)',
            border: '2px solid #FF6B00',
            position: 'relative'
          }}>
            <Compass size={26} style={{ color: '#FF6B00', transform: 'rotate(25deg)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.45rem',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#0B132B'
            }}>
              Kamrad <span style={{
                color: '#FF6B00',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF3D00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Finder</span>
            </div>
            <div style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#64748B',
              marginTop: '3px',
              textTransform: 'uppercase'
            }}>
              Verified Travel Matching
            </div>
          </div>
        </a>

        {/* Navigation Links matching screenshot */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }} className="desktop-nav">

          {/* Destinations Item with Active Light Yellow Background matching screenshot */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setDestMenuOpen(true)}
            onMouseLeave={() => setDestMenuOpen(false)}
          >
            <button
              onClick={() => scrollToSection('destinations-section', 'Destinations')}
              style={{
                background: activeTab === 'Destinations' ? '#FFF8ED' : 'transparent',
                color: activeTab === 'Destinations' ? '#C2410C' : '#475569',
                border: activeTab === 'Destinations' ? '1.5px solid #FFD8A8' : '1.5px solid transparent',
                borderRadius: '12px',
                padding: '8px 18px',
                fontWeight: activeTab === 'Destinations' ? 700 : 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'Destinations' ? '0 2px 8px rgba(255, 107, 0, 0.1)' : 'none'
              }}
            >
              Destinations
              <ChevronDown size={14} style={{
                transform: destMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} />
            </button>

            {/* Dropdown Menu */}
            {destMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '240px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                padding: '12px',
                border: '1px solid #E2E8F0',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', padding: '4px 12px', textTransform: 'uppercase' }}>
                  Top Destinations
                </div>
                {[
                  { name: 'Bali, Indonesia', icon: '🏝️', tag: '240 Kamrads' },
                  { name: 'Santorini, Greece', icon: '🏛️', tag: '210 Kamrads' },
                  { name: 'Tokyo, Japan', icon: '🌸', tag: '380 Kamrads' },
                  { name: 'Swiss Alps, CH', icon: '🏔️', tag: '140 Kamrads' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSection('destinations-section', 'Destinations')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FFF4EC'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{item.icon}</span> {item.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#FF6B00', fontWeight: 700, backgroundColor: '#FFF4EC', padding: '2px 8px', borderRadius: '12px' }}>
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => scrollToSection('how-it-works-section', 'How it works')}
            style={{
              background: activeTab === 'How it works' ? '#FFF4EC' : 'transparent',
              color: activeTab === 'How it works' ? '#FF6B00' : '#475569',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            How it works
          </button>

          <button
            onClick={() => scrollToSection('safety-section', 'About')}
            style={{
              background: activeTab === 'About' ? '#FFF4EC' : 'transparent',
              color: activeTab === 'About' ? '#FF6B00' : '#475569',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            About
          </button>

          <button
            onClick={() => scrollToSection('plans-section', 'Plans')}
            style={{
              background: activeTab === 'Plans' ? '#FFF4EC' : 'transparent',
              color: activeTab === 'Plans' ? '#FF6B00' : '#475569',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Plans
          </button>

          <button
            onClick={onOpenSupport}
            style={{
              background: 'transparent',
              color: '#475569',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Contact
          </button>

          <button
            onClick={onOpenSupport}
            style={{
              background: 'transparent',
              color: '#475569',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Support
          </button>
        </nav>

        {/* Right CTA Action Buttons matching exact screenshot layout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Login / Join Button matching screenshot outline pill */}
          <button
            onClick={onOpenAuth}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0B132B',
              border: '1.5px solid #CBD5E1',
              borderRadius: '14px',
              padding: '10px 22px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#FF6B00';
              e.currentTarget.style.color = '#FF6B00';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.color = '#0B132B';
            }}
          >
            Login / Join
          </button>

          {/* Find a Kamrad CTA Button matching screenshot vibrant orange gradient */}
          <button
            onClick={onOpenWizard}
            className="btn-primary"
            style={{
              padding: '12px 26px',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(255, 107, 0, 0.4)'
            }}
          >
            Find a Kamrad
            <ArrowRight size={18} />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px'
            }}
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
