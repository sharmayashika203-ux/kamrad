import React from 'react';
import { ShieldCheck, UserCheck, Sparkles, MessageSquare, Compass, HeartHandshake, Check } from 'lucide-react';

export default function HowItWorks({ onOpenWizard }) {
  const steps = [
    {
      num: "01",
      title: "100% ID & Biometric Verification",
      desc: "Every Kamrad uploads a government passport/ID, undergoes a live 3D selfie check, and links verified social profiles. Zero fake accounts allowed.",
      icon: <ShieldCheck size={28} style={{ color: '#00E676' }} />,
      badge: "Safety First"
    },
    {
      num: "02",
      title: "Set Destination & Split Rules",
      desc: "Specify your travel dates, target locations, interest tags (#Hiking, #Foodie), and how you prefer to split hotel, Airbnb, or car rental costs.",
      icon: <Compass size={28} style={{ color: '#FF6B00' }} />,
      badge: "Smart Preferences"
    },
    {
      num: "03",
      title: "AI Companion Match & Chat",
      desc: "Our AI algorithm suggests high-compatibility travel companions. Chat in encrypted in-app messaging, host a video call, and align your daily plans.",
      icon: <MessageSquare size={28} style={{ color: '#00B0FF' }} />,
      badge: "Instant Connect"
    },
    {
      num: "04",
      title: "Explore Together & Save Big",
      desc: "Meet up safely, explore stunning world locations, share expenses seamlessly, and create lifelong memories with trusted travel partners.",
      icon: <HeartHandshake size={28} style={{ color: '#E040FB' }} />,
      badge: "Travel Together"
    }
  ];

  return (
    <section id="how-it-works-section" style={{
      padding: '90px 0',
      backgroundColor: '#F8FAFC'
    }}>
      <div className="container">

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

        {/* 4 Step Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '28px'
        }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '32px 24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#FF6B00';
                e.currentTarget.style.boxShadow = '0 16px 35px rgba(255, 107, 0, 0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.04)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #E2E8F0'
                  }}>
                    {step.icon}
                  </div>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: '#E2E8F0'
                  }}>
                    {step.num}
                  </span>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#FF6B00',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }}>
                  {step.badge}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#00C853', fontSize: '0.8rem', fontWeight: 700 }}>
                <Check size={14} /> Guaranteed Verified Process
              </div>

            </div>
          ))}
        </div>

        {/* CTA Banner inside How It Works */}
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
          boxShadow: '0 20px 40px rgba(11, 19, 43, 0.3)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>
              Ready to find your travel companion today?
            </h3>
            <p style={{ fontSize: '1rem', color: '#CBD5E1', maxWidth: '540px' }}>
              Join 450,000+ verified travelers matching dates in Bali, Tokyo, Santorini, and 120+ destinations.
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

      </div>
    </section>
  );
}
