import React from 'react';
import { Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FloatingMatchFAB({ onOpenWizard }) {
  const handleClick = () => {
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { x: 0.9, y: 0.85 },
      colors: ['#FF5E00', '#00F0FF', '#10B981', '#EC4899']
    });
    onOpenWizard();
  };

  return (
    <div className="fab-container">
      <button
        onClick={handleClick}
        className="fab-pulse-btn"
        style={{
          background: 'linear-gradient(135deg, #FF5E00 0%, #FF8A00 50%, #FF0055 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '999px',
          padding: '14px 22px',
          fontSize: '0.92rem',
          fontWeight: 800,
          fontFamily: "'Outfit', sans-serif",
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 30px rgba(255, 94, 0, 0.5), 0 0 20px rgba(255, 94, 0, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.22)',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Zap size={16} />
        </div>
        <span>AI Match Radar</span>
      </button>

      <style>{`
        .fab-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
        }

        @media (max-width: 640px) {
          .fab-container {
            bottom: 18px !important;
            right: 14px !important;
          }
          .fab-container button {
            padding: 12px 18px !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
