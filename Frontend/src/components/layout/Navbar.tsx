'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'
import { useState, useEffect } from 'react'

const adminLinks = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Courses', href: '/admin/courses' },
  { label: 'Forum', href: '/admin/forum' },
]

const studentLinks = [
  { label: 'Courses', href: '/courses' },
  { label: 'Patterns', href: '/patterns' },
  { label: 'Community', href: '/forum' },
  { label: 'My Studio', href: '/profile' },
]

const instructorLinks = [
  { label: 'My Courses', href: '/instructor/dashboard' },
  { label: 'My Patterns', href: '/instructor/patterns' },
  { label: 'Community', href: '/forum' },
  { label: 'My Studio', href: '/profile' },
]


export default function Navbar() {
  const pathname = usePathname()
  const { isLoggedIn, user, logout } = useAuth()
  const router = useRouter()

  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!isLoggedIn) return

    async function fetchUnread() {
      try {
        const data = await fetch(
          'https://localhost:7167/api/Notification/unread-count',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        ).then(r => r.json())

        setUnreadCount(data.unreadCount || 0)
      } catch {
        setUnreadCount(0)
      }
    }

    fetchUnread()

    const interval = setInterval(fetchUnread, 30000)

    return () => clearInterval(interval)
  }, [isLoggedIn])

  function handleLogout() {
    logout()
    router.push('/')
  }
  const navLinks = user?.role === 'Instructor'
    ? instructorLinks
    : user?.role === 'Admin'
      ? adminLinks
      : studentLinks

  return (
    <nav style={{
      backgroundColor: 'var(--cream-light)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 48px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}>
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <g transform="translate(50,52)">
                <line x1="0" y1="-48" x2="0" y2="-40" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-34" y1="-34" x2="-28" y2="-28" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="30" y1="-35" x2="25" y2="-29" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-48" y1="0" x2="-40" y2="0" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="0" cy="4" r="32" stroke="var(--teal)" strokeWidth="2.5" fill="none" />
                <path d="M-30 -10 Q0 -20 30 -10" stroke="var(--teal)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M-32 4 Q0 -6 32 4" stroke="var(--teal)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M-30 18 Q0 8 30 18" stroke="var(--teal)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M-16 -28 Q-12 4 -14 34" stroke="var(--teal)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M0 -30 Q2 4 0 36" stroke="var(--teal)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M16 -28 Q12 4 14 34" stroke="var(--teal)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M-24 34 Q-32 40 -34 46 Q-36 50 -32 49" stroke="var(--teal)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <line x1="18" y1="-24" x2="30" y2="-46" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" />
                <line x1="30" y1="-46" x2="34" y2="-52" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" />
                <path d="M34 -52 Q40 -58 41 -50 Q42 -44 36 -42" stroke="var(--teal)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            </svg>
            <span style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'var(--teal)',
              opacity: 0.9,
            }}>
              CrochetHub
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: pathname === link.href ? 'var(--text)' : 'var(--text-secondary)',
              textDecoration: 'none',
              borderBottom: pathname === link.href ? '2px solid var(--maroon)' : '2px solid transparent',
              paddingBottom: '2px',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              {/* Notifications icon */}
              {isLoggedIn && (
                <Link href="/notifications" style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                      stroke="#4A6B5E"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      d="M13.73 21a2 2 0 0 1-3.46 0"
                      stroke="#4A6B5E"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      minWidth: '16px',
                      height: '16px',
                      borderRadius: '100px',
                      backgroundColor: '#7C2D3E',
                      border: '2px solid var(--cream-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.6rem',
                      fontWeight: '700',
                      color: 'white',
                      padding: '0 3px',
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </Link>
              )}

              {/* User avatar */}
              <Link href="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--teal)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {(user as any)?.profilePicture ? (
                    <img
                      src={(user as any).profilePicture}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.8" fill="none" />
                      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </Link>

              {/* Logout button */}

            </>
          ) : (
            <>
              <Link href="/login" style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                Login
              </Link>
              <Link href="/register" style={{
                backgroundColor: 'var(--teal)',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '100px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none',
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}