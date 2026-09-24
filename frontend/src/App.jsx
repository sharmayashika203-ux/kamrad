import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StepProcessGrid from './components/StepProcessGrid';
import KamradGrid from './components/KamradGrid';
import Destinations from './components/Destinations';
import HowItWorks from './components/HowItWorks';
import SafetySpotlight from './components/SafetySpotlight';
import PricingPlans from './components/PricingPlans';
import Testimonials from './components/Testimonials';
import FAQSection from './components/FAQSection';
import BlogSection from './components/BlogSection';
import MatchWizardModal from './components/MatchWizardModal';
import AuthModal from './components/AuthModal';
import ProfileSetupModal from './components/ProfileSetupModal';
import ChatModal from './components/ChatModal';
import SupportDrawer from './components/SupportDrawer';
import TravelMatchModal from './components/TravelMatchModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import LiveActivityToast from './components/LiveActivityToast';
import FloatingMatchFAB from './components/FloatingMatchFAB';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { sendTravelInterest, fetchUserNotifications } from './lib/connectionService';
import { X, MapPin, Calendar, DollarSign, CheckCircle2, MessageSquare } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { user, profile } = useAuth();
  const [currency, setCurrency] = useState('USD');
  const [filterState, setFilterState] = useState({ destination: '', dates: '', vibe: '', genderFilter: '' });
  
  // Modals & Drawers state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Connection & Match state
  const [activeChatKamrad, setActiveChatKamrad] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications for logged-in user
  const loadNotifications = async () => {
    if (user?.id) {
      const data = await fetchUserNotifications(user.id);
      setNotifications(data);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleSearch = (searchData) => {
    setFilterState(searchData);
  };

  const handleSelectDestination = (destName) => {
    setFilterState(prev => ({ ...prev, destination: destName }));
    const target = document.getElementById('kamrads-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    if (!profile?.city || !profile?.country) {
      setIsProfileSetupOpen(true);
    }
  };

  // Handle Connect CTA on a Companion Profile Card
  const handleConnectCompanion = async (companion) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const result = await sendTravelInterest(user, companion);
      if (result.isMutualMatch) {
        setMatchData(result);
        setIsMatchModalOpen(true);
      } else {
        alert(`✈️ Travel interest sent to ${companion.name || companion.full_name}! They will be notified.`);
      }
      loadNotifications();
    } catch (err) {
      alert(err.message || 'Failed to send travel interest.');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      
      {/* 2. Main Navigation Bar */}
      <Navbar
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenProfileSetup={() => setIsProfileSetupOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onSelectDest={handleSelectDestination}
        unreadNotificationsCount={unreadCount}
      />

      <Routes>
        <Route path="/" element={
          <>
            {/* 3. Hero Banner with Live Search & Match Widget */}
            <Hero
              onSearch={handleSearch}
              onOpenWizard={() => setIsWizardOpen(true)}
            />

            {/* 3.5. 4-Step Process Grid */}
            <StepProcessGrid />

            {/* 4. Active Verified Companion Explorer Grid */}
            <KamradGrid
              filterState={filterState}
              onConnectChat={handleConnectCompanion}
              onViewProfile={(kamrad) => setSelectedProfile(kamrad)}
            />

            {/* 5. Trending Hot Destinations */}
            <Destinations
              onSelectDest={handleSelectDestination}
            />
            
            {/* 9. Real Solo Traveler Stories & Reviews */}
            <Testimonials />

            {/* 9.5. Travel Guides & Articles (3 Blogs) */}
            <BlogSection onOpenWizard={() => setIsWizardOpen(true)} />

            {/* 10. Frequently Asked Destination Questions */}
            <FAQSection />
          </>
        } />

        <Route path="/how-it-works" element={
          /* 6. How Kamrad Finder Works (4 Step Safety Workflow) */
          <HowItWorks
            onOpenWizard={() => setIsWizardOpen(true)}
          />
        } />

        <Route path="/about" element={
          /* 7. Safety & 100% ID Verification Spotlight */
          <SafetySpotlight
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        } />

        <Route path="/blog" element={
          /* Travel Guides & Blogs Route */
          <BlogSection
            onOpenWizard={() => setIsWizardOpen(true)}
          />
        } />

        <Route path="/plans" element={
          /* 8. Flexible Subscription & Membership Plans */
          <PricingPlans
            currency={currency}
          />
        } />
      </Routes>

      {/* 10. Footer */}
      <Footer
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Floating Dynamic Activity Widgets */}
      <LiveActivityToast onOpenWizard={() => setIsWizardOpen(true)} />
      <FloatingMatchFAB onOpenWizard={() => setIsWizardOpen(true)} />

      {/* Modals & Drawers */}
      <MatchWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSelectMatch={(m) => {
          handleConnectCompanion(m);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <ProfileSetupModal
        isOpen={isProfileSetupOpen}
        onClose={() => setIsProfileSetupOpen(false)}
      />

      <ChatModal
        kamrad={activeChatKamrad}
        onClose={() => setActiveChatKamrad(null)}
      />

      <SupportDrawer
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <TravelMatchModal
        isOpen={isMatchModalOpen}
        matchData={matchData}
        onClose={() => setIsMatchModalOpen(false)}
        onStartChat={(c) => {
          setActiveChatKamrad(c);
        }}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onRefresh={loadNotifications}
        onSelectNotification={(n) => {
          setIsNotificationsOpen(false);
        }}
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
                src={selectedProfile.avatar || selectedProfile.profile_photo}
                alt={selectedProfile.name}
                style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #10B981', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
              />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  {selectedProfile.name}, {selectedProfile.age} {selectedProfile.country}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#00F0FF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <CheckCircle2 size={14} /> ID Verified Profile
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                  ⭐ {selectedProfile.rating || 5.0} Rating • {selectedProfile.tripsCompleted || 5} Completed Trips
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
              <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  handleConnectCompanion(target);
                }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <MessageSquare size={16} /> Connect & Chat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
