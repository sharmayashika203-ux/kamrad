import React from 'react';
import { ShieldCheck, UserCheck, Sparkles, MessageSquare, Compass, HeartHandshake, Check } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function HowItWorks({ onOpenWizard }) {
  const steps = [
    {
      num: "01",
      title: "100% Government ID Verification",
      desc: "Every Kamrad links verified social profiles and completes government ID verification. Zero fake accounts allowed.",
      icon: <ShieldCheck size={28} style={{ color: '#10B981' }} />,
      badge: "Safety First",
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.1)',
      borderGlow: 'rgba(16, 185, 129, 0.3)',
      shadowGlow: 'rgba(16, 185, 129, 0.18)',
      gradient: 'linear-gradient(135deg, #10B981, #059669)'
    },
    {
      num: "02",
      title: "Set Destination & Split Rules",
      desc: "Specify your travel dates, target locations, interest tags (#Hiking, #Foodie), and how you prefer to split hotel, Airbnb, or car rental costs.",
      icon: <Compass size={28} style={{ color: '#FF5E00' }} />,
      badge: "Smart Preferences",
      color: '#FF5E00',
      bgGlow: 'rgba(255, 94, 0, 0.1)',
      borderGlow: 'rgba(255, 94, 0, 0.3)',
      shadowGlow: 'rgba(255, 94, 0, 0.18)',
      gradient: 'linear-gradient(135deg, #FF5E00, #FF8800)'
    },
    {
      num: "03",
      title: "Travel Compatibility Match & Chat",
      desc: "Our deterministic matching algorithm calculates real travel style, date, budget and interest compatibility. Chat in encrypted in-app messaging.",
      icon: <MessageSquare size={28} style={{ color: '#00E5FF' }} />,
      badge: "Instant Connect",
      color: '#00E5FF',
      bgGlow: 'rgba(0, 229, 255, 0.1)',
      borderGlow: 'rgba(0, 229, 255, 0.3)',
      shadowGlow: 'rgba(0, 229, 255, 0.18)',
      gradient: 'linear-gradient(135deg, #00E5FF, #0077FF)'
    },
    {
      num: "04",
      title: "Explore Together & Save Big",
      desc: "Meet up safely, explore stunning world locations, share expenses seamlessly, and create lifelong memories with trusted travel partners.",
      icon: <HeartHandshake size={28} style={{ color: '#EC4899' }} />,
      badge: "Travel Together",
      color: '#EC4899',
      bgGlow: 'rgba(236, 72, 153, 0.1)',
      borderGlow: 'rgba(236, 72, 153, 0.3)',
      shadowGlow: 'rgba(236, 72, 153, 0.18)',
      gradient: 'linear-gradient(135deg, #EC4899, #A855F7)'
    }
  ];

  return (
    <section id="how-it-works-section" style={{
      padding: '90px 0',
      backgroundColor: '#F8FAFC'
    }}>
      <div className="container">

        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-tag">
              <Sparkles size={14} /> Simplified & Ultra-Safe
            </div>
            <h2 className="section-title">
              How Kamrad Finder Works
            </h2>
            <p className="section-subtitle">
              From initial ID verification to landing in your dream destination, our platform ensures maximum safety, cost transparency, and seamless connection.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Step Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '28px'
        }}>
          {steps.map((step, idx) => (
            <ScrollReveal key={idx} animation="zoom-in" delay={100 + idx * 90}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '30px 24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden'
                }}
                className="step-card"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = step.color;
                  e.currentTarget.style.boxShadow = `0 22px 45px ${step.shadowGlow}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.05)';
                }}
              >
                {/* Top Accent Gradient Line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: step.gradient
                }} />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: step.bgGlow,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1.5px solid ${step.borderGlow}`,
                      transition: 'transform 0.3s ease'
                    }}>
                      {step.icon}
                    </div>
                    <span style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '2.4rem',
                      fontWeight: 900,
                      background: step.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.03em'
                    }}>
                      {step.num}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: step.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '8px',
                    backgroundColor: step.bgGlow,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    display: 'inline-block'
                  }}>
                    {step.badge}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px', lineHeight: 1.35 }}>
                    {step.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>

                <div style={{
                  marginTop: '24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  color: '#059669',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  width: 'fit-content'
                }}>
                  <Check size={14} style={{ color: '#10B981' }} /> Guaranteed Verified Process
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Banner inside How It Works */}
        <ScrollReveal animation="fade-up" delay={400}>
          <div style={{
            marginTop: '60px',
            background: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)',
            borderRadius: '28px',
            padding: '40px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 20px 40px rgba(11, 19, 43, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>
                Ready to find your travel companion today?
              </h3>
              <p style={{ fontSize: '1rem', color: '#CBD5E1', maxWidth: '540px' }}>
                Join 450,000+ verified companions matching dates in Bali, Tokyo, Santorini, and 120+ destinations.
              </p>
            </div>

            <button
              onClick={onOpenWizard}
              className="btn-primary"
              style={{ padding: '16px 32px', fontSize: '1rem', borderRadius: '16px' }}
            >
              Start Free Companion Search
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
