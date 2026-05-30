'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notificationService } from '@/services/notificationService'

interface Notification {
  notificationID: number
  userID: number
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

const typeIcons: Record<string, { icon: string; bg: string; color: string }> = {
  Enrollment:  { icon: '📚', bg: '#E8F5F0', color: '#2D7A5E' },
  Reply:       { icon: '💬', bg: '#EEF0FE', color: '#4338CA' },
  Achievement: { icon: '🏆', bg: '#FEF3E2', color: '#B45309' },
  System:      { icon: '🔔', bg: '#F5E8EA', color: '#7C2D3E' },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (days  > 0) return `${days} day${days   > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (mins  > 0) return `${mins} minute${mins > 1 ? 's' : ''} ago`
  return 'just now'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationService.getAll()
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  async function markAsRead(id: number) {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev =>
        prev.map(n => n.notificationID === id ? { ...n, isRead: true } : n)
      )
    } catch {
      // fail silently
    }
  }

  async function markAllAsRead() {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch {
      // fail silently
    }
  }

  async function deleteNotification(id: number) {
    try {
      await notificationService.delete(id)
      setNotifications(prev => prev.filter(n => n.notificationID !== id))
    } catch {
      // fail silently
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              color: 'var(--teal)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: '600',
              marginBottom: '8px',
            }}>
              Your Activity
            </p>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '2.8rem',
              fontWeight: '700',
              color: 'var(--text)',
            }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#7C2D3E',
                  color: 'white',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  marginLeft: '12px',
                  verticalAlign: 'middle',
                }}>
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                backgroundColor: 'transparent',
                border: '1.5px solid var(--border)',
                borderRadius: '100px',
                padding: '10px 20px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>
            Loading notifications...
          </p>
        ) : notifications.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--cream-light)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '64px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{
              fontFamily: 'var(--font-inter)',
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
            }}>
              You're all caught up! No notifications yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map(notif => {
              const typeStyle = typeIcons[notif.type] || typeIcons['System']
              return (
                <div
                  key={notif.notificationID}
                  style={{
                    backgroundColor: notif.isRead ? 'var(--cream-light)' : 'white',
                    border: `1px solid ${notif.isRead ? 'var(--border)' : '#D0E5E0'}`,
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    position: 'relative',
                  }}
                >
                  {/* Unread dot */}
                  {!notif.isRead && (
                    <div style={{
                      position: 'absolute',
                      top: '24px',
                      right: '24px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#7C2D3E',
                    }} />
                  )}

                  {/* Type icon */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: typeStyle.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}>
                    {typeStyle.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px',
                    }}>
                      <span style={{
                        backgroundColor: typeStyle.bg,
                        color: typeStyle.color,
                        padding: '2px 10px',
                        borderRadius: '100px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
                      }}>
                        {notif.type}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                      }}>
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.9rem',
                      color: notif.isRead ? 'var(--text-secondary)' : 'var(--text)',
                      lineHeight: '1.6',
                      marginBottom: '12px',
                    }}>
                      {notif.message}
                    </p>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.notificationID)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontFamily: 'var(--font-inter)',
                            fontSize: '0.78rem',
                            color: 'var(--teal)',
                            cursor: 'pointer',
                            padding: 0,
                            fontWeight: '500',
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.notificationID)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontFamily: 'var(--font-inter)',
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}