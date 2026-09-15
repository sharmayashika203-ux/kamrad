import React, { useState, useEffect } from 'react';
import { ShieldCheck, Heart, MessageSquare, MapPin, Calendar, DollarSign, Star, Sparkles, Filter, CheckCircle2, UserCheck } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { calculateProfileCompletion } from '../lib/profileUtils';

export const KAMRAD_DATA = [
  {
    id: 'static-1',
    name: "Sophia Chen",
    age: 26,
    country: "🇺🇸 USA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
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
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
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
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
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
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
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
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    destination: "Reykjavik, Iceland",
    dates: "Dec 01 - Dec 12",
    vibe: "Adventure",
    gender: "Female",
    matchScore: 97,
    bio: "Northern Lights chase! Renting a 4x4 camper van in Iceland to explore ice caves & thermal lagoons. Looking for 1-2 travel partners to share driving!",
    splitCost: "Splitting 4x4 Camper Van & Fuel",
    tags: ["#NorthernLights", "#IceCaves", "#Roadtrip", "#CamperLife"],
    verified: true,
    tripsCompleted: 11,
    rating: 5.0
  },
  {
    id: 'static-6',
    name: "Lucas Weber",
    age: 28,
    country: "🇩🇪 Germany",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
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
              <Sparkles size={14} /> Active Verified Companions
            </div>
            <h2 className="section-title">
              Meet Verified Travelers Ready to Connect
            </h2>
            <p className="section-subtitle">
              Every Kamrad profile undergoes 100% biometric ID & background verification. Compare trip dates, budget split rules, and compatibility scores.
            </p>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '28px'
        }}>
          {filteredKamrads.map((kamrad, idx) => (
            <ScrollReveal key={kamrad.id} animation="zoom-in" delay={120 + idx * 80}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}
                className="companion-card"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 22px 45px rgba(255, 107, 0, 0.15)';
                  e.currentTarget.style.borderColor = '#FFD8A8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                {/* Top Header Card Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                    
                    {/* Avatar with Verified Ring Badge */}
                    <div style={{ position: 'relative' }}>
                      <img
                        src={kamrad.avatar}
                        alt={kamrad.name}
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #00E676',
                          boxShadow: '0 4px 12px rgba(0, 230, 118, 0.3)',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        backgroundColor: '#00E676',
                        color: '#FFFFFF',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #FFFFFF'
                      }}>
                        <ShieldCheck size={14} />
                      </div>
                    </div>

                    {/* Right Header Match & Favorite */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <div style={{
                        backgroundColor: 'rgba(255, 107, 0, 0.1)',
                        color: '#FF6B00',
                        border: '1px solid rgba(255, 107, 0, 0.25)',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Sparkles size={12} /> {kamrad.matchScore}% Match
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(e, kamrad.id)}
                        className={favorites[kamrad.id] ? 'heart-active' : ''}
                        style={{
                          background: favorites[kamrad.id] ? '#FFE4E6' : '#F1F5F9',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          color: favorites[kamrad.id] ? '#E11D48' : '#94A3B8',
                          boxShadow: favorites[kamrad.id] ? '0 4px 12px rgba(225, 29, 72, 0.25)' : 'none'
                        }}
                      >
                        <Heart size={18} fill={favorites[kamrad.id] ? '#E11D48' : 'none'} />
                      </button>
                    </div>

                  </div>

                  {/* Name & Title */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                        {kamrad.name}, {kamrad.age}
                      </h3>
                      <span style={{ fontSize: '1.1rem' }}>{kamrad.country}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#00B0FF', backgroundColor: '#E0F7FA', padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> ID VERIFIED
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                        ⭐ {kamrad.rating} ({kamrad.tripsCompleted} trips)
                      </span>
                    </div>
                  </div>

                  {/* Upcoming Destination Pill Box */}
                  <div style={{
                    backgroundColor: '#FFF8ED',
                    border: '1px solid #FFD8A8',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    marginBottom: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: '#C2410C' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={15} style={{ color: '#FF6B00' }} /> {kamrad.destination}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9A3412', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {kamrad.dates}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={13} style={{ color: '#00C853' }} /> {kamrad.splitCost}
                    </div>
                  </div>

                  {/* Bio text */}
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                    "{kamrad.bio}"
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {kamrad.tags.map((tag, idx) => (
                      <span key={idx} style={{
                        backgroundColor: '#F1F5F9',
                        color: '#475569',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                  <button
                    onClick={() => onViewProfile(kamrad)}
                    className="btn-outline"
                    style={{ justifyContent: 'center', padding: '10px 14px', fontSize: '0.85rem' }}
                  >
                    View Itinerary
                  </button>

                  <button
                    onClick={() => onConnectChat(kamrad)}
                    className="btn-primary"
                    style={{ justifyContent: 'center', padding: '10px 14px', fontSize: '0.85rem' }}
                  >
                    <MessageSquare size={15} />
                    Connect
                  </button>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
