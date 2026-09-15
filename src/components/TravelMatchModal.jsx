import React, { useEffect } from 'react';
import { X, Sparkles, MapPin, Calendar, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TravelMatchModal({ isOpen, matchData, onClose, onStartChat }) {
  // Trigger celebratory confetti on load
  useEffect(() => {
    if (isOpen && matchData) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF5E00', '#00E676', '#00B0FF', '#FF0055']
      });
    }
  }, [isOpen, matchData]);

  if (!isOpen || !matchData) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 250 }}>
      <div className="modal-content" style={{ maxWidth: '520px', padding: '36px', textAlign: 'center' }}>
        
        {/* Close Button */}
        <button onClick={onClose} className="close-btn">
          <X size={20} />
        </button>

        {/* Celebration Header */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FFF4EC',
          color: '#FF5E00',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          fontWeight: 800,
          marginBottom: '16px'
        }}>
          <Sparkles size={16} /> Travel Compatibility Match
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginBottom: '8px', lineHeight: 1.2 }}>
          🎉 It's a Travel Match!
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '24px' }}>
          You and {companion.name || companion.full_name || 'your companion'} share strong travel compatibility for an upcoming trip!
        </p>

        {/* Companion Avatar Pair Display */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
          <img
            src={companion.avatar || companion.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={companion.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #FF5E00',
              boxShadow: '0 8px 20px rgba(255, 94, 0, 0.3)'
            }}
          />

          <div style={{
            backgroundColor: '#FF5E00',
            color: '#FFF',
            padding: '8px 14px',
            borderRadius: '999px',
            fontSize: '1rem',
            fontWeight: 900,
            boxShadow: '0 6px 16px rgba(255, 94, 0, 0.4)'
          }}>
            {compPercent}% Match
          </div>
        </div>

        {/* Trip Details Box */}
        <div style={{
          backgroundColor: '#FFF8ED',
          border: '1.5px solid #FFD8A8',
          borderRadius: '18px',
          padding: '18px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C2410C', textTransform: 'uppercase', marginBottom: '10px' }}>
            Shared Travel Fit Summary
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#0F172A', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} style={{ color: '#FF5E00' }} />
              <span>Target Destination: {companion.destination || 'Bali, Indonesia'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} style={{ color: '#FF5E00' }} />
              <span>Travel Dates: {companion.dates || 'Flexible (Next 30 Days)'}</span>
            </div>
          </div>

          {/* Common Interests */}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #FFD8A8' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#9A3412', marginBottom: '6px' }}>
              Common Travel Interests & Activities:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {commonInterests.map((interest, idx) => (
                <span key={idx} style={{
                  backgroundColor: '#FFFFFF',
                  color: '#C2410C',
                  border: '1px solid #FFD8A8',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  {interest.startsWith('#') ? interest : `✨ ${interest}`}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            className="btn-outline"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Keep Exploring
          </button>

          <button
            onClick={() => {
              onClose();
              if (onStartChat) onStartChat(companion);
            }}
            className="btn-primary"
            style={{ flex: 1.5, justifyContent: 'center', padding: '14px' }}
          >
            <MessageSquare size={18} />
            Start Planning Trip
          </button>
        </div>

      </div>
    </div>
  );
}
