import React, { useState } from 'react';
import { Compass, ArrowRight, Menu, X, ChevronDown, MapPin, Sparkles, Shield, UserCheck, User, LogOut, CheckCircle2, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenWizard, onOpenAuth, onOpenSupport, onOpenProfileSetup, onOpenNotifications, unreadNotificationsCount = 0 }) {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('Destinations');
  const [destMenuOpen, setDestMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const scrollToSection = (id, name) => {
    setActiveTab(name);
    setMobileMenuOpen(false);
    setDestMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'My Profile';

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container nav-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        padding: '0 20px'
      }}>

        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          {/* Logo Badge Icon */}
          <div className="logo-badge" style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#0B132B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(11, 19, 43, 0.25)',
            border: '2px solid #FF5E00',
            position: 'relative',
            flexShrink: 0
          }}>
            <Compass size={22} className="logo-icon" style={{ color: '#FF5E00', transform: 'rotate(25deg)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="logo-text" style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.35rem',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#0B132B'
            }}>
              Kamrad <span style={{
                color: '#FF5E00',
                background: 'linear-gradient(135deg, #FF5E00 0%, #FF0055 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Finder</span>
            </div>
            <div className="logo-tagline" style={{
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: '#64748B',
              marginTop: '3px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>
              Verified Travel Matching
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }} className="desktop-nav">

          {/* Destinations Item */}
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
                boxShadow: activeTab === 'Destinations' ? '0 2px 8px rgba(255, 94, 0, 0.1)' : 'none'
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
                    <span style={{ fontSize: '0.72rem', color: '#FF5E00', fontWeight: 700, backgroundColor: '#FFF4EC', padding: '2px 8px', borderRadius: '12px' }}>
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
              color: activeTab === 'How it works' ? '#FF5E00' : '#475569',
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
              color: activeTab === 'About' ? '#FF5E00' : '#475569',
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
              color: activeTab === 'Plans' ? '#FF5E00' : '#475569',
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
            Support
          </button>
        </nav>

        {/* Right CTA Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {/* User Logged In Profile Badge or Login Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
              
              {/* Notification Bell Button */}
              <button
                onClick={onOpenNotifications}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  color: '#0F172A'
                }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadNotificationsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#FF5E00',
                    color: '#FFF',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFF'
                  }}>
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="desktop-auth-btn"
                style={{
                  backgroundColor: '#FFF4EC',
                  color: '#C2410C',
                  border: '1.5px solid #FFD8A8',
                  borderRadius: '14px',
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(255, 94, 0, 0.1)'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#FF5E00',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span>{displayName.split(' ')[0]}</span>
                <CheckCircle2 size={14} style={{ color: '#10B981' }} />
                <ChevronDown size={14} />
              </button>


              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '108%',
                  right: 0,
                  width: '200px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  padding: '8px',
                  border: '1px solid #E2E8F0',
                  zIndex: 210,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenProfileSetup) onOpenProfileSetup();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: '#0F172A',
                      fontSize: '0.88rem',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <User size={16} style={{ color: '#FF5E00' }} /> Profile & Preferences
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: '#EF4444',
                      fontSize: '0.88rem',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="desktop-auth-btn"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0B132B',
                border: '1.5px solid #CBD5E1',
                borderRadius: '14px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              Login / Join
            </button>
          )}

          {/* Find a Kamrad CTA Button */}
          <button
            onClick={onOpenWizard}
            className="btn-primary desktop-wizard-btn"
            style={{
              padding: '10px 22px',
              borderRadius: '14px',
              fontSize: '0.92rem',
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(255, 94, 0, 0.4)'
            }}
          >
            Find Kamrads
            <ArrowRight size={16} />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: mobileMenuOpen ? '#FFF4EC' : '#F1F5F9',
              border: mobileMenuOpen ? '1.5px solid #FF5E00' : '1.5px solid #CBD5E1',
              borderRadius: '12px',
              cursor: 'pointer',
              padding: '8px 10px',
              color: '#0F172A',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            className="mobile-hamburger"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} style={{ color: '#FF5E00' }} /> : <Menu size={22} style={{ color: '#0F172A' }} />}
          </button>
        </div>
      </div>

      {/* Slide-Down Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '3px solid #FF5E00',
          padding: '20px 20px 24px 20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'fadeInModal 0.25s ease-out'
        }} className="mobile-drawer-menu">

          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Navigation Menu
          </div>

          <button
            onClick={() => scrollToSection('destinations-section', 'Destinations')}
            style={{
              textAlign: 'left',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '12px 16px',
              borderRadius: '14px',
              fontWeight: 700,
              color: '#0F172A',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>🏝️ Trending Destinations</span>
            <ArrowRight size={16} style={{ color: '#FF5E00' }} />
          </button>

          <button
            onClick={() => scrollToSection('how-it-works-section', 'How it works')}
            style={{
              textAlign: 'left',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '12px 16px',
              borderRadius: '14px',
              fontWeight: 700,
              color: '#0F172A',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>✨ How Kamrad Finder Works</span>
            <ArrowRight size={16} style={{ color: '#FF5E00' }} />
          </button>

          <button
            onClick={() => scrollToSection('safety-section', 'About')}
            style={{
              textAlign: 'left',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '12px 16px',
              borderRadius: '14px',
              fontWeight: 700,
              color: '#0F172A',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>🛡️ 100% ID Safety Guarantee</span>
            <ArrowRight size={16} style={{ color: '#FF5E00' }} />
          </button>

          <button
            onClick={() => scrollToSection('plans-section', 'Plans')}
            style={{
              textAlign: 'left',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '12px 16px',
              borderRadius: '14px',
              fontWeight: 700,
              color: '#0F172A',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>💎 Membership Plans (USD $)</span>
            <ArrowRight size={16} style={{ color: '#FF5E00' }} />
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSupport();
            }}
            style={{
              textAlign: 'left',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '12px 16px',
              borderRadius: '14px',
              fontWeight: 700,
              color: '#0F172A',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>📞 24/7 SOS Support</span>
            <ArrowRight size={16} style={{ color: '#FF5E00' }} />
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenProfileSetup) onOpenProfileSetup();
                  }}
                  className="btn-outline"
                  style={{ justifyContent: 'center', borderRadius: '14px', padding: '12px', fontSize: '0.9rem' }}
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#EF4444',
                    border: '1px solid #FECACA',
                    borderRadius: '14px',
                    padding: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="btn-outline"
                  style={{ justifyContent: 'center', borderRadius: '14px', padding: '12px', fontSize: '0.9rem' }}
                >
                  Login / Join
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWizard();
                  }}
                  className="btn-primary"
                  style={{ justifyContent: 'center', borderRadius: '14px', padding: '12px', fontSize: '0.9rem' }}
                >
                  Find Kamrads
                </button>
              </>
            )}
          </div>

        </div>
      )}

      {/* Media Queries */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger {
            display: flex !important;
          }
        }

        @media (max-width: 640px) {
          .nav-container {
            padding: 0 14px !important;
            height: 68px !important;
          }
          .desktop-auth-btn {
            display: none !important;
          }
          .desktop-wizard-btn {
            display: none !important;
          }
          .logo-text {
            font-size: 1.18rem !important;
          }
          .logo-tagline {
            font-size: 0.52rem !important;
            letter-spacing: 0.08em !important;
          }
          .logo-badge {
            width: 36px !important;
            height: 36px !important;
            border-radius: 10px !important;
          }
        }

        @media (max-width: 380px) {
          .logo-tagline {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}


