'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { studentService } from '@/services/studentService'
import { useRouter } from 'next/navigation'
import config from '@/config'
export default function HomePage() {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()
  const [dashboard, setDashboard] = useState<{
    enrolledCourses: any[]
    recommendedCourses: any[]
  } | null>(null)
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([])
  const [savedPatternsCount, setSavedPatternsCount] = useState(0)
  const [allCourses, setAllCourses] = useState<any[]>([])


  useEffect(() => {

    if (isLoggedIn) {
        fetch(`${config.API_BASE_URL}/Course`)
        .then(r => r.json())
        .then(data =>
          setFeaturedCourses(Array.isArray(data) ? data.slice(0, 3) : [])
        )
        .catch(() => { })

      if (user?.role === 'Student') {
        Promise.all([
          studentService.getDashboard(),
            fetch(`${config.API_BASE_URL}/Course`).then(r => r.json())
        ])
          .then(([dashData, coursesData]) => {
            const courses = Array.isArray(coursesData) ? coursesData : []

            if (dashData?.enrolledCourses) {
              dashData.enrolledCourses = dashData.enrolledCourses.map((e: any) => {
                const full = courses.find(
                  (c: any) => c.courseID === e.courseID
                )

                return {
                  ...e,
                  thumbnailURL: full?.thumbnailURL || ''
                }
              })
            }

            setDashboard(dashData)
          })
          .catch(() => { })

          fetch(`${config.API_BASE_URL}/Favorite`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(r => r.json())
          .then(data =>
            setSavedPatternsCount(Array.isArray(data) ? data.length : 0)
          )
          .catch(() => { })
      }
    } else {
        fetch(`${config.API_BASE_URL}/Course`)
        .then(r => r.json())
        .then(data =>
          setFeaturedCourses(Array.isArray(data) ? data.slice(0, 3) : [])
        )
        .catch(() => { })
    }
      fetch(`${config.API_BASE_URL}/Course`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllCourses(data)
          setFeaturedCourses(data.slice(0, 3))
        }
      })
  }, [isLoggedIn, user, router])

  if (isLoggedIn) {
    if (!user) return null

    // INSTRUCTOR HOME PAGE
    if (user.role === 'Instructor') {
      return (
        <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px' }}>

            {/* Bento grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: 'auto auto',
              gap: '16px',
              marginBottom: '40px',
            }}>

              {/* Hero card */}
              <div style={{
                gridColumn: '1 / 3',
                backgroundColor: '#2D6B5E',
                borderRadius: '20px',
                padding: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', right: '-20px', top: '-20px',
                  width: '180px', height: '180px', borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                }} />
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0,
                  overflow: 'hidden', backgroundColor: '#4A9B8E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {(user as any)?.profilePicture ? (
                    <img src={(user as any).profilePicture} alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="13" r="7" stroke="white" strokeWidth="1.8" fill="none" />
                      <path d="M4 32c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h2 style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem',
                    fontWeight: '700', color: 'white', marginBottom: '4px',
                  }}>
                    Welcome back, {user?.firstName}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                    Instructor · CrochetHub
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '100px',
                    padding: '5px 12px', fontFamily: 'var(--font-inter)',
                    fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', marginTop: '12px',
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7ECFBE' }} />
                    Active instructor
                  </div>
                </div>
              </div>

              {/* Rating card */}
              <div style={{
                gridColumn: '3', gridRow: '1 / 3',
                backgroundColor: 'var(--cream-light)', borderRadius: '20px',
                border: '1px solid var(--border)', padding: '24px',
                display: 'flex', flexDirection: 'column',
              }}>
                <p style={{
                  fontFamily: 'var(--font-inter)', fontSize: '0.7rem',
                  color: 'var(--text-muted)', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: '16px',
                }}>
                  Overall rating
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0 16px' }}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '3.5rem',
                    fontWeight: '700', color: '#7C2D3E', lineHeight: '1',
                  }}>
                    {(user as any)?.overallRating > 0 ? (user as any).overallRating.toFixed(1) : '—'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    {(user as any)?.overallRating > 0 ? '★★★★★' : 'No ratings yet'}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: 'auto' }}>
                  <p style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.7rem',
                    color: 'var(--text-muted)', letterSpacing: '0.1em',
                    textTransform: 'uppercase', marginBottom: '4px',
                  }}>
                    Experience
                  </p>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', fontWeight: '700', color: 'var(--text)' }}>
                    {(user as any)?.experienceYears || 0} years
                  </p>
                </div>
              </div>

              {/* Quick stat 1 */}
              <div style={{ backgroundColor: 'var(--cream-light)', borderRadius: '20px', border: '1px solid var(--border)', padding: '24px' }}>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  My Courses
                </p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: '700', color: 'var(--teal)' }}>
                  {allCourses.filter(
                    (c: any) => c.instructorName === `${user.firstName} ${user.lastName}`
                  ).length}                </p>
                <Link
                  href="/instructor/dashboard"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                    display: 'inline-block',
                    textDecoration: 'none'
                  }}
                >
                  View in dashboard →
                </Link>
              </div>

              {/* Quick stat 2 */}
              <div style={{ backgroundColor: 'var(--cream-light)', borderRadius: '20px', border: '1px solid var(--border)', padding: '24px' }}>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Total Students
                </p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: '700', color: 'var(--maroon)' }}>
  {allCourses
    .filter((c: any) => c.instructorName === `${user.firstName} ${user.lastName}`)
    .reduce((acc: number, c: any) => acc + (c.enrolledStudents || c.studentCount || c.totalEnrollments || 0), 0)
  }
</p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Across all courses
                </p>
              </div>
            </div>

            {/* Quick links */}
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: '700', color: 'var(--text)', marginBottom: '20px' }}>
              Quick Links
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
              {[
                { label: 'Teach', title: 'My Dashboard', href: '/instructor/dashboard', color: '#7C2D3E' },
                { label: 'Create', title: 'New Course', href: '/instructor/courses/new', color: 'var(--teal)' },
                { label: 'Connect', title: 'Community Forum', href: '/forum', color: '#5C1F2E' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
                    borderRadius: '20px', padding: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        {item.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: '600', color: 'var(--text)' }}>
                        {item.title}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: item.color, color: 'white',
                      padding: '8px 20px', borderRadius: '100px',
                      fontFamily: 'var(--font-inter)', fontSize: '0.82rem', fontWeight: '500',
                      whiteSpace: 'nowrap',
                    }}>
                      Go →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured courses */}
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: '700', color: 'var(--text)', marginTop: '40px', marginBottom: '20px' }}>
              Browse All Courses
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {featuredCourses.map((course: any) => (
                <Link key={course.courseID} href={`/courses/${course.courseID}`} style={{ textDecoration: 'none' }}>
                  <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{
                      height: '160px', backgroundColor: '#8FA89C',
                      backgroundImage: course.thumbnailURL ? `url(${course.thumbnailURL})` : undefined,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }} />
                    <div style={{ padding: '16px' }}>
                      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                        {course.title}
                      </p>
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {course.difficulty} · by {course.instructorName}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )
    }
    // ADMIN HOME PAGE
    if (user.role === 'Admin') {
      return (
        <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px' }}>

            {/* Bento grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: 'auto auto', gap: '16px', marginBottom: '40px',
            }}>

              {/* Hero card */}
              <div style={{
                gridColumn: '1 / 3',
                backgroundColor: '#2D6B5E',
                borderRadius: '20px', padding: '32px',
                display: 'flex', alignItems: 'center', gap: '24px',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', right: '-20px', top: '-20px',
                  width: '180px', height: '180px', borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                }} />
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.3)',
                  backgroundColor: '#2D6B5E', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="13" r="7" stroke="white" strokeWidth="1.8" fill="none" />
                    <path d="M4 32c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
                    Welcome back, {user?.firstName}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                    Administrator · CrochetHub
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '100px',
                    padding: '5px 12px', fontFamily: 'var(--font-inter)',
                    fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', marginTop: '12px',
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E8A0A8' }} />
                    All systems active
                  </div>
                </div>
              </div>

              {/* Platform status card */}
              <div style={{
                gridColumn: '3', gridRow: '1 / 3',
                backgroundColor: 'var(--cream-light)', borderRadius: '20px',
                border: '1px solid var(--border)', padding: '24px',
                display: 'flex', flexDirection: 'column',
              }}>
                <p style={{
                  fontFamily: 'var(--font-inter)', fontSize: '0.7rem',
                  color: 'var(--text-muted)', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: '16px',
                }}>
                  Platform
                </p>

                {/* Courses count — big number like the rating card */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0 16px' }}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '3.5rem',
                    fontWeight: '700', color: 'var(--teal)', lineHeight: '1',
                  }}>
                    {allCourses.length}+
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.78rem',
                    color: 'var(--text-muted)', marginTop: '8px',
                  }}>
                    courses available
                  </p>
                </div>

                {/* Divider + Status */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: 'auto' }}>
                  <p style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.7rem',
                    color: 'var(--text-muted)', letterSpacing: '0.1em',
                    textTransform: 'uppercase', marginBottom: '4px',
                  }}>
                    Status
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4A9B8E', flexShrink: 0 }} />
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', fontWeight: '700', color: 'var(--text)' }}>
                      Active
                    </p>
                  </div>
                </div>
              </div>

              {/* Stat 1 */}
              <div style={{ backgroundColor: 'var(--cream-light)', borderRadius: '20px', border: '1px solid var(--border)', padding: '24px' }}>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Admin Panel
                </p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--teal)', lineHeight: '1.2' }}>
                  Manage Users
                </p>
                <Link href="/admin/users" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'var(--teal)', textDecoration: 'none', marginTop: '8px', display: 'inline-block' }}>
                  Go to users →
                </Link>
              </div>

              {/* Stat 2 */}
              <div style={{ backgroundColor: 'var(--cream-light)', borderRadius: '20px', border: '1px solid var(--border)', padding: '24px' }}>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Moderation
                </p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--maroon)', lineHeight: '1.2' }}>
                  Forum & Content
                </p>
                <Link href="/admin/forum" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'var(--maroon)', textDecoration: 'none', marginTop: '8px', display: 'inline-block' }}>
                  Go to forum →
                </Link>
              </div>
            </div>

            {/* Quick links */}
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: '700', color: 'var(--text)', marginBottom: '20px' }}>
              Quick Links
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Admin', title: 'Dashboard', href: '/admin/dashboard', color: '#7C2D3E' },
                { label: 'Manage', title: 'Users', href: '/admin/users', color: 'var(--teal)' },
                { label: 'Manage', title: 'Courses', href: '/admin/courses', color: '#2D6B5E' },
                { label: 'Moderate', title: 'Forum', href: '/admin/forum', color: '#5C1F2E' },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
                    borderRadius: '20px', padding: '24px',
                  }}>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      {item.label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
                      {item.title}
                    </p>
                    <span style={{
                      display: 'inline-block', backgroundColor: item.color, color: 'white',
                      padding: '6px 16px', borderRadius: '100px',
                      fontFamily: 'var(--font-inter)', fontSize: '0.78rem', fontWeight: '500',
                    }}>
                      Go →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )
    }

    const enrolled = dashboard?.enrolledCourses || []
    const totalLessons = enrolled.reduce((acc: number, c: any) => acc + (c.totalLessons || 0), 0)
    const doneLessons = enrolled.reduce((acc: number, c: any) => acc + (c.completedLessons || 0), 0)
    const overallPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0
    const circumference = 2 * Math.PI * 40
    const dashOffset = circumference - (overallPct / 100) * circumference

    return (
      <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px' }}>

          {/* Bento grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: '16px',
            marginBottom: '40px',
          }}>
            {/* Hero card */}
            <div style={{
              gridColumn: '1 / 3',
              backgroundColor: '#2D6B5E',
              borderRadius: '20px',
              padding: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                right: '-20px',
                top: '-20px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.06)',
              }} />
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.3)',
                flexShrink: 0,
                overflow: 'hidden',
                backgroundColor: '#4A9B8E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {(user as any)?.profilePicture ? (
                  <img src={(user as any).profilePicture} alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="13" r="7" stroke="white" strokeWidth="1.8" fill="none" />
                    <path d="M4 32c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{
                  fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem',
                  fontWeight: '700', color: 'white', marginBottom: '4px',
                }}>
                  Welcome back, {user?.firstName}
                </h2>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                  {user?.role} · CrochetHub
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '100px',
                  padding: '5px 12px', fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', marginTop: '12px',
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E8A0A8' }} />
                  Active learner
                </div>
              </div>
            </div>

            {/* Progress ring card */}
            <div style={{
              gridColumn: '3', gridRow: '1 / 3',
              backgroundColor: 'var(--cream-light)', borderRadius: '20px',
              border: '1px solid var(--border)', padding: '24px',
              display: 'flex', flexDirection: 'column',
            }}>
              <p style={{
                fontFamily: 'var(--font-inter)', fontSize: '0.7rem',
                color: 'var(--text-muted)', letterSpacing: '0.1em',
                textTransform: 'uppercase', marginBottom: '16px',
              }}>
                Overall progress
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0 16px' }}>
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" stroke="var(--border)" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#7C2D3E" strokeWidth="8" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
                </svg>
                <div style={{
                  fontFamily: 'var(--font-cormorant)', fontSize: '2rem',
                  fontWeight: '700', color: 'var(--text)', marginTop: '-8px',
                }}>
                  {overallPct}%
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  lessons complete
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: 'auto' }}>
                <p style={{
                  fontFamily: 'var(--font-inter)', fontSize: '0.7rem',
                  color: 'var(--text-muted)', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: '4px',
                }}>
                  Courses enrolled
                </p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', fontWeight: '700', color: 'var(--text)' }}>
                  {enrolled.length}
                </p>
              </div>
            </div>

            {/* Stat 1 */}
            <div style={{ backgroundColor: 'var(--cream-light)', borderRadius: '20px', border: '1px solid var(--border)', padding: '24px' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Lessons done
              </p>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: '700', color: 'var(--teal)' }}>
                {doneLessons}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                of {totalLessons} total
              </p>
            </div>

            {/* Stat 2 */}
            <div style={{ backgroundColor: 'var(--cream-light)', borderRadius: '20px', border: '1px solid var(--border)', padding: '24px' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Patterns saved
              </p>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: '700', color: 'var(--maroon)' }}>
                {savedPatternsCount}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Browse the library
              </p>
            </div>
          </div>

          {/* My Courses section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
              My Courses
            </h2>
            <Link href="/courses" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--teal)', textDecoration: 'none' }}>
              Browse all →
            </Link>
          </div>

          {enrolled.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
              borderRadius: '20px', padding: '48px', textAlign: 'center', marginBottom: '32px',
            }}>
              <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)', marginBottom: '16px' }}>
                You haven't enrolled in any courses yet.
              </p>
              <Link href="/courses" style={{
                backgroundColor: 'var(--teal)', color: 'white', padding: '10px 24px',
                borderRadius: '100px', fontFamily: 'var(--font-inter)',
                fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', display: 'inline-block',
              }}>
                Browse Courses
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {enrolled.map((course: any, i: number) => (
                <div key={i} style={{
                  backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    backgroundColor: 'var(--teal)', flexShrink: 0,
                    backgroundImage: course.thumbnailURL ? `url(${course.thumbnailURL})` : undefined,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  }} />
                  <div style={{ flex: 1 }}>
                    <Link href={`/courses/${course.courseID}`} style={{ textDecoration: 'none' }}>
                      <p style={{
                        fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem',
                        fontWeight: '600', color: 'var(--text)', marginBottom: '8px',
                      }}>
                        {course.courseName}
                      </p>
                    </Link>
                    <div style={{ backgroundColor: 'var(--border)', borderRadius: '100px', height: '5px', width: '100%' }}>
                      <div style={{
                        backgroundColor: 'var(--teal)', borderRadius: '100px', height: '5px',
                        width: `${course.totalLessons > 0 ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0}%`,
                      }} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {course.totalLessons > 0 ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0}% complete
                    </p>
                    <Link href={`/courses/${course.courseID}/learn`} style={{
                      display: 'inline-block', marginTop: '12px', backgroundColor: '#7C2D3E',
                      color: 'white', padding: '7px 18px', borderRadius: '100px',
                      fontFamily: 'var(--font-inter)', fontSize: '0.78rem', fontWeight: '500', textDecoration: 'none',
                    }}>
                      Continue Learning →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Explore', title: 'Pattern Library', href: '/patterns', color: 'var(--maroon)' },
              { label: 'Connect', title: 'Community Forum', href: '/forum', color: 'var(--teal)' },
              { label: 'Profile', title: 'Update your info', href: '/profile', color: '#5C1F2E' },
            ].map((item, i) => (
              <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'var(--cream-light)', border: '1px solid var(--border)',
                  borderRadius: '20px', padding: '24px',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--text-muted)',
                    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px',
                  }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
                    {item.title}
                  </p>
                  <span style={{
                    display: 'inline-block', backgroundColor: item.color, color: 'white',
                    padding: '6px 16px', borderRadius: '100px',
                    fontFamily: 'var(--font-inter)', fontSize: '0.78rem', fontWeight: '500',
                  }}>
                    Go →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Landing page for logged out users
  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '80px 48px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'var(--teal-light)', color: 'var(--teal)',
            padding: '6px 14px', borderRadius: '100px', fontSize: '0.75rem',
            fontWeight: '500', fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em', marginBottom: '28px',
          }}>
            ✦ New Masterclass Series
          </div>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '4.5rem', fontWeight: '700',
            lineHeight: '1.1', color: 'var(--text)', marginBottom: '24px', letterSpacing: '-0.02em',
          }}>
            Master the Art <br />of the{' '}
            <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Stitch</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter)', fontSize: '1rem', lineHeight: '1.75',
            color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '440px',
          }}>
            Go from tangled threads to timeless treasures. Join our vibrant community of crafters
            and learn crochet through step-by-step journeys designed for your peace of mind.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/courses" style={{
              backgroundColor: 'var(--maroon)', color: 'white', padding: '14px 32px',
              borderRadius: '100px', fontFamily: 'var(--font-inter)',
              fontWeight: '500', fontSize: '0.95rem', textDecoration: 'none',
            }}>
              Start Learning →
            </Link>
            <Link href="/patterns" style={{
              border: '1.5px solid var(--border)', color: 'var(--text)', padding: '14px 32px',
              borderRadius: '100px', fontFamily: 'var(--font-inter)',
              fontWeight: '500', fontSize: '0.95rem', textDecoration: 'none',
            }}>
              Browse Patterns
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '40px', marginTop: '56px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
            {[
              { number: '12,000+', label: 'Active learners' },
              { number: '240+', label: 'Expert courses' },
              { number: '1,400+', label: 'Free patterns' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>
                  {stat.number}
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right bento */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Link href="/patterns" style={{ gridColumn: '1 / -1', textDecoration: 'none' }}>
            <div style={{ borderRadius: '20px', minHeight: '220px', overflow: 'hidden', position: 'relative' }}>
              <img src="/images/course5.jfif" alt="Pattern of the day" style={{
                width: '100%', height: '100%', objectFit: 'cover',
                position: 'absolute', top: 0, left: 0,
              }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                padding: '24px', color: 'white',
              }}>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-inter)', letterSpacing: '0.1em', opacity: 0.8, marginBottom: '8px' }}>
                  PATTERN OF THE DAY
                </div>
                <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: '600' }}>
                  Granny Squares Mastery
                </div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>
                  Intermediate · 2.5 Hours
                </div>
              </div>
            </div>
          </Link>

          <div style={{ backgroundColor: 'var(--maroon-light)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--maroon)', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '12px' }}>
              LATEST LESSON
            </div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', lineHeight: '1.3' }}>
              Perfecting the Magic Ring
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--teal-light)', borderRadius: '20px', padding: '24px', border: '1px solid #D0E5E0' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--teal)', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '12px' }}>
              COMMUNITY
            </div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', lineHeight: '1.3' }}>
              1,402 crafters online now
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses — real data */}
      <div style={{ backgroundColor: 'var(--cream-light)', padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Start your creative sanctuary
              </p>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem', fontWeight: '700', color: 'var(--text)' }}>
                Featured Courses
              </h2>
            </div>
            <Link href="/courses" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              View all courses →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {featuredCourses.length > 0 ? featuredCourses.map((course: any) => (
              <Link key={course.courseID} href={`/courses/${course.courseID}`} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{
                    height: '200px', position: 'relative', overflow: 'hidden',
                    backgroundColor: '#8FA89C',
                    backgroundImage: course.thumbnailURL ? `url(${course.thumbnailURL})` : undefined,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  }}>
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      <span style={{
                        backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 12px',
                        borderRadius: '100px', fontFamily: 'var(--font-inter)',
                        fontSize: '0.75rem', fontWeight: '500', color: 'var(--text)',
                      }}>
                        {course.totalLessons || 0} Lessons
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <span style={{
                      backgroundColor: 'var(--cream)', color: 'var(--text-secondary)',
                      padding: '3px 10px', borderRadius: '100px',
                      fontFamily: 'var(--font-inter)', fontSize: '0.7rem',
                      fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>
                      {course.difficulty}
                    </span>
                    <h3 style={{
                      fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem',
                      fontWeight: '600', color: 'var(--text)',
                      marginBottom: '8px', marginTop: '12px', lineHeight: '1.3',
                    }}>
                      {course.title}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      by {course.instructorName}
                    </p>
                  </div>
                </div>
              </Link>
            )) : (
              // fallback while loading
              [1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--cream)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    height: '320px',
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ backgroundColor: 'var(--maroon-dark)', padding: '100px 48px', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)', fontSize: '3.5rem', fontWeight: '700',
          fontStyle: 'italic', color: 'var(--cream)', marginBottom: '16px',
        }}>
          Ready to start stitching?
        </h2>
        <p style={{ fontFamily: 'var(--font-inter)', color: '#C4A8A8', marginBottom: '40px' }}>
          Join thousands of crochet enthusiasts on CrochetHub
        </p>
        <Link href="/register" style={{
          backgroundColor: 'var(--cream)', color: 'var(--maroon-dark)',
          padding: '16px 48px', borderRadius: '100px',
          fontFamily: 'var(--font-inter)', fontWeight: '600', textDecoration: 'none',
        }}>
          Join for Free
        </Link>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: 'var(--cream)', borderTop: '1px solid var(--border)', padding: '48px' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: '700', color: 'var(--text)', marginBottom: '12px' }}>
              CrochetHub
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '240px' }}>
              Connecting hobbyists and artists through the timeless art of the single hook.
            </p>
          </div>
          {[
            { title: 'Resources', links: ['Stitch Glossary', 'Yarn Weights', 'Community Guidelines'] },
            { title: 'Studio', links: ['Support', 'Privacy Policy', 'Contact Us'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers'] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'var(--font-inter)', fontSize: '0.7rem', fontWeight: '600',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--text-muted)', marginBottom: '16px',
              }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © 2025 CrochetHub. Made with patience and one stitch at a time.
          </p>
        </div>
      </div>
    </div>
  )
}