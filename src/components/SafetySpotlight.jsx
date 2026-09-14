import React from 'react';
import { ShieldCheck, PhoneCall, Lock, UserCheck, Award, AlertTriangle, CheckCircle, FileCheck } from 'lucide-react';

export default function SafetySpotlight({ onOpenAuth }) {
  const safetyFeatures = [
    {
      title: "Biometric Selfie Match",
      desc: "Our AI compares live facial features with government passport photos to eliminate fake profiles.",
      icon: <UserCheck size={24} style={{ color: '#00E676' }} />
    },
    {
      title: "Global Background Checks",
      desc: "Cross-checked against public safety registries and watchlists for complete peace of mind.",
      icon: <FileCheck size={24} style={{ color: '#00B0FF' }} />
    },
    {
      title: "24/7 SOS Emergency Button",
      desc: "Instant live GPS sharing & emergency hotline connect within the Kamrad Mobile App.",
      icon: <PhoneCall size={24} style={{ color: '#FF3D00' }} />
    },
    {
      title: "Escrow Split-Payments",
      desc: "Pre-fund shared hotel/car expenses in secure escrow that releases only when both companions confirm.",
      icon: <Lock size={24} style={{ color: '#7C4DFF' }} />
    }
  ];

  return (
    <section id="safety-section" style={{
      padding: '90px 0',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '50px',
          alignItems: 'center'
        }}>

          {/* Left Column Text */}
          <div>
            <div className="section-tag" style={{ background: 'rgba(0, 200, 83, 0.1)', color: '#00C853', borderColor: 'rgba(0, 200, 83, 0.2)' }}>
              <ShieldCheck size={14} /> 100% ID Verified Guarantee
            </div>

            <h2 className="section-title">
              Why We Are The #1 Trusted Travel Matching Platform
            </h2>

            <p className="section-subtitle" style={{ margin: '0 0 28px 0' }}>
              Safety is our core commitment. Every member on Kamrad Finder must pass strict multi-level identity authentication before contacting travel partners.
            </p>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {safetyFeatures.map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #E2E8F0',
                    flexShrink: 0
                  }}>
                    {feat.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      {feat.title}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenAuth}
              className="btn-primary"
              style={{
                backgroundColor: '#00C853',
                backgroundImage: 'linear-gradient(135deg, #00C853 0%, #00E676 100%)',
                boxShadow: '0 8px 24px rgba(0, 200, 83, 0.35)'
              }}
            >
              <ShieldCheck size={18} /> Get Verified Now
            </button>
          </div>

          {/* Right Visual Safety Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)',
            borderRadius: '32px',
            padding: '36px',
            color: '#FFFFFF',
            boxShadow: '0 25px 60px rgba(11, 19, 43, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}>
            
            {/* Verified Badge Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#00E676',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFF' }}>Verification Shield</div>
                  <div style={{ fontSize: '0.78rem', color: '#00E676' }}>Active & Protection Enabled</div>
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', backgroundColor: 'rgba(0, 230, 118, 0.15)', color: '#00E676', padding: '4px 12px', borderRadius: '999px', fontWeight: 700 }}>
                100% SECURE
              </span>
            </div>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {[
                'Government Passport / National ID Check',
                'Live Biometric 3D Liveness Selfie Scan',
                'Mobile Phone OTP & Email Ownership',
                'LinkedIn & Instagram Social Verification',
                'Community Review & Safety Trust Rating'
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={18} style={{ color: '#00E676', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 107, 0, 0.15)',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.85rem',
              color: '#FF8A00'
            }}>
              <Award size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Safety Promise:</strong> Unverified accounts cannot send private messages to registered travelers.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
