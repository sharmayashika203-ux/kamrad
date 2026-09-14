import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import KamradGrid from './components/KamradGrid';
import Destinations from './components/Destinations';
import HowItWorks from './components/HowItWorks';
import SafetySpotlight from './components/SafetySpotlight';
import PricingPlans from './components/PricingPlans';
import Testimonials from './components/Testimonials';
import MatchWizardModal from './components/MatchWizardModal';
import AuthModal from './components/AuthModal';
import ChatModal from './components/ChatModal';
import SupportDrawer from './components/SupportDrawer';
import Footer from './components/Footer';
import { X, ShieldCheck, MapPin, Calendar, DollarSign, Star, CheckCircle2, MessageSquare } from 'lucide-react';

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [filterState, setFilterState] = useState({ destination: '', dates: '', vibe: '', genderFilter: '' });
  
  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [activeChatKamrad, setActiveChatKamrad] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleSearch = (searchData) => {
    setFilterState(searchData);
  };

  const handleSelectDestination = (destName) => {
    setFilterState(prev => ({ ...prev, destination: destName }));
    const target = document.getElementById('kamrads-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      
      {/* 1. Top Notice & Verified Bar matching user's top header */}
      <TopBar
        onOpenAuth={() => setIsAuthOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* 2. Main Navigation Bar matching user's header */}
      <Navbar
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* 3. Hero Banner with Live Search & Match Widget */}
      <Hero
        onSearch={handleSearch}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* 4. Active Verified Companion Explorer Grid */}
      <KamradGrid
        filterState={filterState}
        onConnectChat={(kamrad) => setActiveChatKamrad(kamrad)}
        onViewProfile={(kamrad) => setSelectedProfile(kamrad)}
      />

      {/* 5. Trending Hot Destinations */}
      <Destinations
        onSelectDest={handleSelectDestination}
      />

      {/* 6. How Kamrad Finder Works (4 Step Safety Workflow) */}
      <HowItWorks
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* 7. Safety & 100% ID Verification Spotlight */}
      <SafetySpotlight
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 8. Flexible Subscription & Membership Plans */}
      <PricingPlans
        currency={currency}
      />

      {/* 9. Real Solo Traveler Stories & Reviews */}
      <Testimonials />

      {/* 10. Footer */}
      <Footer
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Modals & Drawers */}
      <MatchWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSelectMatch={(m) => {
          setActiveChatKamrad(m);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ChatModal
        kamrad={activeChatKamrad}
        onClose={() => setActiveChatKamrad(null)}
      />

      <SupportDrawer
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* Profile Detail Quickview Modal */}
      {selectedProfile && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px', padding: '32px' }}>
            <button onClick={() => setSelectedProfile(null)} className="close-btn">
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <img
                src={selectedProfile.avatar}
                alt={selectedProfile.name}
                style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00E676' }}
              />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  {selectedProfile.name}, {selectedProfile.age} {selectedProfile.country}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#00B0FF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <CheckCircle2 size={14} /> 100% Biometric ID Verified
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                  ⭐ {selectedProfile.rating} Rating • {selectedProfile.tripsCompleted} Completed Trips
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFF4EC',
              border: '1px solid #FFD8A8',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: 800, color: '#C2410C', fontSize: '0.95rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} /> Destination: {selectedProfile.destination}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#9A3412', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Calendar size={15} /> Travel Dates: {selectedProfile.dates}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#00C853', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={15} /> Expense Split: {selectedProfile.splitCost}
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Travel Bio & Itinerary
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
              "{selectedProfile.bio}"
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSelectedProfile(null)}
                className="btn-outline"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Close
              </button>

              <button
                onClick={() => {
                  const target = selectedProfile;
                  setSelectedProfile(null);
                  setActiveChatKamrad(target);
                }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <MessageSquare size={16} /> Send Direct Message
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
