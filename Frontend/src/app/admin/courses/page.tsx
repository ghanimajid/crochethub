'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/services/api'

interface Course {
  courseID: number
  title: string
  firstName: string
  lastName: string
  totalEnrolled: number
  avgRating: number | null
  createdAt: string
}

export default function AdminCoursesPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingCourse, setDeletingCourse] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (user?.role !== 'Admin') { router.push('/'); return }

    apiFetch('/Admin/courses')
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [isLoggedIn, user, router])

  async function handleDelete(courseID: number) {
    if (!confirm('Delete this course? This cannot be undone.')) return
    setDeletingCourse(courseID)
    try {
      await apiFetch(`/Course/${courseID}`, { method: 'DELETE' })
      setCourses(prev => prev.filter(c => c.courseID !== courseID))
    } catch {
      alert('Cannot delete — course may have enrolled students.')
    } finally {
      setDeletingCourse(null)
    }
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>

        <a href="/admin/dashboard" style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.85rem',
          color: 'var(--text-muted)', textDecoration: 'none',
          display: 'inline-block', marginBottom: '32px',
        }}>
          ← Back to Dashboard
        </a>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontSize: '2.8rem',
            fontWeight: '700', color: 'var(--text)', marginBottom: '8px',
          }}>
            Manage Courses
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>
            {courses.length} total courses
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by title or instructor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '480px', padding: '14px 20px',
            backgroundColor: 'white', border: '1.5px solid var(--border)',
            borderRadius: '100px', fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem', color: 'var(--text)', outline: 'none',
            display: 'block', marginBottom: '24px', boxSizing: 'border-box',
          }}
        />

        {loading ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(course => (
              <div key={course.courseID} style={{
                backgroundColor: 'var(--cream-light)',
                border: '1px solid var(--border)',
                borderRadius: '16px', padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem',
                    fontWeight: '600', color: 'var(--text)', marginBottom: '4px',
                  }}>
                    {course.title}
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      by {course.firstName} {course.lastName}
                    </span>

                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {course.totalEnrolled || 0} students
                    </span>
                  </div>
                </div>
                <Link href={`/courses/${course.courseID}`} style={{
                  color: 'var(--teal)', fontFamily: 'var(--font-inter)',
                  fontSize: '0.82rem', textDecoration: 'none',
                  border: '1.5px solid var(--teal)', padding: '8px 16px',
                  borderRadius: '100px',
                }}>
                  View
                </Link>
                <button
                  onClick={() => handleDelete(course.courseID)}
                  disabled={deletingCourse === course.courseID}
                  style={{
                    backgroundColor: 'transparent', border: '1.5px solid #E8B4A8',
                    color: '#C0392B', padding: '8px 16px', borderRadius: '100px',
                    fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
                    fontWeight: '500', cursor: 'pointer',
                  }}
                >
                  {deletingCourse === course.courseID ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}