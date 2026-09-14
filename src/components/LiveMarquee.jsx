import React from 'react';
import { Sparkles, MapPin, Zap, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

const MARQUEE_ITEMS = [
  { text: "⚡ Sophia (USA) matched with Elena (Spain) for Ubud Villa split", tag: "NEW MATCH" },
  { text: "🛡️ Liam O'Connor verified 3D Biometric Passport for Swiss Alps Hike", tag: "ID VERIFIED" },
  { text: "🍜 Diego Rossi posted a 5-Day Ramen & Izakaya Crawl in Tokyo", tag: "TRIP POST" },
  { text: "🏔️ Priya Sharma created a 4x4 Camper Iceland Northern Lights trip", tag: "GROUP EXPEDITION" },
  { text: "🏝️ Lucas Weber rented a private boat for Amalfi Coast exploring", tag: "VERIFIED KAMRAD" },
  { text: "🌅 Aria Thorne booked a Catamaran Sunset tour for Santorini", tag: "99% MATCH" }
];

export default function LiveMarquee() {
  return (
    <div style={{
      backgroundColor: '#0B132B',
      borderTop: '1px solid rgba(255, 107, 0, 0.3)',
      borderBottom: '1px solid rgba(0, 229, 255, 0.3)',
      padding: '12px 0',
      overflow: 'hidden',
      position: 'relative',
      color: '#FFFFFF'
    }}>
      <div className="marquee-content" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
        width: 'max-content',
        animation: 'marqueeScroll 28s linear infinite'
      }}>
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#E2E8F0',
            whiteSpace: 'nowrap'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF8A00 100%)',
              color: '#FFF',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              letterSpacing: '0.05em'
            }}>
              {item.tag}
            </span>
            <span>{item.text}</span>
            <span style={{ color: '#00E5FF', marginLeft: '10px' }}>•</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
