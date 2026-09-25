import React, { useState } from 'react';
import { BookOpen, Clock, User, ArrowRight, X, Calendar, Share2, Heart, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const BLOG_POSTS = [
  {
    id: 1,
    title: "10 Essential Safety Tips Every Solo Female Traveler Should Know in 2026",
    category: "Safety & Tips",
    readTime: "5 min read",
    date: "Sep 20, 2026",
    author: "Elena Rostova",
    authorRole: "Community Safety Lead",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    summary: "Discover practical safety advice, from verifying travel buddies before meeting in public places to splitting accommodation costs safely while exploring top global destinations.",
    content: [
      "Traveling solo as a woman is one of the most empowering experiences in the world, but prioritizing personal safety is essential to making every journey smooth and memorable.",
      "1. Verify Profiles Before Meeting: Always ensure your travel partner has completed 100% Official ID verification and linked active social profiles on Kamrad Finder.",
      "2. Schedule a Pre-Trip Video Call: Utilize in-app 1:1 HD Video Calling to chat face-to-face, discuss travel expectations, and establish trust before booking flights or accommodation.",
      "3. Always Meet in Public Places First: When meeting up with a travel buddy in a new city (e.g. airport arrivals hall or hotel lobby), choose a well-lit public cafe or central landmark.",
      "4. Share Your Live Itinerary: Leave a copy of your flight details, hotel reservations, and emergency contact numbers with a family member or trusted friend back home.",
      "5. Use In-App Secure Messaging: Keep all pre-trip communications within encrypted in-app messaging to protect your phone number and private details."
    ]
  },
  {
    id: 2,
    category: "Budget & Finance",
    readTime: "4 min read",
    date: "Sep 18, 2026",
    title: "How to Split Trip Costs 50/50 Without the Awkwardness: A Companion's Guide",
    author: "Marcus Vance",
    authorRole: "Digital Nomad & Explorer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    summary: "Learn how solo travelers save over $1,200 on private villa rentals, 4x4 camper vans, and catamaran tours by setting clear cost-sharing rules upfront.",
    content: [
      "One of the biggest financial hurdles of solo travel is paying full price for accommodation, car rentals, and group excursions. Matching with a verified travel partner cuts these costs in half!",
      "1. Agree on Expense Split Rules Early: Set your split policy upfront—whether that's 50/50 on hotel rooms & rental cars, paying for separate hotel rooms, or hostel sharing.",
      "2. Track Shared Expenses Digitally: Use built-in trip expense calculators or shared tally apps to log group dinners, fuel refills, and entrance tickets as you go.",
      "3. Book Shared Stays via Escrow Protection: When sharing private luxury villas or 4x4 camper rentals, use Kamrad Escrow Protection so funds are securely held until check-in.",
      "4. Respect Individual Dining & Activity Budgets: Allow flexibility for meal choices—some days split street food feasts, other days enjoy independent culinary explorations."
    ]
  },
  {
    id: 3,
    category: "Destination Guides",
    readTime: "6 min read",
    date: "Sep 15, 2026",
    title: "Top 5 Bucket List Destinations for Finding Travel Partners This Season",
    author: "Sophia Chen",
    authorRole: "Lead Travel Curator",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    summary: "From the tropical waterfalls of Ubud to the autumn foliage of Kyoto and sunset wine tastings in Santorini, explore why these 5 destinations top the charts for solo companion matching.",
    content: [
      "Finding like-minded travel partners is easiest in destinations with thriving solo communities and vibrant group activities.",
      "1. Bali, Indonesia: The world's #1 digital nomad hub! Share Canggu luxury co-living villas, scooter rentals, and scuba diving trips around Nusa Penida.",
      "2. Tokyo & Kyoto, Japan: Ideal for foodie explorers! Pair up for 5-day ramen crawls, anime district tours in Akihabara, and bullet train journeys.",
      "3. Swiss Alps, Switzerland: Perfect for mountain lovers! Match with fellow alpine hikers to split cozy Zermatt chalets and cable car passes.",
      "4. Santorini, Greece: Known for sunset catamaran cruises and cliffside wine tastings. Sharing villa suites saves over 50% on luxury island stays.",
      "5. Reykjavik, Iceland: Conquer the Ring Road in a shared 4x4 camper van while chasing the Northern Lights with verified co-pilots!"
    ]
  }
];

export default function BlogSection({ onOpenWizard }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [likes, setLikes] = useState({});

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="blog-section" className="blog-section" style={{
      padding: '35px 0 30px 0',
      backgroundColor: '#FFFFFF',
      position: 'relative',
      borderTop: '1px solid #E2E8F0'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-tag">
              <BookOpen size={14} /> Travel Guides & Insights
            </div>
            <h2 className="section-title">
              Latest <span className="animated-gradient-text">Travel Stories</span> & Guides
            </h2>
            <p className="section-subtitle">
              Expert advice, safety handbooks, and budget hacks written by active solo travelers and destination experts.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Blog Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {BLOG_POSTS.map((post, idx) => (
            <ScrollReveal key={post.id} animation="fade-up" delay={idx * 90}>
              <article
                onClick={() => setSelectedBlog(post)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 94, 0, 0.12)';
                  e.currentTarget.style.borderColor = '#FF5E00';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.04)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                {/* Cover Image & Category Pill */}
                <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    backgroundColor: '#0B132B',
                    color: '#00F0FF',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}>
                    {post.category}
                  </div>
                  
                  {/* Like heart */}
                  <button
                    onClick={(e) => toggleLike(e, post.id)}
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                    }}
                  >
                    <Heart size={16} fill={likes[post.id] ? '#EF4444' : 'none'} color={likes[post.id] ? '#EF4444' : '#64748B'} />
                  </button>
                </div>

                {/* Body Content */}
                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.76rem', color: '#64748B', marginBottom: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {post.readTime}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {post.date}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.35,
                      marginBottom: '10px'
                    }}>
                      {post.title}
                    </h3>

                    <p style={{
                      fontSize: '0.85rem',
                      color: '#475569',
                      lineHeight: 1.55,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.summary}
                    </p>
                  </div>

                  {/* Author Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid #F1F5F9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>
                          {post.author}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {post.authorRole}
                        </div>
                      </div>
                    </div>

                    <div style={{ color: '#FF5E00', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.8rem' }}>
                      Read <ArrowRight size={14} />
                    </div>
                  </div>

                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

      </div>

      {/* Full Article Modal */}
      {selectedBlog && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setSelectedBlog(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px', padding: '32px', borderRadius: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="close-btn"
              style={{ top: '20px', right: '20px' }}
            >
              <X size={20} />
            </button>

            {/* Modal Category Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFF4EC',
              color: '#FF5E00',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              marginBottom: '14px'
            }}>
              {selectedBlog.category} • {selectedBlog.readTime}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.3, marginBottom: '16px' }}>
              {selectedBlog.title}
            </h2>

            {/* Author Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <img
                src={selectedBlog.authorAvatar}
                alt={selectedBlog.author}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
                  {selectedBlog.author}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  {selectedBlog.authorRole} • Published {selectedBlog.date}
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px', marginBottom: '20px' }}
            />

            {/* Article Content Paragraphs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
              {selectedBlog.content.map((paragraph, index) => (
                <p key={index} style={{ margin: 0 }}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTA inside blog */}
            <div style={{
              marginTop: '28px',
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                  Ready to test your travel compatibility?
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Find verified companions going to Bali, Tokyo & 120+ spots.
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedBlog(null);
                  if (onOpenWizard) onOpenWizard();
                }}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.85rem' }}
              >
                Find Companion Now <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .blog-section {
            padding: 16px 0 16px 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
