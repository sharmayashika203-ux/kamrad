import React, { useState } from 'react';
import { X, Sparkles, MapPin, Calendar, Users, DollarSign, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { rankTravelCompanions } from '../lib/compatibilityEngine';
import { KAMRAD_DATA } from './KamradGrid';
import { useAuth } from '../context/AuthContext';

export default function MatchWizardModal({ isOpen, onClose, onSelectMatch }) {
  const { user, profile } = useAuth();

  const [step, setStep] = useState(1);
  const [dest, setDest] = useState('Bali, Indonesia');
  const [dates, setDates] = useState('Next 30 Days');
  const [vibe, setVibe] = useState('Beach & Relax');
  const [budget, setBudget] = useState('Moderate (50/50 Split)');
  const [genderPref, setGenderPref] = useState('Female Only');
  const [isCalculating, setIsCalculating] = useState(false);
  const [computedMatches, setComputedMatches] = useState([]);

  if (!isOpen) return null;

  const handleCalculate = () => {
    setIsCalculating(true);

    const currentUserObj = {
      id: user?.id,
      destination: dest,
      preferredDestinations: [dest],
      interests: [vibe.split(' ')[0], 'Food', 'Culture', 'Photography'],
      travelStyle: vibe,
      travelDates: dates,
      budget: budget
    };

    const ranked = rankTravelCompanions(currentUserObj, KAMRAD_DATA, {
      genderPref: genderPref,
      targetDestination: dest
    });

    setTimeout(() => {
      setIsCalculating(false);
      setComputedMatches(ranked);
      setStep(4);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '36px' }}>
        
        {/* Close Button */}
        <button onClick={onClose} className="close-btn">
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFF4EC',
            color: '#FF5E00',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '12px'
          }}>
            <Sparkles size={14} /> Travel Compatibility Engine • Step {step} of 4
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            {step === 1 && "Where & When are you traveling?"}
            {step === 2 && "Select your Travel Vibe & Budget"}
            {step === 3 && "Who is your ideal companion?"}
            {step === 4 && "🎉 Top Travel Compatible Companions!"}
          </h2>
        </div>

        {/* Step 1: Destination & Dates */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>
                Target Destination
              </label>
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none'
                }}
              >
                <option value="Bali, Indonesia">🏝️ Bali, Indonesia</option>
                <option value="Santorini, Greece">🏛️ Santorini, Greece</option>
                <option value="Tokyo, Japan">🌸 Tokyo, Japan</option>
                <option value="Swiss Alps, Switzerland">🏔️ Swiss Alps, Switzerland</option>
                <option value="Reykjavik, Iceland">🌋 Reykjavik, Iceland</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>
                Trip Timeline / Dates
              </label>
              <select
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none'
                }}
              >
                <option value="Next 30 Days">Next 30 Days (Flexible)</option>
                <option value="October 2026">October 2026</option>
                <option value="November 2026">November 2026</option>
                <option value="Winter 2026">Winter 2026 Holidays</option>
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '12px' }}
            >
              Continue to Vibe & Budget <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Vibe & Budget */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>
                Travel Vibe
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['Beach & Relax', 'Hiking & Adventure', 'Digital Nomad', 'Culture & Food'].map(v => (
                  <button
                    key={v}
                    onClick={() => setVibe(v)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: vibe === v ? '2px solid #FF5E00' : '1px solid #CBD5E1',
                      backgroundColor: vibe === v ? '#FFF4EC' : '#FFF',
                      color: vibe === v ? '#FF5E00' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>
                Cost Split Policy
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0F172A'
                }}
              >
                <option value="50/50 Split">Split Hotel & Car 50/50</option>
                <option value="Separate Rooms">Pay Own Rooms, Split Tours</option>
                <option value="Budget Backpacker">Backpacker / Hostel Sharing</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                Next: Companion Preference <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Companion Filters & Calculate */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px', display: 'block' }}>
                Preferred Companion Filter (Result Set Filter Only)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['Female Only', 'Male Only', 'Any Gender'].map(g => (
                  <button
                    key={g}
                    onClick={() => setGenderPref(g)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: genderPref === g ? '2px solid #FF5E00' : '1px solid #CBD5E1',
                      backgroundColor: genderPref === g ? '#FFF4EC' : '#FFF',
                      color: genderPref === g ? '#FF5E00' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: '#F8FAFC',
              padding: '14px',
              borderRadius: '14px',
              fontSize: '0.82rem',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid #E2E8F0'
            }}>
              <ShieldCheck size={20} style={{ color: '#10B981', flexShrink: 0 }} />
              <span>Matching is based strictly on travel style, dates, budget & interest compatibility.</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleCalculate}
                className="btn-primary"
                style={{ flex: 2, justifyContent: 'center', padding: '14px' }}
                disabled={isCalculating}
              >
                {isCalculating ? "Calculating Travel Compatibility..." : "Calculate Travel Compatibility 🚀"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {computedMatches.map((m, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFF8ED',
                  border: '1.5px solid #FFD8A8',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={m.avatar}
                    alt={m.name}
                    style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
                      {m.name}, {m.age}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#00B0FF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> ID Verified
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9A3412', marginTop: '2px', fontWeight: 600 }}>
                      Going to {m.destination || dest} ({m.dates || dates})
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{ backgroundColor: '#FF5E00', color: '#FFF', padding: '4px 12px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 800 }}>
                    {m.compatibilityPercent || m.matchScore}% Match
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectMatch(m);
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '10px' }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={onClose}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            >
              Close Matchmaker
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
