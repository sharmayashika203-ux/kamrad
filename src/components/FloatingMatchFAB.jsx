import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FloatingMatchFAB({ onOpenWizard }) {
  const handleClick = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.9, y: 0.85 },
      colors: ['#FF6B00', '#00E5FF', '#00E676', '#E040FB']
    });
    onOpenWizard();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 999
      }}
    >
      <button
        onClick={handleClick}
        className="fab-pulse-btn"
        style={{
          background: 'linear-gradient(135deg, #FF6B00 0%, #FF8A00 50%, #FF3D00 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '999px',
          padding: '14px 24px',
          fontSize: '0.95rem',
          fontWeight: 800,
          fontFamily: "'Outfit', sans-serif",
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 30px rgba(255, 107, 0, 0.5), 0 0 20px rgba(255, 107, 0, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={16} />
        </div>
        <span>AI Match Radar</span>
      </button>
    </div>
  );
}
