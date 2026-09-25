import React, { useState } from 'react';
import { X, Mail, Clock, ShieldCheck, MessageCircle, HelpCircle, Send, CheckCircle } from 'lucide-react';

export default function SupportDrawer({ isOpen, onClose }) {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '480px',
        height: '100vh',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideLeft 0.3s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '24px',
          backgroundColor: '#0B132B',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF' }}>
              Kamrad Support Desk
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#00E5FF', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Clock size={13} /> Active Hours: 9 AM to 5 PM MST
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          
          <div style={{
            backgroundColor: '#FFF4EC',
            border: '1px solid #FFD8A8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Mail size={20} style={{ color: '#FF6B00', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#C2410C' }}>Direct Email Assistance</div>
              <div style={{ fontSize: '0.82rem', color: '#9A3412', marginTop: '2px' }}>
                Email our safety team anytime at <a href="mailto:info@kamradfinder.com" style={{ color: '#FF6B00', fontWeight: 700 }}>info@kamradfinder.com</a>
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            {[
              { q: 'How does ID verification work?', a: 'Upload an official passport or driving license. Our AI system runs facial 3D liveness detection in under 60 seconds.' },
              { q: 'Is Kamrad Finder free to use?', a: 'Yes! The Explorer plan is 100% free forever for browsing verified profiles and creating trip posts.' },
              { q: 'How do split payments work?', a: 'Split payments are held in escrow protection until both travel partners confirm arrival at the destination.' }
            ].map((faq, i) => (
              <div key={i} style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', marginBottom: '4px' }}>
                  {faq.q}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.4 }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            Submit a Help Ticket
          </h4>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0', backgroundColor: '#E0F2FE', borderRadius: '16px' }}>
              <CheckCircle size={40} style={{ color: '#00B0FF', marginBottom: '8px' }} />
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0369A1' }}>Support Ticket Received!</div>
              <div style={{ fontSize: '0.82rem', color: '#0284C7' }}>We will reply to your registered email within 2 hours.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                required
                placeholder="Topic / Question Subject..."
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />

              <textarea
                required
                rows={4}
                placeholder="Describe your request..."
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
                Send Ticket <Send size={16} />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
