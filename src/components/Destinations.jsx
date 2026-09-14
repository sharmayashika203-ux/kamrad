import React from 'react';
import { MapPin, Users, Sparkles, Sun, ArrowRight, Compass } from 'lucide-react';

const DESTINATIONS_LIST = [
  {
    id: 'bali',
    title: 'Bali, Indonesia',
    image: '/images/dest_bali.jpg',
    activeCount: 240,
    temp: '28°C Sunny',
    avgCost: '$35 - $60 / day',
    vibe: 'Tropical & Nomads',
    tag: '🔥 Most Popular'
  },
  {
    id: 'santorini',
    title: 'Santorini, Greece',
    image: '/images/dest_santorini.jpg',
    activeCount: 210,
    temp: '24°C Sunset Breeze',
    avgCost: '$80 - $140 / day',
    vibe: 'Coastal & Wine',
    tag: '🌅 Sunset & Culture'
  },
  {
    id: 'tokyo',
    title: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    activeCount: 380,
    temp: '18°C Pleasant',
    avgCost: '$65 - $110 / day',
    vibe: 'Food & Cyberpunk',
    tag: '🌸 Food & Tech'
  },
  {
    id: 'alps',
    title: 'Swiss Alps, Switzerland',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    activeCount: 140,
    temp: '12°C Crisp Alpine',
    avgCost: '$110 - $180 / day',
    vibe: 'Hiking & Skiing',
    tag: '🏔️ Alpine Peak'
  },
  {
    id: 'iceland',
    title: 'Reykjavik, Iceland',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
    activeCount: 115,
    temp: '4°C Aurora Glow',
    avgCost: '$90 - $150 / day',
    vibe: 'Roadtrips & Ice',
    tag: '🌌 Northern Lights'
  },
  {
    id: 'amalfi',
    title: 'Amalfi Coast, Italy',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    activeCount: 190,
    temp: '23°C Mediterranean',
    avgCost: '$95 - $160 / day',
    vibe: 'Sailing & Cuisine',
    tag: '🇮🇹 Coastal Magic'
  }
];

export default function Destinations({ onSelectDest }) {
  return (
    <section id="destinations-section" style={{
      padding: '90px 0',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container">
        
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '50px'
        }}>
          <div>
            <div className="section-tag">
              <Compass size={14} /> Trending Destinations
            </div>
            <h2 className="section-title">
              Top Spots Where Kamrads Are Heading
            </h2>
            <p className="section-subtitle" style={{ margin: 0 }}>
              Join pre-verified solo travelers and small group expeditions in these popular global hotspots.
            </p>
          </div>

          <button
            onClick={() => onSelectDest('')}
            className="btn-outline"
            style={{ borderRadius: '999px' }}
          >
            Explore All 120+ Locations
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px'
        }}>
          {DESTINATIONS_LIST.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDest(dest.title.split(',')[0])}
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                height: '380px',
                cursor: 'pointer',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 45px rgba(255, 107, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
              }}
            >
              {/* Image */}
              <img
                src={dest.image}
                alt={dest.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
              />

              {/* Dark Overlay Gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(11, 19, 43, 0.95) 0%, rgba(11, 19, 43, 0.4) 50%, rgba(0,0,0,0.1) 100%)'
              }} />

              {/* Top Pill Tag */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                color: '#0F172A',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '999px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {dest.tag}
              </div>

              {/* Top Active Kamrad Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'rgba(0, 230, 118, 0.9)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0, 230, 118, 0.4)'
              }}>
                <Users size={13} /> {dest.activeCount} Kamrads Active
              </div>

              {/* Bottom Card Content */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px',
                color: '#FFFFFF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.82rem', color: '#00E5FF', fontWeight: 600 }}>
                  <Sun size={14} /> {dest.temp} • {dest.avgCost}
                </div>

                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  marginBottom: '10px',
                  color: '#FFFFFF'
                }}>
                  {dest.title}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 500 }}>
                    Vibe: {dest.vibe}
                  </span>
                  <span style={{
                    color: '#FF6B00',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    Find Partners <ArrowRight size={15} />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
