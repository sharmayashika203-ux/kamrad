import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Phone, Video, Calendar, MapPin } from 'lucide-react';

export default function ChatModal({ kamrad, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'kamrad', text: `Hey there! 👋 Saw you are planning a trip soon. I'm heading to ${kamrad?.destination || 'Bali'} from ${kamrad?.dates || 'Oct 12 - Oct 28'}.`, time: '10:14 AM' },
    { sender: 'kamrad', text: `My ID verification badge is checked 🛡️. Are you interested in sharing villa & car rental costs 50/50?`, time: '10:15 AM' }
  ]);
  const [input, setInput] = useState('');

  if (!kamrad) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate Kamrad response
    setTimeout(() => {
      const replyMsg = {
        sender: 'kamrad',
        text: `Awesome! That sounds like a great plan. Let's schedule a quick video call on Kamrad Finder to align our itinerary details! ✈️`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '460px',
        height: '100vh',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideLeft 0.3s ease-out'
      }}>
        
        {/* Chat Drawer Header */}
        <div style={{
          padding: '20px',
          backgroundColor: '#0B132B',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={kamrad.avatar}
                alt={kamrad.name}
                style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00E676' }}
              />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', backgroundColor: '#00E676', borderRadius: '50%' }} />
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {kamrad.name}
                <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(0, 230, 118, 0.2)', color: '#00E676', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
                  VERIFIED
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Trip: {kamrad.destination} ({kamrad.dates})
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Messages Body */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{
            textAlign: 'center',
            backgroundColor: '#FFF4EC',
            border: '1px solid #FFD8A8',
            borderRadius: '12px',
            padding: '10px',
            fontSize: '0.78rem',
            color: '#C2410C',
            fontWeight: 600
          }}>
            🛡️ Encrypted Direct Message • 100% ID Verified Safety Session
          </div>

          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                backgroundColor: m.sender === 'user' ? '#FF6B00' : '#FFFFFF',
                color: m.sender === 'user' ? '#FFFFFF' : '#0F172A',
                padding: '12px 16px',
                borderRadius: m.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                border: m.sender === 'user' ? 'none' : '1px solid #E2E8F0'
              }}
            >
              <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{m.text}</div>
              <div style={{
                fontSize: '0.68rem',
                color: m.sender === 'user' ? 'rgba(255,255,255,0.8)' : '#94A3B8',
                textAlign: 'right',
                marginTop: '4px'
              }}>
                {m.time}
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={{
          padding: '16px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <input
            type="text"
            placeholder={`Message ${kamrad.name.split(' ')[0]}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '999px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              padding: 0,
              justifyContent: 'center'
            }}
          >
            <Send size={18} />
          </button>
        </form>

      </div>
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
