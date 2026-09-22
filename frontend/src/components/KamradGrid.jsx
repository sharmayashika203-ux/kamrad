import React, { useState, useEffect } from 'react';
import { ShieldCheck, Heart, MessageSquare, MapPin, Calendar, DollarSign, Star, Sparkles, Filter, CheckCircle2, UserCheck } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { calculateProfileCompletion } from '../lib/profileUtils';
import KamradSwipeStack from './KamradSwipeStack';

export const KAMRAD_DATA = [
  {
    id: 'static-1',
    name: "Sophia Chen",
    age: 26,
    country: "🇺🇸 USA",
    avatar: "/images/sophia.jpg",
    destination: "Bali, Indonesia",
    dates: "Oct 12 - Oct 28",
    vibe: "Nomad",
    gender: "Female",
    matchScore: 99,
    bio: "Digital Nomad & Freelance Designer exploring Bali waterfalls, cafes & scuba spots. Looking for a female travel buddy to share a private villa in Canggu & Ubud!",
    splitCost: "Splitting Villa & Scooter 50/50",
    tags: ["#DigitalNomad", "#ScubaDiving", "#Yoga", "#Foodie"],
    verified: true,
    tripsCompleted: 14,
    rating: 4.9
  },
  {
    id: 'static-2',
    name: "Liam O'Connor",
    age: 29,
    country: "🇮🇪 Ireland",
    avatar: "/images/liam.jpg",
    destination: "Swiss Alps",
    dates: "Nov 02 - Nov 15",
    vibe: "Adventure",
    gender: "Male",
    matchScore: 96,
    bio: "Passionate photographer & alpine hiker planning Zermatt & Matterhorn trails. Seeking an adventure companion to hike, capture sunset shots, & share car rental costs.",
    splitCost: "50/50 Car Rental & Mountain Huts",
    tags: ["#Photography", "#Hiking", "#Snowboarding", "#Coffee"],
    verified: true,
    tripsCompleted: 21,
    rating: 5.0
  },
  {
    id: 'static-3',
    name: "Aria Thorne",
    age: 25,
    country: "🇨🇦 Canada",
    avatar: "/images/aria.jpg",
    destination: "Santorini, Greece",
    dates: "Oct 20 - Nov 04",
    vibe: "Beach",
    gender: "Female",
    matchScore: 98,
    bio: "Solo female traveler planning sunset wine tasting, catamaran cruises & coastal walks in Santorini & Mykonos. Let's explore together and take gorgeous photos!",
    splitCost: "Splitting Sunset Catamaran & Suites",
    tags: ["#Winery", "#Catamaran", "#SunsetViews", "#LuxuryLight"],
    verified: true,
    tripsCompleted: 9,
    rating: 4.95
  },
  {
    id: 'static-4',
    name: "Diego Rossi",
    age: 31,
    country: "🇮🇹 Italy",
    avatar: "/images/diego.jpg",
    destination: "Tokyo, Japan",
    dates: "Nov 10 - Nov 25",
    vibe: "Foodie",
    gender: "Male",
    matchScore: 95,
    bio: "Chef & cultural food explorer heading to Tokyo, Kyoto & Osaka for ramen hidden gems & street food markets. Looking for fellow food lovers!",
    splitCost: "Sharing Food Tastings & Bullet Train Passes",
    tags: ["#RamenLover", "#KyotoTemples", "#StreetFood", "#Anime"],
    verified: true,
    tripsCompleted: 18,
    rating: 4.88
  },
  {
    id: 'static-5',
    name: "Priya Sharma",
    age: 27,
    country: "🇮🇳 India",
    avatar: "/images/priya.jpg",
    destination: "Venice, Italy",
    dates: "Dec 01 - Dec 12",
    vibe: "Romance & Canals",
    gender: "Female",
    matchScore: 97,
    bio: "Venetian romance & canal tour! Exploring historic gondolas, St. Mark's Basilica & wine tasting along Grand Canal. Looking for 1-2 travel companions!",
    splitCost: "Splitting Private Gondola & Canal Tour",
    tags: ["#GondolaTour", "#VeniceCanals", "#GrandCanal", "#WineTasting"],
    verified: true,
    tripsCompleted: 11,
    rating: 5.0
  },
  {
    id: 'static-6',
    name: "Lucas Weber",
    age: 28,
    country: "🇩🇪 Germany",
    avatar: "/images/lucas.jpg",
    destination: "Amalfi Coast, Italy",
    dates: "Oct 15 - Oct 25",
    vibe: "Luxury",
    gender: "Male",
    matchScore: 94,
    bio: "Architect and solo backpacker exploring Positano & Capri. Planning cliffside hikes & boat rentals around Amalfi.",
    splitCost: "Splitting Private Boat & Coastal Stay",
    tags: ["#Architecture", "#Sailing", "#Positano", "#Gelato"],
    verified: true,
    tripsCompleted: 16,
    rating: 4.92
  }
];

export default function KamradGrid({ filterState, onConnectChat, onViewProfile }) {
  const [activeTab, setActiveTab] = useState('All');
  const [favorites, setFavorites] = useState({});
  const [dbProfiles, setDbProfiles] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchLiveProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            age,
            country,
            city,
            profile_photo,
            bio,
            gender,
            verification_status,
            account_status,
            travel_preferences (
              preferred_destinations,
              travel_dates,
              travel_style,
              budget_level
            ),
            user_interests (
              interests ( name )
            )
          `)
          .eq('account_status', 'active');

        if (error || !data) return;

        // Transform and filter profiles with completion >= 60%
        const validProfiles = data.map(p => {
          const prefs = p.travel_preferences?.[0] || p.travel_preferences || {};
          const userInts = (p.user_interests || []).map(ui => ui.interests?.name).filter(Boolean);
          
          const completion = calculateProfileCompletion(p, prefs, userInts);
          if (completion < 60) return null; // Exclude incomplete profiles!

          return {
            id: p.id,
            name: p.full_name,
            age: p.age || 25,
            country: `${p.city ? p.city + ', ' : ''}${p.country || 'Global'}`,
            avatar: p.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            destination: prefs.preferred_destinations?.[0] || 'Bali, Indonesia',
            dates: prefs.travel_dates || 'Flexible Dates',
            vibe: prefs.travel_style || 'Adventure',
            gender: p.gender === 'female' ? 'Female' : 'Male',
            matchScore: Math.floor(Math.random() * 10) + 90,
            bio: p.bio || 'Verified solo traveler looking for companion trips.',
            splitCost: `Budget: ${prefs.budget_level || 'Moderate'}`,
            tags: userInts.length > 0 ? userInts.slice(0, 4).map(t => `#${t.replace(/\s+/g, '')}`) : ['#VerifiedTraveler', '#Kamrad'],
            verified: p.verification_status === 'verified',
            tripsCompleted: 5,
            rating: 5.0
          };
        }).filter(Boolean);

        setDbProfiles(validProfiles);
      } catch (err) {
        console.error('Error fetching live grid profiles:', err);
      }
    };

    fetchLiveProfiles();
  }, []);

  const combinedKamrads = [...dbProfiles, ...KAMRAD_DATA];

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    const isFav = !favorites[id];
    setFavorites(prev => ({ ...prev, [id]: isFav }));
    if (isFav) {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#E11D48', '#FF6B00', '#00E676']
      });
    }
  };

  const filteredKamrads = combinedKamrads.filter(k => {
    if (activeTab === 'Solo Female' && k.gender !== 'Female') return false;
    if (activeTab === 'Adventure' && k.vibe !== 'Adventure') return false;
    if (activeTab === 'Nomads' && k.vibe !== 'Nomad') return false;
    if (activeTab === 'Foodie' && k.vibe !== 'Foodie') return false;

    if (filterState?.destination && filterState.destination.trim() !== '') {
      if (!k.destination.toLowerCase().includes(filterState.destination.toLowerCase())) {
        return false;
      }
    }
    return true;
  });


  return (
    <section id="kamrads-section" style={{
      padding: '90px 0',
      backgroundColor: '#F8FAFC'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="section-tag">
              <Sparkles size={14} /> Explore Travelers
            </div>
            <h2 className="section-title">
              Find People Who Love to Travel
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0 auto 14px' }}>
              Connect with travelers who share your interests, hobbies, and travel plans. Discover profiles, compare travel preferences, and find the right people to make your next journey more memorable.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#FF5E00', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
              Explore Travelers →
            </div>
          </div>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}>
            {[
              { id: 'All', label: '✨ All Active Kamrads' },
              { id: 'Solo Female', label: '👩 Solo Female Travelers' },
              { id: 'Adventure', label: '🏔️ Hiking & Adventure' },
              { id: 'Nomads', label: '💻 Digital Nomads' },
              { id: 'Foodie', label: '🍜 Food & Culture' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: activeTab === tab.id ? '#0B132B' : '#FFFFFF',
                  color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                  border: activeTab === tab.id ? '1px solid #0B132B' : '1px solid #E2E8F0',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: activeTab === tab.id ? '0 8px 20px rgba(11, 19, 43, 0.25)' : '0 2px 4px rgba(0,0,0,0.03)',
                  transform: activeTab === tab.id ? 'scale(1.04)' : 'scale(1)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Companion Cards Grid */}
        {isMobile ? (
          <ScrollReveal animation="fade-up" delay={200}>
            <KamradSwipeStack kamrads={filteredKamrads} onConnect={(kamrad) => {
              if (onConnectChat) onConnectChat(kamrad);
            }} />
          </ScrollReveal>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px'
          }}>
          {filteredKamrads.map((kamrad, idx) => (
            <ScrollReveal key={kamrad.id} animation="zoom-in" delay={120 + idx * 80}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '22px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 12px 35px rgba(15, 23, 42, 0.06)',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  overflow: 'hidden'
                }}
                className="companion-card"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 24px 50px rgba(255, 94, 0, 0.16)';
                  e.currentTarget.style.borderColor = '#FFD8A8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 23, 42, 0.06)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                {/* Top Photo Cover Container */}
                <div style={{ position: 'relative', height: '230px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={kamrad.avatar}
                    alt={kamrad.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                  {/* Subtle Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.5) 0%, transparent 40%, rgba(15, 23, 42, 0.6) 100%)'
                  }} />

                  {/* Top Left Name Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: '#FFFFFF',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{kamrad.name.split(' ')[0]}</span>
                  </div>

                  {/* Top Right Actions (Favorite & Share) */}
                  <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => toggleFavorite(e, kamrad.id)}
                      className={favorites[kamrad.id] ? 'heart-active' : ''}
                      style={{
                        background: favorites[kamrad.id] ? '#FFE4E6' : 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        color: favorites[kamrad.id] ? '#E11D48' : '#FFFFFF'
                      }}
                    >
                      <Heart size={18} fill={favorites[kamrad.id] ? '#E11D48' : 'none'} />
                    </button>
                  </div>

                  {/* Bottom Right Match Score Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '14px',
                    background: 'linear-gradient(135deg, #FF5E00, #FF0055)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 14px rgba(255, 94, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <Sparkles size={12} /> {kamrad.matchScore}% Match
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    {/* Location Tag */}
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#64748B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <MapPin size={12} style={{ color: '#FF5E00' }} /> {kamrad.destination}
                    </div>

                    {/* Trip Title */}
                    <h3 style={{
                      fontSize: '1.18rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      fontFamily: "'Outfit', sans-serif",
                      marginBottom: '6px',
                      lineHeight: 1.3
                    }}>
                      {kamrad.name.split(' ')[0]}'s {kamrad.destination.split(',')[0]} Trip
                    </h3>

                    {/* Dates */}
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#475569',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Calendar size={14} style={{ color: '#00F0FF' }} /> {kamrad.dates}
                    </div>

                    {/* Bio Description */}
                    <p style={{
                      fontSize: '0.88rem',
                      color: '#64748B',
                      lineHeight: 1.5,
                      marginBottom: '14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      "{kamrad.bio}"
                    </p>

                    {/* Budget & Verified Rating Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#059669',
                        backgroundColor: '#ECFDF5',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <DollarSign size={13} style={{ color: '#059669' }} /> {kamrad.splitCost}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
                        ⭐ {kamrad.rating} ({kamrad.tripsCompleted} trips)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
                    <button
                      onClick={() => onViewProfile(kamrad)}
                      className="btn-outline"
                      style={{ justifyContent: 'center', padding: '9px 12px', fontSize: '0.85rem', borderRadius: '12px' }}
                    >
                      View Trip
                    </button>

                    <button
                      onClick={() => onConnectChat(kamrad)}
                      className="btn-primary"
                      style={{ justifyContent: 'center', padding: '9px 12px', fontSize: '0.85rem', borderRadius: '12px' }}
                    >
                      <MessageSquare size={15} />
                      Connect
                    </button>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
          </div>
        )}

      </div>
    </section>
  );
}
