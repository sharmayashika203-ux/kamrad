import React from 'react';
import { X, Bell, Check, CheckCheck, Sparkles, Heart, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../lib/connectionService';

export default function NotificationsDrawer({ isOpen, onClose, notifications = [], onRefresh, onSelectNotification }) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const formatTimestamp = (isoString) => {
    if (!isoString) return 'Just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    await markNotificationAsRead(id);
    if (onRefresh) onRefresh();
  };

  const handleMarkAllRead = async () => {
    if (notifications.length > 0) {
      await markAllNotificationsAsRead(notifications[0].user_id);
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end' }}>
      <div className="modal-content" style={{
        maxWidth: '420px',
        width: '100%',
        height: '100vh',
        maxHeight: '100vh',
        borderRadius: 0,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.25s ease-out'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: '#FFF4EC',
              color: '#FF5E00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Notifications
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                {unreadCount > 0 ? `${unreadCount} unread travel updates` : 'All caught up!'}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="close-btn" style={{ position: 'relative', top: 0, right: 0 }}>
            <X size={20} />
          </button>
        </div>

        {/* Mark All Read Action Button */}
        {unreadCount > 0 && (
          <div style={{ marginBottom: '14px', textAlign: 'right' }}>
            <button
              onClick={handleMarkAllRead}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF5E00',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <CheckCheck size={14} /> Mark All as Read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
              <Bell size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>No Notifications Yet</div>
              <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                Travel interests, mutual matches, and platform updates will appear here.
              </div>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.is_read) markNotificationAsRead(n.id).then(onRefresh);
                  if (onSelectNotification) onSelectNotification(n);
                }}
                style={{
                  backgroundColor: n.is_read ? '#FFFFFF' : '#FFF8ED',
                  border: n.is_read ? '1px solid #E2E8F0' : '1.5px solid #FFD8A8',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: n.type === 'match' ? '#00E676' : '#FF5E00',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {n.type === 'match' ? <Sparkles size={16} /> : <Heart size={16} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>
                        {n.title}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                        {formatTimestamp(n.created_at)}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                      {n.content}
                    </p>
                  </div>

                  {!n.is_read && (
                    <button
                      onClick={(e) => handleMarkRead(n.id, e)}
                      title="Mark as Read"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
