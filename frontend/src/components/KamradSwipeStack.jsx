import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Calendar, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const Card = ({ kamrad, onSwipe, isTop, index, onInteract }) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // 3D card deck layer settings so cards behind peek out with realistic angle & scale
  const STACK_PRESETS = [
    { scale: 1, y: 0, rotate: 0, shadow: '0 20px 45px rgba(15, 23, 42, 0.16)' },
    { scale: 0.94, y: 14, rotate: -3.5, shadow: '0 15px 30px rgba(15, 23, 42, 0.12)' },
    { scale: 0.88, y: 28, rotate: 3.8, shadow: '0 10px 22px rgba(15, 23, 42, 0.08)' }
  ];

  const preset = STACK_PRESETS[index] || {
    scale: Math.max(0.8, 1 - index * 0.06),
    y: index * 14,
    rotate: (index % 2 === 0 ? 3.5 : -3.5),
    shadow: 'none'
  };

  // Rotate based on x offset
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  // Opacity for the LIKE / NOPE overlays
  const likeOpacity = useTransform(x, [-20, -100], [0, 1]);
  const nopeOpacity = useTransform(x, [20, 100], [0, 1]);
  // Scale down the card slightly when pushing it sideways
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  // Stack styling based on index (0 is top)
  const zIndex = 100 - index;
  const opacity = index > 2 ? 0 : 1;

  const handleInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      if (onInteract) onInteract();
    }
  };

  // Initialize card controls state on mount/update & start continuous left/right flicking
  useEffect(() => {
    controls.set({
      x: 0,
      y: isTop ? 0 : preset.y,
      scale: isTop ? 1 : preset.scale,
      rotate: isTop ? 0 : preset.rotate,
      opacity: opacity
    });

    if (isTop && !hasUserInteracted) {
      controls.start({
        x: [0, -26, 0, 26, 0],
        rotate: [0, -5, 0, 5, 0],
        transition: {
          duration: 1.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.4
        }
      });
    }
  }, [isTop, index, kamrad?.id, hasUserInteracted]);

  const handleDragEnd = async (e, info) => {
    handleInteraction();
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
        y: isTop ? 0 : preset.y,
        scale: isTop ? scale : preset.scale,
        rotate: isTop ? rotate : preset.rotate,
        zIndex,
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => handleInteraction()}
      onDragEnd={handleDragEnd}
      animate={controls}
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
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    setCards(kamrads);
    setShowSwipeHint(true);
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, [kamrads]);

  const dismissHint = () => {
    setShowSwipeHint(false);
  };

  const handleSwipe = (direction, kamrad) => {
    dismissHint();
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
    dismissHint();
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px', margin: '0 auto', position: 'relative' }}>
      
      <div style={{ position: 'relative', width: '100%', height: '600px', perspective: '1000px', marginBottom: '24px' }}>
        
        {/* Animated Swipe Hint Popup Badge */}
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0, y: -25, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.85 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 250,
                pointerEvents: 'none',
                backgroundColor: 'rgba(11, 19, 43, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid #FF5E00',
                borderRadius: '999px',
                padding: '9px 20px',
                color: '#FFFFFF',
                boxShadow: '0 12px 35px rgba(0,0,0,0.45), 0 0 25px rgba(255, 94, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.82rem',
                fontWeight: 800,
                whiteSpace: 'nowrap'
              }}
            >
              <motion.span
                animate={{ x: [-4, 0, -4] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ color: '#00E676', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
              >
                👈 Swipe Left to Connect
              </motion.span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>•</span>
              <motion.span
                animate={{ x: [4, 0, 4] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ color: '#FF3D00', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
              >
                Pass 👉
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {cards.slice(0, 3).map((kamrad, index) => (
            <Card
              key={kamrad.id}
              kamrad={kamrad}
              index={index}
              isTop={index === 0}
              onSwipe={handleSwipe}
              onInteract={dismissHint}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Cards Remaining Deck Indicator */}
      {cards.length > 0 && (
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#475569',
          marginBottom: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FFFFFF',
          padding: '6px 16px',
          borderRadius: '999px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
        }}>
          <span>🎴</span> {cards.length} {cards.length === 1 ? 'Companion' : 'Companions'} in Deck • Swipe to Explore
        </div>
      )}

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
