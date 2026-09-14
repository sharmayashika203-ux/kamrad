import React from 'react';
import { Star, Quote, ShieldCheck, Heart } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Elena Rostova",
    role: "Solo Backpacker",
    origin: "🇪🇸 Spain",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    text: "As a solo female traveler, safety is my absolute #1 priority. I met Sophia on Kamrad Finder for a 2-week trip in Bali. We split a gorgeous villa in Ubud and felt 100% safe every day!",
    rating: 5,
    dest: "Bali, Indonesia"
  },
  {
    name: "Marcus Vance",
    role: "Digital Nomad",
    origin: "🇬🇧 UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    text: "Saved over $1,200 on car rentals and glacier tours in Iceland by matching with Liam! The biometric ID verification gave me total confidence before we met in Reykjavik.",
    rating: 5,
    dest: "Reykjavik, Iceland"
  },
  {
    name: "Chloe & Naomi",
    role: "Photography Duo",
    origin: "🇦🇺 Australia",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    text: "Kamrad Finder turned my solo trip to Santorini into an unforgettable adventure. Found an awesome catamaran buddy and made a lifelong friend!",
    rating: 5,
    dest: "Santorini, Greece"
  }
];

export default function Testimonials() {
  return (
    <section style={{
      padding: '90px 0',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="section-tag">
            <Heart size={14} /> Traveler Stories
          </div>
          <h2 className="section-title">
            Loved by Solo Travelers Worldwide
          </h2>
          <p className="section-subtitle">
            Over 18,400 verified reviews from real travelers who found safe companions and shared incredible journeys.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid #E2E8F0',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Rating Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: '#FFB800' }}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#FFB800" />
                  ))}
                </div>

                <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                  "{item.text}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00E676' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.name} <span style={{ fontSize: '0.88rem' }}>{item.origin}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                    Matched for {item.dest} • <span style={{ color: '#00C853' }}>Verified Member</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
