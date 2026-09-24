import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, UserCheck, MapPin } from 'lucide-react';

const ACTIVITIES = [
  {
    id: 1,
    name: "Aria Thorne",
    action: "matched with Sophia Chen for Bali Villa split!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    time: "Just now",
    tag: "98% Match"
  },
  {
    id: 2,
    name: "Liam O'Connor",
    action: "verified Profile ID for Swiss Alps trail!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    time: "2 mins ago",
    tag: "ID Verified"
  },
  {
    id: 3,
    name: "Diego Rossi",
    action: "posted a Tokyo street food & ramen itinerary!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    time: "5 mins ago",
    tag: "Foodie Vibe"
  },
  {
    id: 4,
    name: "Priya Sharma",
    action: "created a 4x4 Iceland camper group trip!",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
    time: "8 mins ago",
    tag: "Northern Lights"
  }
];

export default function LiveActivityToast({ onOpenWizard }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (isDismissed) return;
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setAnimate(true);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const activity = ACTIVITIES[currentIndex];

  return (
    <div
      className="live-activity-toast"
      onClick={onOpenWizard}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={activity.avatar}
          alt={activity.name}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #FF5E00'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          backgroundColor: '#10B981',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          border: '2px solid #0B132B'
        }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>
            {activity.name}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#FF8A00', fontWeight: 800, backgroundColor: 'rgba(255,94,0,0.2)', padding: '1px 6px', borderRadius: '6px' }}>
            {activity.tag}
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#CBD5E1', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activity.action}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDismissed(true);
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94A3B8',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'color 0.2s ease'
        }}
      >
        <X size={16} />
      </button>

      <style>{`
        .live-activity-toast {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 999;
          background-color: rgba(11, 19, 43, 0.94);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 94, 0, 0.35);
          border-radius: 20px;
          padding: 12px 16px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 380px;
          color: #FFFFFF;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .live-activity-toast {
            bottom: 84px !important;
            left: 14px !important;
            right: 14px !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
}
