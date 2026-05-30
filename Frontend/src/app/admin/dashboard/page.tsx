'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface Stats {
  totalUsers: number
  totalStudents: number
  totalInstructors: number
  totalCourses: number
  totalPatterns: number
  totalEnrollments: number
  totalForumThreads: number
  totalForumReplies: number
}

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (user?.role !== 'Admin') { router.push('/'); return }

    apiFetch('/Admin/dashboard')
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isLoggedIn, user, router])

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, color: '#7C2D3E' },
    { label: 'Students', value: stats.totalStudents, color: 'var(--teal)' },
    { label: 'Instructors', value: stats.totalInstructors, color: '#2D6B5E' },
    { label: 'Courses', value: stats.totalCourses, color: '#7C2D3E' },
    { label: 'Patterns', value: stats.totalPatterns, color: 'var(--teal)' },
    { label: 'Enrollments', value: stats.totalEnrollments, color: '#2D6B5E' },
    { label: 'Forum Threads', value: stats.totalForumThreads, color: '#7C2D3E' },
    { label: 'Forum Replies', value: stats.totalForumReplies, color: 'var(--teal)' },
  ] : []

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{
            fontFamily: 'var(--font-inter)', fontSize: '0.8rem',
            color: 'var(--teal)', fontWeight: '500', marginBottom: '6px',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            Admin Panel
          </p>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem',
            fontWeight: '700', color: 'var(--text)',
          }}>
            Dashboard
          </h1>
        </div>

        {/* Stats grid */}
        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '48px',
          }}>
            {statCards.map((stat, i) => (
              <div key={i} style={{
                backgroundColor: 'var(--cream-light)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                padding: '24px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-inter)', fontSize: '0.7rem',
                  color: 'var(--text-muted)', textTransform: 'uppercase',
                  letterSpacing: '0.1em', marginBottom: '8px',
                }}>
                  {stat.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem',
                  fontWeight: '700', color: stat.color,
                }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          {[
            { title: 'Manage Users', desc: 'View, edit roles and delete users', href: '/admin/users', color: '#7C2D3E' },
            { title: 'Manage Courses', desc: 'View and delete all courses', href: '/admin/courses', color: 'var(--teal)' },
            { title: 'Manage Forum', desc: 'Moderate forum threads', href: '/admin/forum', color: '#2D6B5E' },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'var(--cream-light)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: '32px',
                cursor: 'pointer',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem',
                  fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-inter)', fontSize: '0.875rem',
                  color: 'var(--text-muted)', marginBottom: '20px',
                }}>
                  {item.desc}
                </p>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: item.color,
                  color: 'white', padding: '8px 20px',
                  borderRadius: '100px', fontFamily: 'var(--font-inter)',
                  fontSize: '0.82rem', fontWeight: '500',
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