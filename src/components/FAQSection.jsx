import React, { useState, useRef } from 'react';
import { HelpCircle, ChevronDown, ChevronLeft, ChevronRight, MapPin, ShieldCheck, DollarSign, Users, ThumbsUp, Check, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const CATEGORIES = [
  { id: 'all', label: 'All FAQs' },
  { id: 'destinations', label: '🏝️ Destinations & Matching' },
  { id: 'safety', label: '🛡️ Safety & Verification' },
  { id: 'budget', label: '💰 Budget & Cost Splitting' },
  { id: 'trips', label: '✈️ Expeditions & Groups' }
];

const DESTINATION_FAQS = [
  {
    id: 1,
    category: 'destinations',
    icon: '🏝️',
    question: "How does Kamrad Finder match travel companions for specific destinations like Bali or Santorini?",
    answer: "Our AI Compatibility Radar analyzes your target destination, trip timeline, travel vibe (e.g., Beach & Relax, Hiking, Foodie, Digital Nomad), and budget preferences. It calculates an exact compatibility percentage to recommend verified travel buddies heading to the same spot.",
    highlight: "Matching accuracy is based on verified destination itineraries & travel dates."
  },
  {
    id: 2,
    category: 'destinations',
    icon: '📅',
    question: "Can I find travel buddies for flexible dates or upcoming 2026 trips?",
    answer: "Yes! You can search for companions traveling within the next 30 days or plan ahead for specific months (such as October 2026 or Winter Holidays) for any destination worldwide.",
    highlight: "Flexible date filters help you connect before flight bookings."
  },
  {
    id: 3,
    category: 'destinations',
    icon: '🔥',
    question: "What destinations are most popular on Kamrad Finder right now?",
    answer: "Our top trending destinations currently include Bali (Indonesia), Tokyo (Japan), Swiss Alps (Switzerland), Santorini (Greece), Reykjavik (Iceland), and the Amalfi Coast (Italy).",
    highlight: "Over 2,800 active companions are currently looking for buddies in these spots."
  },
  {
    id: 4,
    category: 'safety',
    icon: '🛡️',
    question: "Is it safe to meet a travel companion in a foreign destination?",
    answer: "Safety is our top priority. Every profile undergoes compulsory 100% Official ID verification, phone OTP, and email checks before connecting. You can also review community ratings and verified social accounts prior to meeting.",
    highlight: "100% ID Verified profiles ensure total peace of mind abroad."
  },
  {
    id: 5,
    category: 'budget',
    icon: '💳',
    question: "How does cost splitting work when traveling together to international destinations?",
    answer: "You can set your preferred cost split policy upfront—such as 50/50 hotel & rental car splits, paying for separate hotel rooms while sharing excursion tours, or sharing budget hostels.",
    highlight: "Save up to 50% on accommodation & rental cars by splitting expenses."
  },
  {
    id: 6,
    category: 'destinations',
    icon: '🗺️',
    question: "What if I want to explore multiple cities or do a multi-destination road trip?",
    answer: "You can list multiple destination preferences or post a custom trip itinerary (like an Iceland 4x4 camper ring road trip or Japan golden route) and invite matching companions to join.",
    highlight: "Custom multi-stop itineraries can be created & shared instantly."
  },
  {
    id: 7,
    category: 'safety',
    icon: '👩',
    question: "Can I filter companions by gender when searching for destination buddies?",
    answer: "Yes! You can filter match results by Female Only, Male Only, or Any Gender to ensure you feel 100% comfortable and safe during your destination travels.",
    highlight: "Gender preferences are strictly respected across all match results."
  },
  {
    id: 8,
    category: 'trips',
    icon: '💬',
    question: "What happens after I connect with a companion for a trip?",
    answer: "When both travelers accept a connection, you unlock direct in-app messaging, video calling, and joint itinerary planning tools to coordinate flights, hotels, and activities together.",
    highlight: "Enjoy 1:1 HD Video Calling to break the ice before traveling!"
  },
  {
    id: 9,
    category: 'trips',
    icon: '👥',
    question: "How do group expeditions to destinations work compared to 1-on-1 matches?",
    answer: "Along with 1-on-1 companion matching, travelers can host or join small group expeditions (3–6 members) for shared destination activities like Swiss Alps hikes or Tokyo night food crawls.",
    highlight: "Group expeditions are ideal for solo travelers who love social groups."
  },
  {
    id: 10,
    category: 'budget',
    icon: '⭐',
    question: "Is Kamrad Finder free to browse destinations and search for travel companions?",
    answer: "Yes! Searching destination profiles and sending basic travel interest requests is completely free. We also offer optional Kamrad Pro for unlimited instant messaging, priority AI radar matching, and split-cost escrow protection.",
    highlight: "100% Free to search, filter, and discover destination travel buddies."
  }
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState(1);
  const [helpfulFeedback, setHelpfulFeedback] = useState({});
  const pillRef = useRef(null);

  const filteredFaqs = activeCategory === 'all'
    ? DESTINATION_FAQS
    : DESTINATION_FAQS.filter(f => f.category === activeCategory);

  const toggleFAQ = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const handleHelpful = (e, id) => {
    e.stopPropagation();
    setHelpfulFeedback(prev => ({ ...prev, [id]: true }));
  };

  const scrollPills = (direction) => {
    if (pillRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      pillRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section id="faq-section" className="faq-section" style={{
      padding: '30px 0 60px 0',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 94, 0, 0.05) 0%, rgba(0, 240, 255, 0.03) 70%, transparent 100%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="section-tag">
              <HelpCircle size={14} /> Destination Help Center
            </div>
            <h2 className="section-title">
              Got Questions About <span className="animated-gradient-text">Destinations?</span>
            </h2>
            <p className="section-subtitle">
              Explore everything about verified companions, trip safety, cost splitting, and finding your ideal travel buddy.
            </p>
          </div>
        </ScrollReveal>

        {/* Mobile & Desktop Slide Pill Container with Manual Controls */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div style={{
            maxWidth: '860px',
            margin: '0 auto 36px auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            position: 'relative'
          }}>
            {/* Left Scroll Arrow */}
            <button
              onClick={() => scrollPills('left')}
              aria-label="Scroll left"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                color: '#475569',
                zIndex: 5,
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Scrollable Pill List */}
            <div
              ref={pillRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '10px',
                overflowX: 'auto',
                padding: '6px 4px 10px 4px',
                width: '100%',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '999px',
                      border: isActive ? '2px solid #FF5E00' : '1px solid #E2E8F0',
                      backgroundColor: isActive ? '#FF5E00' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: isActive ? '0 6px 18px rgba(255, 94, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.03)',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexShrink: 0
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => scrollPills('right')}
              aria-label="Scroll right"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                color: '#475569',
                zIndex: 5,
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </ScrollReveal>

        {/* Premium Glassmorphism Card Accordion Grid */}
        <div style={{
          maxWidth: '860px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {filteredFaqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const isHelpful = helpfulFeedback[faq.id];

            return (
              <ScrollReveal key={faq.id} animation="fade-up" delay={index * 30}>
                <div
                  onClick={() => toggleFAQ(faq.id)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: isOpen ? '1.5px solid #FF5E00' : '1px solid #E2E8F0',
                    boxShadow: isOpen ? '0 12px 30px -6px rgba(255, 94, 0, 0.14)' : '0 4px 12px rgba(15, 23, 42, 0.03)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  {/* Card Header Row */}
                  <div style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      {/* Icon Badge */}
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        backgroundColor: isOpen ? '#FFF4EC' : '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        flexShrink: 0,
                        transition: 'all 0.25s ease'
                      }}>
                        {faq.icon}
                      </div>

                      {/* Question Text */}
                      <div style={{
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        color: isOpen ? '#FF5E00' : '#0F172A',
                        lineHeight: 1.35
                      }}>
                        {faq.question}
                      </div>
                    </div>

                    {/* Toggle Indicator Chevron Pill */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? '#FF5E00' : '#F1F5F9',
                      color: isOpen ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.3s ease'
                    }}>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Expanded Answer Content Card */}
                  {isOpen && (
                    <div style={{
                      padding: '0 20px 20px 20px',
                      borderTop: '1px dashed #F1F5F9',
                      animation: 'fadeInModal 0.25s ease'
                    }}>
                      {/* Highlight Banner */}
                      {faq.highlight && (
                        <div style={{
                          backgroundColor: '#FFF4EC',
                          borderLeft: '3px solid #FF5E00',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          marginTop: '12px',
                          fontSize: '0.78rem',
                          color: '#C2410C',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span>{faq.highlight}</span>
                        </div>
                      )}

                      {/* Detailed Answer Body */}
                      <p style={{
                        marginTop: '12px',
                        fontSize: '0.85rem',
                        color: '#475569',
                        lineHeight: 1.6
                      }}>
                        {faq.answer}
                      </p>

                      {/* Interactive Feedback Footer */}
                      <div style={{
                        marginTop: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid #F8FAFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: '#94A3B8'
                      }}>
                        <span>Was this helpful?</span>
                        
                        {isHelpful ? (
                          <span style={{ color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={14} /> Thank you for your feedback!
                          </span>
                        ) : (
                          <button
                            onClick={(e) => handleHelpful(e, faq.id)}
                            style={{
                              background: '#F1F5F9',
                              border: 'none',
                              color: '#475569',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <ThumbsUp size={12} /> Yes, helpful
                          </button>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .faq-section {
            padding: 12px 0 24px 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
