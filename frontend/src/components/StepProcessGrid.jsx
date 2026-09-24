import React from 'react';
import { Search, UserCheck, Smile, Users } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const STEPS = [
  {
    id: 1,
    title: "Explore Dream Destinations",
    desc: "Pick your dream destination, set your travel dates, and unlock active companion hubs worldwide.",
    icon: <Search size={38} style={{ color: '#B91C1C', strokeWidth: 1.8 }} />
  },
  {
    id: 2,
    title: "Match Verified Companions",
    desc: "Browse 100% ID-verified solo travelers, digital nomads, and local guides matching your exact vibe.",
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Connect & Chat Instantly",
    desc: "Send 1-click travel interest, calculate mutual compatibility scores, and plan securely in real-time.",
    icon: <Smile size={38} style={{ color: '#B91C1C', strokeWidth: 1.8 }} />
  },
  {
    id: 4,
    title: "Travel Together",
    desc: "Meet up safely at verified public spots, split hotel & tour costs, and create lifelong memories.",
    icon: <Users size={38} style={{ color: '#B91C1C', strokeWidth: 1.8 }} />
  }
];

export default function StepProcessGrid() {
  return (
    <section style={{
      padding: '60px 0 80px 0',
      backgroundColor: '#FAF9F9',
      position: 'relative'
    }}>
      <div className="container">

        {/* 4 Cards Grid - Pixel-perfect match to provided design */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {STEPS.map((step, idx) => (
            <ScrollReveal key={step.id} animation="fade-up" delay={idx * 70}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '40px 24px 36px 24px',
                  textAlign: 'center',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(185, 28, 28, 0.09)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Maroon Line Icon */}
                <div style={{
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {step.icon}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#27272A',
                  marginBottom: '12px',
                  lineHeight: 1.35,
                  letterSpacing: '-0.01em'
                }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.85rem',
                  color: '#52525B',
                  lineHeight: 1.55,
                  margin: 0,
                  fontWeight: 400
                }}>
                  {step.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
