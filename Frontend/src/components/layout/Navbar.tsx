'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

const studentLinks = [
  { label: 'Courses', href: '/courses' },
  { label: 'Patterns', href: '/patterns' },
  { label: 'Community', href: '/forum' },
]

const instructorLinks = [
  { label: 'Courses', href: '/courses' },
  { label: 'Dashboard', href: '/instructor/dashboard' },
  { label: 'Patterns', href: '/patterns' },
  { label: 'Community', href: '/forum' },

]

const adminLinks = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Courses', href: '/admin/courses' },
  { label: 'Patterns', href: '/admin/patterns' },
  { label: 'Forum', href: '/admin/forum' },
]

const studentReports = [
  { label: 'My Learning', endpoint: '/Report/student/my-learning' },
  { label: 'My Progress', endpoint: '/Report/student/my-progress' },
  { label: 'My Patterns', endpoint: '/Report/student/my-patterns' },
  { label: 'Activity Summary', endpoint: '/Report/student/activity-summary' },
  { label: 'Course Certificate', endpoint: 'COURSE_CERT' },
]

const instructorReports = [
  { label: 'Course Performance', endpoint: '/Report/instructor/course-performance' },
  { label: 'Student Progress', endpoint: '/Report/instructor/student-progress' },
  { label: 'Lesson Engagement', endpoint: '/Report/instructor/lesson-engagement' },
  { label: 'Popularity', endpoint: '/Report/instructor/popularity' },
  { label: 'Instructor Certificate', endpoint: '/Report/certificate/instructor-achievement' },
]

const adminReports = [
  { label: 'Platform Overview', endpoint: '/Report/admin/platform-overview' },
  { label: 'User Growth', endpoint: '/Report/admin/user-growth' },
  { label: 'Forum Activity', endpoint: '/Report/admin/forum-activity' },
  { label: 'Content Audit', endpoint: '/Report/admin/content-audit' },
  { label: 'Top Contributor Cert', endpoint: 'TOP_CONTRIBUTOR' },
]

export default function Navbar() {
  const [showCourseInput, setShowCourseInput] = useState(false)
  const [showContribInput, setShowContribInput] = useState(false)
  const [courseIDInput, setCourseIDInput] = useState('')
  const [userIDInput, setUserIDInput] = useState('')
  const { isLoggedIn, user, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [reportsOpen, setReportsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    if (isLoggedIn) {
      apiFetch('/Notification/unread-count')
        .then(data => setUnreadCount(data.unreadCount || 0))
        .catch(() => { })
    }
  }, [isLoggedIn])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setReportsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = user?.role === 'Instructor'
    ? instructorLinks
    : user?.role === 'Admin'
      ? adminLinks
      : studentLinks

  const reports = user?.role === 'Instructor'
    ? instructorReports
    : user?.role === 'Admin'
      ? adminReports
      : studentReports

  async function handleDownloadReport(endpoint: string) {
    if (endpoint === 'COURSE_CERT') {
      setReportsOpen(false)
      setShowCourseInput(true)
      return
    }
    if (endpoint === 'TOP_CONTRIBUTOR') {
      setReportsOpen(false)
      setShowContribInput(true)
      return
    }
    setReportsOpen(false)
    try {
      const response = await fetch(`https://localhost:7167/api${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      })
      if (!response.ok) throw new Error(`Error: ${response.status}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${endpoint.split('/').pop()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Report download failed:', err)
    }
  }

  async function downloadCourseCert() {
    if (!courseIDInput) return
    await handleDownloadReport(`/Report/certificate/course-completion/${courseIDInput}`)
    setShowCourseInput(false)
    setCourseIDInput('')
  }

  async function downloadContribCert() {
    if (!userIDInput) return
    await handleDownloadReport(`/Report/certificate/top-contributor/${userIDInput}`)
    setShowContribInput(false)
    setUserIDInput('')
  }

  return (
    <nav style={{
      backgroundColor: 'var(--cream)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 48px',
        height: '68px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLoggedIn ? (
            <>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                }}>
                  {link.label}
                </Link>
              ))}

              {/* Reports dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setReportsOpen(prev => !prev)}
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Reports
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{
                    transform: reportsOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {reportsOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '0',
                    backgroundColor: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '8px',
                    minWidth: '200px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    zIndex: 200,
                  }}>
                    {reports.map((report, i) => (
                      <button
                        key={i}
                        onClick={() => report.endpoint && handleDownloadReport(report.endpoint)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 14px',
                          background: 'none',
                          border: 'none',
                          borderRadius: '8px',
                          fontFamily: 'var(--font-inter)',
                          fontSize: '0.875rem',
                          color: 'var(--text)',
                          cursor: report.endpoint ? 'pointer' : 'not-allowed',
                          opacity: report.endpoint ? 1 : 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={e => {
                          if (report.endpoint) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream)'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#2D6B5E" strokeWidth="1.8" fill="none" />
                          <polyline points="14 2 14 8 20 8" stroke="#2D6B5E" strokeWidth="1.8" />
                          <line x1="16" y1="13" x2="8" y2="13" stroke="#2D6B5E" strokeWidth="1.8" />
                          <line x1="16" y1="17" x2="8" y2="17" stroke="#2D6B5E" strokeWidth="1.8" />
                        </svg>
                        {report.label}
                        {report.endpoint && (
                          <span style={{
                            marginLeft: 'auto',
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                          }}>
                            PDF ↓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {studentLinks.map(link => (
                <Link key={link.href} href={link.href} style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                }}>
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isLoggedIn ? (
            <>
              {/* Notification bell */}
              <Link href="/notifications" style={{ position: 'relative', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {unreadCount > 0 && (
                  <div style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    backgroundColor: '#7C2D3E', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-inter)', fontSize: '0.6rem',
                    fontWeight: '700', color: 'white',
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </Link>

              {/* Avatar */}
              <Link href="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: 'var(--teal)', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {(user as any)?.profilePicture ? (
                    <img src={(user as any).profilePicture} alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.8" fill="none" />
                      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

              </Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                fontFamily: 'var(--font-inter)', fontSize: '0.875rem',
                color: 'var(--text)', textDecoration: 'none',
              }}>
                Login
              </Link>
              <Link href="/register" style={{
                backgroundColor: 'var(--teal)', color: 'white',
                padding: '10px 24px', borderRadius: '100px',
                fontFamily: 'var(--font-inter)', fontWeight: '500',
                fontSize: '0.875rem', textDecoration: 'none',
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Course Certificate Modal */}
      {showCourseInput && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowCourseInput(false)}>
          <div style={{
            backgroundColor: 'white', borderRadius: '20px', padding: '32px',
            width: '400px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{
              fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem',
              fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
            }}>
              Course Certificate
            </h3>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Enter the Course ID to download your completion certificate
            </p>
            <input
              type="number"
              placeholder="Course ID (e.g. 10)"
              value={courseIDInput}
              onChange={e => setCourseIDInput(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'var(--cream)',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box', marginBottom: '16px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={downloadCourseCert} style={{
                flex: 1, padding: '12px', backgroundColor: '#7C2D3E', color: 'white',
                border: 'none', borderRadius: '10px', fontFamily: 'var(--font-inter)',
                fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
              }}>
                Download PDF
              </button>
              <button onClick={() => setShowCourseInput(false)} style={{
                padding: '12px 20px', backgroundColor: 'transparent',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem', cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Contributor Certificate Modal */}
      {showContribInput && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowContribInput(false)}>
          <div style={{
            backgroundColor: 'white', borderRadius: '20px', padding: '32px',
            width: '400px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{
              fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem',
              fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
            }}>
              Top Contributor Certificate
            </h3>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Enter the User ID to generate their top contributor certificate
            </p>
            <input
              type="number"
              placeholder="User ID (e.g. 2)"
              value={userIDInput}
              onChange={e => setUserIDInput(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', backgroundColor: 'var(--cream)',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box', marginBottom: '16px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={downloadContribCert} style={{
                flex: 1, padding: '12px', backgroundColor: '#7C2D3E', color: 'white',
                border: 'none', borderRadius: '10px', fontFamily: 'var(--font-inter)',
                fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
              }}>
                Download PDF
              </button>
              <button onClick={() => setShowContribInput(false)} style={{
                padding: '12px 20px', backgroundColor: 'transparent',
                border: '1.5px solid var(--border)', borderRadius: '10px',
                fontFamily: 'var(--font-inter)', fontSize: '0.9rem', cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}