import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Calendar, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const Card = ({ kamrad, onSwipe, isTop, index }) => {
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Rotate based on x offset
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  // Opacity for the LIKE / NOPE overlays
  const likeOpacity = useTransform(x, [-20, -100], [0, 1]);
  const nopeOpacity = useTransform(x, [20, 100], [0, 1]);
  // Scale down the card slightly when pushing it sideways
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  // Stack styling based on index (0 is top)
  const zIndex = 100 - index;
  const initialScale = 1 - index * 0.05;
  const initialY = index * 20;
  const opacity = index > 2 ? 0 : 1;

  const handleDragEnd = async (e, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const swipeThreshold = 100;

    if (offset < -swipeThreshold || velocity < -500) {
      // Connect (Left swipe)
      await controls.start({ x: -window.innerWidth, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('left', kamrad);
    } else if (offset > swipeThreshold || velocity > 500) {
      // Reject (Right swipe)
      await controls.start({ x: window.innerWidth, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('right', kamrad);
    } else {
      // Reset back to center
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: isTop ? x : 0,
        y: isTop ? 0 : initialY,
        scale: isTop ? scale : initialScale,
        rotate: isTop ? rotate : 0,
        zIndex,
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={isTop ? { cursor: 'grabbing' } : {}}
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: isTop ? 1 : initialScale, opacity, y: isTop ? 0 : initialY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
        height: '100%',
        maxHeight: '650px',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        cursor: isTop ? 'grab' : 'auto'
      }}>
        
        {/* ACTION OVERLAYS (Left = Connect, Right = Pass) */}
        {isTop && (
          <>
            <motion.div style={{
              position: 'absolute',
              top: '40px',
              right: '30px',
              border: '4px solid #00E676',
              color: '#00E676',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '1.5rem',
              fontWeight: 900,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transform: 'rotate(15deg)',
              zIndex: 10,
              opacity: likeOpacity,
              pointerEvents: 'none'
            }}>
              CONNECT
            </motion.div>
            <motion.div style={{
              position: 'absolute',
              top: '40px',
              left: '30px',
              border: '4px solid #FF3D00',
              color: '#FF3D00',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '1.5rem',
              fontWeight: 900,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transform: 'rotate(-15deg)',
              zIndex: 10,
              opacity: nopeOpacity,
              pointerEvents: 'none'
            }}>
              PASS
            </motion.div>
          </>
        )}

        {/* PHOTO SECTION */}
        <div style={{ position: 'relative', height: '60%', width: '100%', overflow: 'hidden' }}>
          <img
            src={kamrad.avatar}
            alt={kamrad.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 50%)' }} />
          
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(10px)', color: '#FFF', padding: '6px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            {kamrad.gender === 'Female' ? '👩' : '👨'} {kamrad.age}
          </div>
          
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'linear-gradient(135deg, #FF5E00, #FF0055)', color: '#FFF', padding: '6px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 14px rgba(255, 94, 0, 0.4)' }}>
            {kamrad.matchScore}% Match
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} style={{ color: '#FF5E00' }} /> {kamrad.destination}
            </div>
            
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', fontFamily: "'Outfit', sans-serif", marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {kamrad.name.split(' ')[0]}
              {kamrad.verified && <CheckCircle2 size={16} style={{ color: '#00E676' }} />}
            </h3>
            
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} style={{ color: '#00F0FF' }} /> {kamrad.dates}
            </div>
            
            <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              "{kamrad.bio}"
            </p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
            {kamrad.tags?.slice(0, 3).map((tag, i) => (
              <span key={i} style={{ backgroundColor: '#F1F5F9', color: '#475569', fontSize: '0.65rem', fontWeight: 700, padding: '4px 8px', borderRadius: '8px' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default function KamradSwipeStack({ kamrads = [], onConnect }) {
  const [cards, setCards] = useState(kamrads);

  useEffect(() => {
    setCards(kamrads);
  }, [kamrads]);

  const handleSwipe = (direction, kamrad) => {
    if (direction === 'left') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00E676', '#FF5E00']
      });
      if (onConnect) onConnect(kamrad);
    }
    
    // Remove the top card
    setTimeout(() => {
      setCards(prev => prev.slice(1));
    }, 200);
  };

  const manualSwipe = (direction) => {
    if (cards.length === 0) return;
    handleSwipe(direction, cards[0]);
  };

  if (cards.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#64748B', textAlign: 'center' }}>
        <Heart size={48} style={{ color: '#E2E8F0', marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>No More Kamrads!</h3>
        <p style={{ fontSize: '0.9rem' }}>Check back later or adjust your filters to see more travelers.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      
      <div style={{ position: 'relative', width: '100%', height: '600px', perspective: '1000px', marginBottom: '24px' }}>
        <AnimatePresence>
          {cards.slice(0, 3).map((kamrad, index) => (
            <Card
              key={kamrad.id}
              kamrad={kamrad}
              index={index}
              isTop={index === 0}
              onSwipe={handleSwipe}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Manual Swipe Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button
          onClick={() => manualSwipe('right')}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: 'none',
            boxShadow: '0 10px 25px rgba(255, 61, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            color: '#FF3D00'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <X size={28} strokeWidth={3} />
        </button>
        <button
          onClick={() => manualSwipe('left')}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: 'none',
            boxShadow: '0 10px 25px rgba(0, 230, 118, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            color: '#00E676'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Heart size={28} strokeWidth={3} fill="#00E676" />
        </button>
      </div>

    </div>
  );
}
